# -*- coding: utf-8 -*-
"""Find book ranges via running headers; dump intro pages and a chapter-2 start."""
import io
import re
import fitz

PDF = "docs/Новая учебная Женевская Библия.pdf"
OUT = "scripts/probe2_out.txt"

HEADER_RE = re.compile(r"^([А-ЯЁ][а-яёА-ЯЁ]+)\s+(\d+),(\d+)")


def header_info(page):
    """Return (book, chapter) from running header (FuturisC size ~13)."""
    d = page.get_text("dict")
    for block in d["blocks"]:
        if block.get("type", 0) != 0:
            continue
        sizes = [round(s["size"], 1) for line in block["lines"] for s in line["spans"]]
        if not sizes or max(sizes) < 12 or max(sizes) > 14:
            continue
        txt = " ".join(s["text"] for line in block["lines"] for s in line["spans"]).strip()
        m = HEADER_RE.search(txt)
        if m:
            return m.group(1), int(m.group(2))
    return None, None


def dump_page_brief(doc, pno, w):
    page = doc[pno]
    w.write(f"\n===== PAGE idx {pno} (label {pno+1}) =====\n")
    d = page.get_text("dict")
    for bi, block in enumerate(d["blocks"]):
        if block.get("type", 0) != 0:
            continue
        x0, y0, x1, y1 = block["bbox"]
        sizes = sorted({round(s["size"], 1) for line in block["lines"] for s in line["spans"]})
        fonts = sorted({s["font"] for line in block["lines"] for s in line["spans"]})
        txt = " ".join(s["text"] for line in block["lines"] for s in line["spans"]).strip()
        w.write(f"[b{bi}] x0={x0:.0f} y0={y0:.0f} x1={x1:.0f} sz={sizes} fonts={fonts}\n")
        w.write(f"     {txt[:150]}\n")


if __name__ == "__main__":
    doc = fitz.open(PDF)
    with io.open(OUT, "w", encoding="utf-8") as w:
        # scan headers to find book ranges around Genesis..Exodus
        prev = None
        transitions = []
        first_gen = None
        first_exod = None
        for i in range(15, 320):
            book, ch = header_info(doc[i])
            if book != prev:
                transitions.append((i, book, ch))
                prev = book
            if book == "Бытие" and first_gen is None:
                first_gen = i
            if book == "Исход" and first_exod is None:
                first_exod = i
                break
        w.write("Header transitions (pageIdx, book, chapter):\n")
        for t in transitions:
            w.write(f"  {t}\n")
        w.write(f"\nfirst Genesis header page idx: {first_gen}\n")
        w.write(f"first Exodus header page idx: {first_exod}\n")

        # dump intro pages just before Genesis ch1 (pages 18..23)
        for p in range(18, 24):
            dump_page_brief(doc, p, w)

        # find and dump a chapter-2 start page for Genesis
        w.write("\n\n##### Looking for Genesis chapter 2 start #####\n")
        for i in range(first_gen, first_gen + 8):
            book, ch = header_info(doc[i])
            w.write(f"page idx {i}: header book={book} ch={ch}\n")
    print("wrote", OUT)
