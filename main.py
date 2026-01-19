import os
import shutil
import uuid
import math
import aiofiles
from datetime import datetime
from typing import List
from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

# 우리가 만든 조판 핵심 로직과 DB 모듈 불러오기
from Auto_Imposition_Logic import PhotoBookDesigner
import database as db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
RESULT_DIR = os.path.join(BASE_DIR, "results")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(RESULT_DIR, exist_ok=True)

app.mount("/results", StaticFiles(directory=RESULT_DIR), name="results")

# --- 작업 함수 (PDF 생성) ---
def process_photobook(order_id: str, cover_path: str, inside_paths: List[str], title: str, subtitle: str, cover_style: str):
    print(f"🏭 [작업시작] {order_id} - {title}")
    db.update_status(order_id, "제작중") # DB 상태 업데이트

    work_dir = os.path.join(UPLOAD_DIR, order_id)
    cover_dir = os.path.join(work_dir, "cover")
    inside_dir = os.path.join(work_dir, "inside")
    output_dir = os.path.join(RESULT_DIR, order_id)
    
    os.makedirs(cover_dir, exist_ok=True)
    os.makedirs(inside_dir, exist_ok=True)
    os.makedirs(output_dir, exist_ok=True)

    if cover_path and os.path.exists(cover_path):
        shutil.move(cover_path, os.path.join(cover_dir, f"cover_image{os.path.splitext(cover_path)[1]}"))
    
    with open(os.path.join(cover_dir, "title.txt"), "w", encoding="utf-8") as f:
        f.write(f"{title}\n{subtitle}")

    for idx, path in enumerate(inside_paths):
        if os.path.exists(path):
            safe_idx = f"{idx:03d}"
            shutil.move(path, os.path.join(inside_dir, f"img_{safe_idx}{os.path.splitext(path)[1]}"))

    font_dir = os.path.join(BASE_DIR, "fonts")
    clipart_dir = os.path.join(BASE_DIR, "cliparts")
    
    try:
        designer = PhotoBookDesigner(page_size_mm=(226, 286), dpi=300)
        designer.load_resources(clipart_dir, font_dir)
        photos_info = designer.load_images(inside_dir)
        
        if photos_info:
            # 선택한 표지 스타일로 생성
            designer.generate_cover(cover_dir, output_dir, selected_style=cover_style)
            designer.create_photobook(photos_info)
            designer.save_book(output_dir)
            
            print(f"✅ [제작완료] {order_id}")
            db.update_status(order_id, "제작완료") # DB 상태 업데이트
        else:
            print("⚠️ 사진 없음")
            db.update_status(order_id, "오류(사진없음)")
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        db.update_status(order_id, "제작오류")

# --- API 엔드포인트 ---

@app.post("/api/admin/login")
async def admin_login(password: str = Form(...)):
    if db.check_password(password):
        return {"success": True, "message": "로그인 성공!"}
    else:
        return JSONResponse(status_code=401, content={"success": False, "message": "비밀번호가 틀렸습니다."})

@app.post("/api/admin/change_password")
async def change_password(current_password: str = Form(...), new_password: str = Form(...)):
    if not db.check_password(current_password):
        return JSONResponse(status_code=401, content={"success": False, "message": "현재 비밀번호가 일치하지 않습니다."})
    
    db.change_password(new_password)
    return {"success": True, "message": "비밀번호가 변경되었습니다."}


@app.post("/api/order")
async def create_order(
    background_tasks: BackgroundTasks,
    cover_photo: UploadFile = File(None),
    inside_photos: List[UploadFile] = File(...),
    title: str = Form(...),
    username: str = Form(...),
    phone: str = Form(...),
    address: str = Form(...),
    quantity: int = Form(1),
    cover_style: str = Form('BAND')
):
    order_id = f"{datetime.now().strftime('%Y%m%d')}_{uuid.uuid4().hex[:6]}"
    temp_dir = os.path.join(UPLOAD_DIR, f"temp_{order_id}")
    os.makedirs(temp_dir, exist_ok=True)
    
    cover_path = None
    if cover_photo:
        safe_cover = f"cover_{uuid.uuid4().hex[:4]}_{cover_photo.filename}"
        cover_path = os.path.join(temp_dir, safe_cover)
        async with aiofiles.open(cover_path, 'wb') as f:
            await f.write(await cover_photo.read())
            
    saved_inside_paths = []
    for idx, photo in enumerate(inside_photos):
        safe_name = f"in_{idx}_{uuid.uuid4().hex[:4]}_{photo.filename}"
        path = os.path.join(temp_dir, safe_name)
        async with aiofiles.open(path, 'wb') as f:
            await f.write(await photo.read())
        saved_inside_paths.append(path)

    photo_count = len(saved_inside_paths)
    est_pages = math.ceil(photo_count / 2)
    unit_price = 7800 + (max(0, est_pages - 20) * 200)
    total_price = (unit_price * quantity) + 3500
    
    # DB에 저장할 데이터 구조 구성
    order_entry = {
        "id": order_id,
        "date": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "status": "접수됨",
        "user": {"name": username, "phone": phone, "addr": address},
        "info": {
            "title": title, 
            "pages": est_pages, 
            "photos": photo_count, 
            "price": total_price,
            "quantity": quantity,
            "style": cover_style
        },
        "files": {
            "cover": f"/results/{order_id}/Cover.pdf",
            "inner": f"/results/{order_id}/Inner_Pages.pdf"
        }
    }
    
    # ★ JSON 파일 대신 DB 함수 호출!
    db.add_order(order_entry)

    subtitle = datetime.now().strftime("%Y . %m . %d")
    background_tasks.add_task(process_photobook, order_id, cover_path, saved_inside_paths, title, subtitle, cover_style)
    
    return {"message": "OK", "order_id": order_id}

@app.get("/api/admin/orders")
def get_orders_api():
    # ★ JSON 파일 대신 DB 함수 호출!
    return db.get_orders()

@app.post("/api/admin/status")
async def update_status_api(order_id: str = Form(...), status: str = Form(...)):
    # ★ JSON 파일 대신 DB 함수 호출!
    db.update_status(order_id, status)
    return {"msg": "updated"}

@app.get("/admin", response_class=HTMLResponse)
async def admin_page():
    if os.path.exists("admin.html"):
        with open("admin.html", "r", encoding="utf-8") as f:
            return f.read()
    return "admin.html 파일이 없습니다."

if __name__ == "__main__":
    import uvicorn
    print("🚀 포토북 본부 가동! (http://127.0.0.1:8000)")
    uvicorn.run(app, host="0.0.0.0", port=8000)