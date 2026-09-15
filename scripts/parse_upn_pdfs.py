import pdfplumber
import json
import os
import glob
import re

PDF_DIR = 'archivos u'
OUTPUT_FILE = 'scratch/upn_parsed_careers.json'

# Mapping file to known canonical slugs and basic info
FILES_TO_PROCESS = [
    {
        'file': 'ug-administracion-y-marketing_compressed.pdf',
        'slug': 'administracion-y-marketing',
        'default_name': 'Administración y Marketing',
        'default_faculty': 'Facultad de Negocios'
    },
    {
        'file': 'ug-arquitectura-y-diseno-de-interiores.pdf',
        'slug': 'arquitectura-y-diseno-de-interiores',
        'default_name': 'Arquitectura y Diseño de Interiores',
        'default_faculty': 'Facultad de Arquitectura y Urbanismo'
    },
    {
        'file': 'ug-comunicacion-y-marketing-digital.pdf',
        'slug': 'comunicacion-y-marketing-digital',
        'default_name': 'Comunicación y Marketing Digital',
        'default_faculty': 'Facultad de Comunicaciones'
    },
    {
        'file': 'ug-contabilidad-y-finanzas.pdf',
        'slug': 'contabilidad-y-finanzas',
        'default_name': 'Contabilidad y Finanzas',
        'default_faculty': 'Facultad de Negocios'
    },
    {
        'file': 'ug-derecho.pdf',
        'slug': 'derecho',
        'default_name': 'Derecho',
        'default_faculty': 'Facultad de Derecho y Ciencias Políticas'
    },
    {
        'file': 'ug-enfermeria.pdf',
        'slug': 'enfermeria',
        'default_name': 'Enfermería',
        'default_faculty': 'Facultad de Ciencias de la Salud'
    },
    {
        'file': 'ug-ingenieria-ambiental.pdf',
        'slug': 'ingenieria-ambiental',
        'default_name': 'Ingeniería Ambiental',
        'default_faculty': 'Facultad de Ingeniería'
    },
    {
        'file': 'ug-ingenieria-civil.pdf',
        'slug': 'ingenieria-civil',
        'default_name': 'Ingeniería Civil',
        'default_faculty': 'Facultad de Ingeniería'
    },
    {
        'file': 'ug-ingenieria-de-software.pdf',
        'slug': 'ingenieria-de-software',
        'default_name': 'Ingeniería de Software',
        'default_faculty': 'Facultad de Ingeniería'
    },
    {
        'file': 'ug-medicina-humana.pdf',
        'slug': 'medicina-humana',
        'default_name': 'Medicina Humana',
        'default_faculty': 'Facultad de Ciencias de la Salud'
    },
    {
        'file': 'ug-psicologia.pdf',
        'slug': 'psicologia',
        'default_name': 'Psicología',
        'default_faculty': 'Facultad de Ciencias de la Salud'
    },
    {
        'file': 'ug_ingenieria-industrial.pdf',
        'slug': 'ingenieria-industrial',
        'default_name': 'Ingeniería Industrial',
        'default_faculty': 'Facultad de Ingeniería'
    }
]

def extract_career_data(item):
    filepath = os.path.join(PDF_DIR, item['file'])
    print(f"Parsing: {item['file']} ...")
    
    with pdfplumber.open(filepath) as pdf:
        num_pages = len(pdf.pages)
        pages_text = [p.extract_text() or '' for p in pdf.pages]
    
    return {
        'slug': item['slug'],
        'default_name': item['default_name'],
        'file': item['file'],
        'num_pages': num_pages,
        'pages_text': pages_text
    }

def main():
    os.makedirs('scratch', exist_ok=True)
    all_data = []
    for item in FILES_TO_PROCESS:
        all_data.append(extract_career_data(item))
        
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)
    print(f"Saved extracted raw data to {OUTPUT_FILE}")

if __name__ == '__main__':
    main()
