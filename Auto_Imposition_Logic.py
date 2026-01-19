import os
import random
import math
import warnings
import platform
from datetime import datetime
from PIL import Image, ImageDraw, ImageOps, ExifTags, ImageFont, ImageFile

# [중요] 대용량 이미지 경고 무시
Image.MAX_IMAGE_PIXELS = None 
warnings.simplefilter('ignore', Image.DecompressionBombWarning) 
ImageFile.LOAD_TRUNCATED_IMAGES = True 

class PhotoBookDesigner:
    def __init__(self, page_size_mm=(226, 286), dpi=300, safe_margin_mm=10, use_clipart=True, use_text=True):
        self.dpi = dpi
        self.page_width = self.mm_to_px(page_size_mm[0])
        self.page_height = self.mm_to_px(page_size_mm[1])
        self.margin = self.mm_to_px(safe_margin_mm)
        self.bleed = self.mm_to_px(3)
        
        max_side_px = max(self.page_width, self.page_height)
        self.max_image_px = int(max_side_px * 1.5)
        
        self.use_clipart = use_clipart
        self.use_text = use_text
        
        self.pages = []
        self.cliparts = []
        self.cached_inner_photos = [] 
        
        self.quotes = [
            "Adventure Awaits", "Collect Moments", "Life is a Journey", 
            "Travel More", "Good Vibes Only", "Vacation Mode: ON"
        ]
        
        self.font_paths = []

    def mm_to_px(self, mm):
        return int(mm * self.dpi / 25.4)

    def optimize_image_size(self, img):
        width, height = img.size
        longest_side = max(width, height)
        if longest_side > self.max_image_px:
            ratio = self.max_image_px / float(longest_side)
            new_width = int(width * ratio)
            new_height = int(height * ratio)
            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            return img, True 
        return img, False 

    def get_capture_time(self, img):
        try:
            exif = img._getexif()
            if not exif: return None
            for tag_id in [36867, 306]:
                if tag_id in exif:
                    date_str = exif[tag_id]
                    return datetime.strptime(date_str, "%Y:%m:%d %H:%M:%S")
        except: pass
        return None

    def load_resources(self, clipart_folder, font_folder=None):
        if self.use_clipart and os.path.exists(clipart_folder):
            valid_extensions = ['.png']
            file_list = [f for f in os.listdir(clipart_folder) if os.path.splitext(f)[1].lower() in valid_extensions]
            for filename in file_list:
                try:
                    path = os.path.join(clipart_folder, filename)
                    img = Image.open(path).convert("RGBA")
                    self.cliparts.append(img)
                except: pass

        if font_folder and os.path.exists(font_folder):
            abs_font_folder = os.path.abspath(font_folder)
            fonts = [f for f in os.listdir(abs_font_folder) if f.lower().endswith('.ttf') or f.lower().endswith('.otf')]
            if fonts:
                self.font_paths = [os.path.join(abs_font_folder, f) for f in fonts]
        
        if not self.font_paths:
            system_fonts = []
            os_name = platform.system()
            if os_name == "Windows": font_candidates = ["malgun.ttf", "gulim.ttc", "arial.ttf"]
            elif os_name == "Darwin": font_candidates = ["AppleGothic.ttf", "Arial.ttf"]
            else: font_candidates = ["NanumGothic.ttf", "DejaVuSans.ttf"]

            for f_name in font_candidates:
                possible_paths = [
                    os.path.join("C:/Windows/Fonts", f_name),
                    os.path.join("/Library/Fonts", f_name),
                    os.path.join("/usr/share/fonts/truetype/nanum", f_name)
                ]
                for p in possible_paths:
                    if os.path.exists(p):
                        self.font_paths.append(p)
                        break
                if self.font_paths: break

    def load_images(self, folder_path):
        images_info = []
        valid_extensions = ['.jpg', '.jpeg', '.png', '.tif']
        file_list = [f for f in os.listdir(folder_path) if os.path.splitext(f)[1].lower() in valid_extensions]

        for filename in file_list:
            path = os.path.join(folder_path, filename)
            try:
                img = Image.open(path)
                if img.format == 'JPEG' and (img.width > self.max_image_px or img.height > self.max_image_px):
                    img.draft('RGB', (self.max_image_px, self.max_image_px))
                
                img = ImageOps.exif_transpose(img) 
                if img.mode not in ['RGB', 'RGBA']:
                    img = img.convert('RGB')
                
                img, _ = self.optimize_image_size(img)
                
                capture_time = self.get_capture_time(img)
                if capture_time is None:
                    timestamp = os.path.getmtime(path)
                    capture_time = datetime.fromtimestamp(timestamp)
                
                images_info.append({'img': img, 'time': capture_time, 'filename': filename})
            except: pass
        
        images_info.sort(key=lambda x: x['time'])
        self.cached_inner_photos = [info['img'] for info in images_info]
        return images_info
        
    def get_font_fitted_to_width(self, text, width_ratio):
        target_width = int(self.page_width * width_ratio)
        font_path = random.choice(self.font_paths) if self.font_paths else None
        base_size = 100
        
        try:
            font = ImageFont.truetype(font_path, base_size) if font_path else ImageFont.load_default()
        except: return ImageFont.load_default()

        dummy = ImageDraw.Draw(Image.new("RGB", (1, 1)))
        try:
            bbox = dummy.textbbox((0, 0), text, font=font)
            text_width = bbox[2] - bbox[0]
        except: return font

        if text_width > 0:
            new_size = int(base_size * (target_width / text_width))
            new_size = max(10, min(new_size, int(self.page_height * 0.3)))
            try: return ImageFont.truetype(font_path, new_size)
            except: return font
        return font

    def get_random_font(self, size_ratio):
        font_size = int(self.page_width * size_ratio)
        if self.font_paths:
            font_path = random.choice(self.font_paths)
            try: return ImageFont.truetype(font_path, font_size)
            except: pass
        return ImageFont.load_default()

    def generate_cover(self, cover_folder, output_folder, selected_style='FULL'):
        """
        [수정됨] 사용자가 선택한 스타일(selected_style) 하나만 생성
        - FULL: 매거진 풀 커버
        - MODERN: 갤러리 모던
        - COLLAGE: 4컷 그리드
        """
        if not os.path.exists(cover_folder): return
        if not os.path.exists(output_folder): os.makedirs(output_folder)

        title = "PHOTO BOOK"
        subtitle = datetime.now().strftime("%Y . %m . %d")
        txt_path = os.path.join(cover_folder, "title.txt")
        if os.path.exists(txt_path):
            try:
                with open(txt_path, 'r', encoding='utf-8') as f:
                    lines = [l.strip() for l in f.readlines() if l.strip()]
                    if len(lines) > 0: title = lines[0]
                    if len(lines) > 1: subtitle = lines[1]
            except: pass
        
        cover_imgs = []
        valid_extensions = ['.jpg', '.jpeg', '.png', '.tif']
        for f in os.listdir(cover_folder):
            if os.path.splitext(f)[1].lower() in valid_extensions:
                try:
                    img = Image.open(os.path.join(cover_folder, f))
                    img = ImageOps.exif_transpose(img)
                    if img.mode != 'RGB': img = img.convert('RGB')
                    cover_imgs.append(img)
                except: pass
        
        if not cover_imgs: return
        hero_img = cover_imgs[0] 

        t_font = self.get_font_fitted_to_width(title, 0.7)
        s_font = self.get_font_fitted_to_width(subtitle, 0.3)

        # 스타일 이름 정규화 (대소문자 무시)
        style_key = selected_style.upper()
        
        print(f"🎨 선택된 표지 스타일 [{style_key}] 제작 시작!")
        
        try:
            cover_page = None
            if style_key == 'COLLAGE':
                # 콜라주 생성 로직
                collage_imgs = [hero_img]
                if self.cached_inner_photos:
                    extras = random.sample(self.cached_inner_photos, min(len(self.cached_inner_photos), 3))
                    collage_imgs.extend(extras)
                while len(collage_imgs) < 4:
                    collage_imgs.append(hero_img)
                
                ct_font = self.get_font_fitted_to_width(title, 0.5)
                cs_font = self.get_font_fitted_to_width(subtitle, 0.2)
                cover_page = self.design_collage_cover(collage_imgs[:4], title, subtitle, ct_font, cs_font)
            
            elif style_key == 'MODERN':
                 cover_page = self.design_single_cover(hero_img, 'modern', title, subtitle, t_font, s_font)
            
            else: # 기본값 FULL (MAGAZINE)
                 cover_page = self.design_single_cover(hero_img, 'full', title, subtitle, t_font, s_font)

            # 단일 파일 저장 (이름: Cover.pdf)
            if cover_page:
                cover_page.save(os.path.join(output_folder, "Cover.pdf"), "PDF", resolution=self.dpi)
                print(f"✨ 표지 PDF 생성 완료: Cover.pdf")

        except Exception as e: 
            print(f"⚠️ 표지 생성 실패: {e}")

    def design_single_cover(self, hero_img, style, title, subtitle, t_font, s_font):
        page = Image.new('RGB', (self.page_width, self.page_height), (255, 255, 255))
        draw = ImageDraw.Draw(page)
        
        try:
            tb = draw.textbbox((0,0), title, font=t_font)
            th = tb[3] - tb[1]
        except: th = 100

        if style == 'full':
            img = ImageOps.fit(hero_img, (self.page_width, self.page_height), method=Image.Resampling.LANCZOS)
            page.paste(img, (0, 0))
            overlay = Image.new('RGBA', page.size, (0, 0, 0, 80))
            page.paste(overlay, (0, 0), overlay)
            cy = self.page_height // 2
            self.draw_text_center(draw, title, t_font, cy - th, (255,255,255), (0,0,0))
            self.draw_text_center(draw, subtitle, s_font, cy + th + 20, (255,255,255), (0,0,0))

        elif style == 'modern':
            ih = int(self.page_height * 0.75)
            img = ImageOps.fit(hero_img, (self.page_width, ih), method=Image.Resampling.LANCZOS)
            page.paste(img, (0, 0))
            cy = ih + (self.page_height - ih) // 2
            self.draw_text_center(draw, title, t_font, cy - th, (30,30,30), (255,255,255))
            self.draw_text_center(draw, subtitle, s_font, cy + th + 20, (100,100,100), (255,255,255))

        return page

    def design_collage_cover(self, images, title, subtitle, t_font, s_font):
        page = Image.new('RGB', (self.page_width, self.page_height), (255, 255, 255))
        draw = ImageDraw.Draw(page)
        cw, ch = self.page_width // 2, self.page_height // 2
        coords = [(0,0), (cw,0), (0,ch), (cw,ch)]
        for i, img in enumerate(images):
            if i >= 4: break
            p_img = ImageOps.fit(img, (cw, ch), method=Image.Resampling.LANCZOS)
            page.paste(p_img, coords[i])

        bw, bh = int(self.page_width * 0.7), int(self.page_height * 0.25)
        bx, by = (self.page_width - bw) // 2, (self.page_height - bh) // 2
        box = Image.new('RGBA', (bw, bh), (255, 255, 255, 230))
        page.paste(box, (bx, by), box)

        try:
            tb = draw.textbbox((0,0), title, font=t_font)
            th = tb[3] - tb[1]
        except: th = 50
        cy = self.page_height // 2
        self.draw_text_center(draw, title, t_font, cy - th, (30,30,30), (255,255,255))
        self.draw_text_center(draw, subtitle, s_font, cy + th + 20, (100,100,100), (255,255,255))
        return page

    def draw_text_center(self, draw, text, font, y, fill, stroke=None):
        try:
            tb = draw.textbbox((0,0), text, font=font)
            tw = tb[2] - tb[0]
            x = (self.page_width - tw) // 2
            sw = int(font.size * 0.02) if stroke else 0
            if stroke and sw < 2: sw = 2
            draw.text((x, y), text, font=font, fill=fill, stroke_width=sw, stroke_fill=stroke)
        except: pass

    def create_photobook(self, images_info):
        landscapes = [i['img'] for i in images_info if i['img'].width >= i['img'].height]
        portraits = [i['img'] for i in images_info if i['img'].width < i['img'].height]
        
        while landscapes or portraits:
            options = []
            if len(portraits) >= 2 and len(landscapes) >= 1: options.append('Mix_2P_1L')
            if len(landscapes) >= 1 and len(portraits) >= 2: options.append('Mix_1L_2P')
            if len(landscapes) >= 2: options.append('L2')
            if len(portraits) >= 4: options.append('P4')
            
            if not options:
                if landscapes: self.pages.append(self.design_layout([landscapes.pop(0)], [], 'L1'))
                elif portraits: self.pages.append(self.design_layout([], [portraits.pop(0)], 'P1_70'))
                continue

            choice = random.choice(options)
            bl, bp = [], []
            if choice == 'L2': bl = landscapes[:2]; landscapes = landscapes[2:]
            elif choice == 'P4': bp = portraits[:4]; portraits = portraits[4:]
            elif choice == 'Mix_2P_1L': bp = portraits[:2]; portraits = portraits[2:]; bl = landscapes[:1]; landscapes = landscapes[1:]
            elif choice == 'Mix_1L_2P': bl = landscapes[:1]; landscapes = landscapes[1:]; bp = portraits[:2]; portraits = portraits[2:]

            self.pages.append(self.design_layout(bl, bp, choice))

    def design_layout(self, landscapes, portraits, layout_type):
        page = Image.new('RGB', (self.page_width, self.page_height), (255, 255, 255))
        sx, sy = self.margin, self.margin
        w, h = self.page_width - 2*sx, self.page_height - 2*sy
        gap = self.mm_to_px(5)
        slots = []

        if layout_type == 'L2':
            hh = (h - gap) // 2
            slots = [(landscapes[0], sx, sy, w, hh), (landscapes[1], sx, sy+hh+gap, w, hh)]
        elif layout_type == 'Mix_2P_1L':
            hh, hw = (h-gap)//2, (w-gap)//2
            slots = [(portraits[0], sx, sy, hw, hh), (portraits[1], sx+hw+gap, sy, hw, hh), (landscapes[0], sx, sy+hh+gap, w, hh)]
        elif layout_type == 'Mix_1L_2P':
            hh, hw = (h-gap)//2, (w-gap)//2
            slots = [(landscapes[0], sx, sy, w, hh), (portraits[0], sx, sy+hh+gap, hw, hh), (portraits[1], sx+hw+gap, sy+hh+gap, hw, hh)]
        elif layout_type == 'P4':
            hh, hw = (h-gap)//2, (w-gap)//2
            slots = [(portraits[0], sx, sy, hw, hh), (portraits[1], sx+hw+gap, sy, hw, hh), 
                     (portraits[2], sx, sy+hh+gap, hw, hh), (portraits[3], sx+hw+gap, sy+hh+gap, hw, hh)]
        elif layout_type == 'P1_70':
            th = int(h * 0.7); tw = int(th * (portraits[0].width / portraits[0].height))
            if tw > w: tw = w; th = int(tw * (portraits[0].height / portraits[0].width))
            slots = [(portraits[0], sx + (w-tw)//2, sy + (h-th)//2, tw, th)]
        elif layout_type == 'L1':
            tw = w; th = int(tw * (landscapes[0].height / landscapes[0].width))
            if th > h: th = h; tw = int(th * (landscapes[0].width / landscapes[0].height))
            slots = [(landscapes[0], sx + (w-tw)//2, sy + (h-th)//2, tw, th)]

        for img, x, y, iw, ih in slots:
            p = ImageOps.fit(img, (iw, ih), method=Image.Resampling.LANCZOS)
            page.paste(p, (x, y))

        if self.use_clipart and self.cliparts and random.random() > 0.7:
            sticker = random.choice(self.cliparts)
            sw = int(self.page_width * 0.15)
            sh = int(sticker.height * (sw / sticker.width))
            s_img = sticker.resize((sw, sh)).rotate(random.randint(-20,20), expand=True)
            px, py = random.randint(0, self.page_width-sw), random.randint(0, self.page_height-sh)
            page.paste(s_img, (px, py), s_img)

        if self.use_text and random.random() > 0.6:
            txt = random.choice(self.quotes)
            f = self.get_random_font(0.05)
            try:
                tb = draw.textbbox((0,0), txt, font=f)
                tx = (self.page_width - (tb[2]-tb[0])) // 2
                ty = self.page_height - self.margin - 50
                draw = ImageDraw.Draw(page)
                draw.text((tx, ty), txt, font=f, fill=(50,50,50))
            except: pass

        return page

    def save_book(self, output_folder):
        if not self.pages: return
        path = os.path.join(output_folder, "Inner_Pages.pdf")
        self.pages[0].save(path, "PDF", resolution=self.dpi, save_all=True, append_images=self.pages[1:])

if __name__ == "__main__":
    designer = PhotoBookDesigner()