import sqlite3
import bcrypt  # 암호화 도구
from datetime import datetime

DB_PATH = "photobook.db"

def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()
        c.execute('''
            CREATE TABLE IF NOT EXISTS orders (
                id TEXT PRIMARY KEY,
                created_at TEXT,
                status TEXT,
                title TEXT,
                customer_name TEXT,
                customer_phone TEXT,
                customer_addr TEXT,
                photo_count INTEGER,
                page_count INTEGER,
                total_price INTEGER,
                quantity INTEGER,
                cover_style TEXT,
                cover_pdf_path TEXT,
                inner_pdf_path TEXT
            )
        ''')
        c.execute('''
            CREATE TABLE IF NOT EXISTS admin (
                key TEXT PRIMARY KEY,
                value TEXT
            )
        ''')
        
        # 초기 비밀번호 설정 (이미 있으면 패스)
        c.execute("SELECT value FROM admin WHERE key='password'")
        if not c.fetchone():
            # '153153'을 암호화해서 저장
            hashed_pw = bcrypt.hashpw("153153".encode('utf-8'), bcrypt.gensalt())
            c.execute("INSERT INTO admin (key, value) VALUES ('password', ?)", (hashed_pw.decode('utf-8'),))
            print("🔑 [보안] 초기 비밀번호(153153)가 암호화되어 저장되었습니다.")
        
        conn.commit()

# --- 주문 관련 ---
def add_order(order_dict):
    with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()
        c.execute("INSERT INTO orders VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (
            order_dict['id'], order_dict['date'], order_dict['status'],
            order_dict['info']['title'], order_dict['user']['name'], order_dict['user']['phone'], order_dict['user']['addr'],
            order_dict['info']['photos'], order_dict['info']['pages'], order_dict['info']['price'],
            order_dict['info']['quantity'], order_dict['info']['style'],
            order_dict['files']['cover'], order_dict['files']['inner']
        ))
        conn.commit()

def get_orders():
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        c.execute("SELECT * FROM orders ORDER BY created_at DESC")
        rows = c.fetchall()
        results = []
        for row in rows:
            results.append({
                "id": row['id'], "date": row['created_at'], "status": row['status'],
                "user": { "name": row['customer_name'], "phone": row['customer_phone'], "addr": row['customer_addr'] },
                "info": { 
                    "title": row['title'], "photos": row['photo_count'], "pages": row['page_count'], 
                    "price": row['total_price'], "quantity": row['quantity'], "style": row['cover_style']
                },
                "files": { "cover": row['cover_pdf_path'], "inner": row['inner_pdf_path'] }
            })
        return results

def update_status(order_id, status):
    with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()
        c.execute("UPDATE orders SET status=? WHERE id=?", (status, order_id))
        conn.commit()

# --- 보안(비밀번호) 관련 ---

def check_password(input_pw):
    """입력받은 비밀번호가 암호화된 비밀번호와 일치하는지 확인"""
    with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()
        c.execute("SELECT value FROM admin WHERE key='password'")
        row = c.fetchone()
        if row:
            hashed_pw = row[0].encode('utf-8')
            # bcrypt로 검증
            return bcrypt.checkpw(input_pw.encode('utf-8'), hashed_pw)
        return False

def change_password(new_pw):
    """새 비밀번호를 암호화해서 저장"""
    with sqlite3.connect(DB_PATH) as conn:
        hashed_new_pw = bcrypt.hashpw(new_pw.encode('utf-8'), bcrypt.gensalt())
        c = conn.cursor()
        c.execute("UPDATE admin SET value=? WHERE key='password'", (hashed_new_pw.decode('utf-8'),))
        conn.commit()

# 실행 시 DB 초기화
init_db()