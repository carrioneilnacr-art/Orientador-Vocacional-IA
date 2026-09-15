import pdfplumber
import json
import os
import re

FILES = [
    ('ug-administracion-y-marketing_compressed.pdf', 'administracion-y-marketing', [5, 6]),
    ('ug-arquitectura-y-diseno-de-interiores.pdf', 'arquitectura-y-diseno-de-interiores', [5, 6]),
    ('ug-comunicacion-y-marketing-digital.pdf', 'comunicacion-y-marketing-digital', [5, 6]),
    ('ug-contabilidad-y-finanzas.pdf', 'contabilidad-y-finanzas', [5, 6]),
    ('ug-derecho.pdf', 'derecho', [5, 6]),
    ('ug-enfermeria.pdf', 'enfermeria', [5, 6]),
    ('ug-ingenieria-ambiental.pdf', 'ingenieria-ambiental', [5, 6]),
    ('ug-ingenieria-civil.pdf', 'ingenieria-civil', [5, 6]),
    ('ug-ingenieria-de-software.pdf', 'ingenieria-de-software', [5, 6]),
    ('ug-medicina-humana.pdf', 'medicina-humana', [7, 8, 9]),
    ('ug-psicologia.pdf', 'psicologia', [5, 6]),
    ('ug_ingenieria-industrial.pdf', 'ingenieria-industrial', [5, 6]),
]

def clean_name(s):
    s = s.strip()
    # Normalize spaces
    s = re.sub(r'\s+', ' ', s)
    # Fix common encoding artifacts if any
    replacements = {
        '': 'í', # fallback default if context doesn't specify, but let's check exact chars
    }
    return s

def extract_career_cycles(filename, slug, pages_idx):
    with pdfplumber.open(os.path.join('archivos u', filename)) as pdf:
        all_pages_data = []
        for p_i in pages_idx:
            page = pdf.pages[p_i]
            # Get text lines
            lines = [l.strip() for l in page.extract_text().splitlines() if l.strip()]
            all_pages_data.append(lines)
            
    return {
        'filename': filename,
        'slug': slug,
        'raw_lines_by_page': all_pages_data
    }

def main():
    results = []
    for fn, slug, p_idxs in FILES:
        res = extract_career_cycles(fn, slug, p_idxs)
        results.append(res)
        print(f"Extracted {fn}: {len(res['raw_lines_by_page'])} pages")
        
    with open('scratch/raw_curricula_lines.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    main()
