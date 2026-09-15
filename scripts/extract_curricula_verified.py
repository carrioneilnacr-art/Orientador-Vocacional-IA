import pdfplumber
import json
import re
import os

FILES = [
    {
        'file': 'ug-administracion-y-marketing_compressed.pdf',
        'slug': 'administracion-y-marketing',
        'name': 'Administración y Marketing',
        'faculty': 'Facultad de Negocios',
        'pages': [5, 6],
        'total_cycles': 10,
        'prefix': 'ADM'
    },
    {
        'file': 'ug-arquitectura-y-diseno-de-interiores.pdf',
        'slug': 'arquitectura-y-diseno-de-interiores',
        'name': 'Arquitectura y Diseño de Interiores',
        'faculty': 'Facultad de Arquitectura y Urbanismo',
        'pages': [5, 6],
        'total_cycles': 10,
        'prefix': 'ARQ'
    },
    {
        'file': 'ug-comunicacion-y-marketing-digital.pdf',
        'slug': 'comunicacion-y-marketing-digital',
        'name': 'Comunicación y Marketing Digital',
        'faculty': 'Facultad de Comunicaciones',
        'pages': [5, 6],
        'total_cycles': 10,
        'prefix': 'CMD'
    },
    {
        'file': 'ug-contabilidad-y-finanzas.pdf',
        'slug': 'contabilidad-y-finanzas',
        'name': 'Contabilidad y Finanzas',
        'faculty': 'Facultad de Negocios',
        'pages': [5, 6],
        'total_cycles': 10,
        'prefix': 'CON'
    },
    {
        'file': 'ug-derecho.pdf',
        'slug': 'derecho',
        'name': 'Derecho',
        'faculty': 'Facultad de Derecho y Ciencias Políticas',
        'pages': [5, 6],
        'total_cycles': 10,
        'prefix': 'DER'
    },
    {
        'file': 'ug-enfermeria.pdf',
        'slug': 'enfermeria',
        'name': 'Enfermería',
        'faculty': 'Facultad de Ciencias de la Salud',
        'pages': [5, 6],
        'total_cycles': 10,
        'prefix': 'ENF'
    },
    {
        'file': 'ug-ingenieria-ambiental.pdf',
        'slug': 'ingenieria-ambiental',
        'name': 'Ingeniería Ambiental',
        'faculty': 'Facultad de Ingeniería',
        'pages': [5, 6],
        'total_cycles': 10,
        'prefix': 'AMB'
    },
    {
        'file': 'ug-ingenieria-civil.pdf',
        'slug': 'ingenieria-civil',
        'name': 'Ingeniería Civil',
        'faculty': 'Facultad de Ingeniería',
        'pages': [5, 6],
        'total_cycles': 10,
        'prefix': 'CIV'
    },
    {
        'file': 'ug-ingenieria-de-software.pdf',
        'slug': 'ingenieria-de-software',
        'name': 'Ingeniería de Software',
        'faculty': 'Facultad de Ingeniería',
        'pages': [5, 6],
        'total_cycles': 10,
        'prefix': 'SOF'
    },
    {
        'file': 'ug-medicina-humana.pdf',
        'slug': 'medicina-humana',
        'name': 'Medicina Humana',
        'faculty': 'Facultad de Ciencias de la Salud',
        'pages': [7, 8, 9],
        'total_cycles': 14,
        'prefix': 'MED'
    },
    {
        'file': 'ug-psicologia.pdf',
        'slug': 'psicologia',
        'name': 'Psicología',
        'faculty': 'Facultad de Ciencias de la Salud',
        'pages': [5, 6],
        'total_cycles': 10,
        'prefix': 'PSI'
    },
    {
        'file': 'ug_ingenieria-industrial.pdf',
        'slug': 'ingenieria-industrial',
        'name': 'Ingeniería Industrial',
        'faculty': 'Facultad de Ingeniería',
        'pages': [5, 6],
        'total_cycles': 10,
        'prefix': 'IND'
    },
]

def clean_course_name(name):
    s = name.strip()
    # Remove credit badges like '20 créditos' or '160 créditos'
    s = re.sub(r'\b\d{2,3}\s*cr[ée]ditos\b', '', s, flags=re.IGNORECASE)
    s = re.sub(r'\bcr[ée]ditos\b', '', s, flags=re.IGNORECASE)
    s = re.sub(r'\bcrditos\b', '', s, flags=re.IGNORECASE)
    s = re.sub(r'\bciclo\b', '', s, flags=re.IGNORECASE)
    
    # Remove isolated cumulative credit numbers: 20, 40, 59, 60, 61, 78, 79, 80, 82, 98, 100, 101, 102, 116, 118, 120, 121, 122, 136, 138, 140, 141, 142, 158, 159, 160, 162, 178, 180, 197, 200, 217, 237, 259, 281
    s = re.sub(r'\b(?:19|20|38|40|42|57|59|60|61|76|78|79|80|82|96|98|100|101|102|116|118|120|121|122|136|138|140|141|142|158|159|160|162|178|180|197|200|217|237|259|281)\b', '', s)
    
    # Clean up whitespace
    s = re.sub(r'\s+', ' ', s).strip()
    s = s.lstrip('-•: ').rstrip(': ')
    
    # Typo / PDF font artifacts fixes
    s = s.replace('arti cial', 'artificial')
    s = s.replace('cient ca', 'científica')
    s = s.replace('cientca', 'científica')
    s = s.replace('Espec cas', 'Específicas')
    s = s.replace('Arquitecturay', 'Arquitectura y')
    s = s.replace('vizualizacin', 'visualización')
    s = s.replace('vizualizacion', 'visualización')
    
    return s

def extract_courses_from_pdf_page(page, cycles_count, starting_cycle):
    words = page.extract_words()
    ciclo_words = [w for w in words if w['text'].lower() == 'ciclo']
    ciclo_words = sorted(ciclo_words, key=lambda w: w['top'])
    
    cutoffs = []
    for i in range(len(ciclo_words)):
        top = ciclo_words[i]['top']
        cutoffs.append(top)
        
    h = page.height
    if len(cutoffs) < cycles_count:
        step = (h - 220) / cycles_count
        cutoffs = [220 + i * step for i in range(cycles_count)]
        
    ranges = []
    for i in range(cycles_count):
        y_start = cutoffs[i] - 45 if i > 0 else 180
        y_end = cutoffs[i+1] - 45 if i + 1 < len(cutoffs) else h
        ranges.append((starting_cycle + i, y_start, y_end))
        
    results = {}
    for c_num, y1, y2 in ranges:
        c_words = [w for w in words if y1 <= w['top'] < y2]
        c_words = sorted(c_words, key=lambda w: (round(w['top'] / 8), w['x0']))
        
        lines = []
        curr_y = None
        curr_line = []
        for w in c_words:
            y = round(w['top'] / 8)
            if curr_y is None or abs(y - curr_y) <= 0:
                curr_line.append(w['text'])
                curr_y = y
            else:
                lines.append(' '.join(curr_line))
                curr_line = [w['text']]
                curr_y = y
        if curr_line:
            lines.append(' '.join(curr_line))
            
        courses = []
        curr_c = None
        cum_cred = None
        
        for line in lines:
            txt = line.strip()
            if not txt or 'plan de estudios' in txt.lower() or 'estructura curricular' in txt.lower() or 'upn.edu.pe' in txt.lower():
                continue
                
            m = re.search(r'(\d+)\s*cr[ée]ditos', txt, re.IGNORECASE)
            if m:
                cum_cred = int(m.group(1))
                
            # If line has bullet - or •
            # Note: protect " - BIM" or similar dashes inside course names
            txt_safe = re.sub(r'\s+-\s+BIM', ' — BIM', txt)
            parts = re.split(r'\s+[-•]\s*', txt_safe)
            for p in parts:
                p_clean = clean_course_name(p.replace(' — BIM', ' - BIM'))
                if not p_clean:
                    continue
                if txt.startswith('-') or txt.startswith('•') or p != parts[0]:
                    if curr_c:
                        courses.append(curr_c)
                    curr_c = p_clean
                else:
                    if curr_c:
                        curr_c += ' ' + p_clean
                    else:
                        curr_c = p_clean
        if curr_c:
            courses.append(curr_c)
            
        final_courses = []
        for c in courses:
            c = clean_course_name(c)
            if len(c) > 2 and not c.lower().startswith('ciclo'):
                final_courses.append(c)
                
        results[c_num] = {
            'courses': final_courses,
            'cum_credits': cum_cred
        }
        
    return results

def post_process_fixes(data):
    # Fix known wrapped course boundaries
    # 1. ingenieria-civil: 'Ingeniería de Proyectos de' in cycle 7 and 'Construcción' in cycle 8
    if 'ingenieria-civil' in data:
        c7 = data['ingenieria-civil']['cycles'].get(7, {}).get('courses', [])
        c8 = data['ingenieria-civil']['cycles'].get(8, {}).get('courses', [])
        if 'Ingeniería de Proyectos de' in c7 and 'Construcción' in c8:
            c7.remove('Ingeniería de Proyectos de')
            c8.remove('Construcción')
            c7.append('Ingeniería de Proyectos de Construcción')
            
    # 2. psicologia: 'Intervención en personas' in cycle 7 and 'con diversidad funcional' in cycle 8
    if 'psicologia' in data:
        c7 = data['psicologia']['cycles'].get(7, {}).get('courses', [])
        c8 = data['psicologia']['cycles'].get(8, {}).get('courses', [])
        if 'Intervención en personas' in c7 and 'con diversidad funcional' in c8:
            c7.remove('Intervención en personas')
            c8.remove('con diversidad funcional')
            c7.append('Intervención en personas con diversidad funcional')

    return data

def process_all():
    data = {}
    for item in FILES:
        print(f"Extracting {item['name']} ({item['file']}) ...")
        with pdfplumber.open(os.path.join('archivos u', item['file'])) as pdf:
            c_all = {}
            if item['slug'] == 'medicina-humana':
                c1 = extract_courses_from_pdf_page(pdf.pages[item['pages'][0]], 5, 1)
                c2 = extract_courses_from_pdf_page(pdf.pages[item['pages'][1]], 5, 6)
                c3 = extract_courses_from_pdf_page(pdf.pages[item['pages'][2]], 4, 11)
                c_all.update(c1)
                c_all.update(c2)
                c_all.update(c3)
            else:
                c1 = extract_courses_from_pdf_page(pdf.pages[item['pages'][0]], 5, 1)
                c2 = extract_courses_from_pdf_page(pdf.pages[item['pages'][1]], 5, 6)
                c_all.update(c1)
                c_all.update(c2)
                
        data[item['slug']] = {
            'meta': item,
            'cycles': c_all
        }
        
    data = post_process_fixes(data)
    
    with open('scratch/curricula_verified.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Saved refined verified curricula to scratch/curricula_verified.json")

if __name__ == '__main__':
    process_all()
