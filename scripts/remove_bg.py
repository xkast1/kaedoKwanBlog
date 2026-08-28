"""Elimina el fondo (blanco o damero de transparencia) del logo mediante flood-fill desde los bordes."""
from collections import deque

from PIL import Image

SRC = "assets/img/logo.png"
DST = "assets/img/logo.png"

im = Image.open(SRC).convert("RGBA")
w, h = im.size
px = im.load()


def is_background(p):
    r, g, b, _ = p
    # Blanco o grises claros del damero de transparencia
    return r > 180 and g > 180 and b > 180 and abs(r - g) < 25 and abs(g - b) < 25 and abs(r - b) < 25


visited = bytearray(w * h)
queue = deque()

for x in range(w):
    for y in (0, h - 1):
        if is_background(px[x, y]):
            queue.append((x, y))
            visited[y * w + x] = 1
for y in range(h):
    for x in (0, w - 1):
        if is_background(px[x, y]) and not visited[y * w + x]:
            queue.append((x, y))
            visited[y * w + x] = 1

while queue:
    x, y = queue.popleft()
    px[x, y] = (0, 0, 0, 0)
    for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
        if 0 <= nx < w and 0 <= ny < h and not visited[ny * w + nx] and is_background(px[nx, ny]):
            visited[ny * w + nx] = 1
            queue.append((nx, ny))

# Recorta al contenido visible con un pequeño margen
bbox = im.getbbox()
if bbox:
    margin = 10
    bbox = (
        max(0, bbox[0] - margin),
        max(0, bbox[1] - margin),
        min(w, bbox[2] + margin),
        min(h, bbox[3] + margin),
    )
    im = im.crop(bbox)

im.save(DST, "PNG")
print(f"OK: {im.size}, alpha real guardado en {DST}")
