# -*- coding: utf-8 -*-
"""Probe the PDF layout at span level; write UTF-8 output to a file."""
import io
import fitz  # PyMuPDF

PDF = "docs/Новая учебная Женевская Библия.pdf"
OUT = "scripts/probe_out.txt"


def classify(fonts, size):
    fam = " ".join(fonts)
    if "Scriptura" in fam or "StempelGaramond" in fam:
        return "SCRIPTURE"
    if "Futuris" in fam or "AntiqueOlive" in fam or "EuropeanPi" in fam:
        if size >= 12:
            return "HEADER"
        if size >= 9:
            return "SUBHEAD/CHAPNO"
        if size >= 6.3:
            return "COMMENT?"
        return "XREF?"
    return "?" + fam


def dump_page(doc, pno, w):
    page = doc[pno]
    w.write(f"\n===== PAGE index {pno} (label {pno+1}) size={page.rect} =====\n")
    d = page.get_text("dict")
    for bi, block in enumerate(d["blocks"]):
        if block.get("type", 0) != 0:
            continue
        x0, y0, x1, y1 = block["bbox"]
        sizes = sorted({round(s["size"], 1) for line in block["lines"] for s in line["spans"]})
        fonts = sorted({s["font"] for line in block["lines"] for s in line["spans"]})
        cls = classify(fonts, max(sizes) if sizes else 0)
        w.write(f"\n[b{bi}] {cls} x0={x0:.0f} y0={y0:.0f} x1={x1:.0f} y1={y1:.0f} sz={sizes}\n")
        for li, line in enumerate(block["lines"]):
            parts = []
            for s in line["spans"]:
                parts.append(f"<{s['text']}|{s['font']}|{round(s['size'],1)}|f{s['flags']}>")
            w.write("   L%d: %s\n" % (li, " ".join(parts)))


if __name__ == "__main__":
    doc = fitz.open(PDF)
    with io.open(OUT, "w", encoding="utf-8") as w:
        w.write("total pages: %d\n" % len(doc))
        for t in (23, 24):
            dump_page(doc, t, w)
    print("wrote", OUT)
