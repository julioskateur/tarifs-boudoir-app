#!/usr/bin/env python3
"""
Génère icon-192.png et icon-512.png à partir du logo Boudoir.
Usage : python3 make-icons.py
Requiert : pip install Pillow
"""

import urllib.request
import io
import os
from PIL import Image

LOGO_URL = "https://www.experienceboudoir-toulouse.fr/wp-content/uploads/2020/12/LOGO-BOUDOIR-SITE-WEB.webp"
BG_COLOR = (250, 247, 242, 255)   # #faf7f2 — fond beige de l'app
SIZES    = [192, 512]
PADDING  = 0.12                    # 12% de marge de chaque côté

def make_icon(logo: Image.Image, size: int) -> Image.Image:
    icon = Image.new("RGBA", (size, size), BG_COLOR)

    # Zone disponible après padding
    avail = int(size * (1 - 2 * PADDING))

    # Redimensionner le logo pour tenir dans la zone dispo (conserver ratio)
    logo_w, logo_h = logo.size
    scale = min(avail / logo_w, avail / logo_h)
    new_w = int(logo_w * scale)
    new_h = int(logo_h * scale)
    logo_resized = logo.resize((new_w, new_h), Image.LANCZOS)

    # Centrer
    x = (size - new_w) // 2
    y = (size - new_h) // 2
    icon.paste(logo_resized, (x, y), logo_resized)

    return icon

def main():
    print("Téléchargement du logo...")
    req = urllib.request.Request(
        LOGO_URL,
        headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = resp.read()

    logo = Image.open(io.BytesIO(data)).convert("RGBA")
    print(f"Logo chargé : {logo.size[0]}x{logo.size[1]}px")

    out_dir = os.path.dirname(os.path.abspath(__file__))
    for size in SIZES:
        icon = make_icon(logo, size)
        # Convertir en RGB pour la sauvegarde PNG (fond opaque)
        bg = Image.new("RGB", icon.size, BG_COLOR[:3])
        bg.paste(icon, mask=icon.split()[3])
        path = os.path.join(out_dir, f"icon-{size}.png")
        bg.save(path, "PNG", optimize=True)
        print(f"✓ icon-{size}.png sauvegardé")

    print("Terminé ! Tu peux maintenant commit + push les deux fichiers PNG.")

if __name__ == "__main__":
    main()
