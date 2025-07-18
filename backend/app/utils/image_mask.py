from PIL import Image, ImageDraw

def mask_image(src_path: str, detections: list, dst_path: str):
    img = Image.open(src_path).convert("RGB")
    draw = ImageDraw.Draw(img)
    for det in detections:
        bbox = det["bbox"]
        xs = [p[0] for p in bbox]
        ys = [p[1] for p in bbox]
        draw.rectangle([min(xs), min(ys), max(xs), max(ys)], fill="black")
    img.save(dst_path)
