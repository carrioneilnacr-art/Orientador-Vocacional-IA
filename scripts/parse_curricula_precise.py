import pdfplumber
import json
import re
import os

FILES = [
    {
        'file': 'ug-administracion-y-marketing_compressed.pdf',
        'slug': 'administracion-y-marketing',
        'pages': [5, 6],
        'total_cycles': 10,
        'prefix': 'ADM'
    },
    {
        'file': 'ug-arquitectura-y-diseno-de-interiores.pdf',
        'slug': 'arquitectura-y-diseno-de-interiores',
        'pages': [5, 6],
        'total_cycles': 10,
        'prefix': 'ARQ'
    },
    {
        'file': 'ug-comunicacion-y-marketing-digital.pdf',
        'slug': 'comunicacion-y-marketing-digital',
        'pages': [5, 6],
        'total_cycles': 10,
        'prefix': 'CMD'
    },
    {
        'file': 'ug-contabilidad-y-finanzas.pdf',
        'slug': 'contabilidad-y-finanzas',
        'pages': [5, 6],
        'total_cycles': 10,
        'prefix': 'CON'
    },
    {
        'file': 'ug-derecho.pdf',
        'slug': 'derecho',
        'pages': [5, 6],
        'total_cycles': 10,
        'prefix': 'DER'
    },
    {
        'file': 'ug-enfermeria.pdf',
        'slug': 'enfermeria',
        'pages': [5, 6],
        'total_cycles': 10,
        'prefix': 'ENF'
    },
    {
        'file': 'ug-ingenieria-ambiental.pdf',
        'slug': 'ingenieria-ambiental',
        'pages': [5, 6],
        'total_cycles': 10,
        'prefix': 'AMB'
    },
    {
        'file': 'ug-ingenieria-civil.pdf',
        'slug': 'ingenieria-civil',
        'pages': [5, 6],
        'total_cycles': 10,
        'prefix': 'CIV'
    },
    {
        'file': 'ug-ingenieria-de-software.pdf',
        'slug': 'ingenieria-de-software',
        'pages': [5, 6],
        'total_cycles': 10,
        'prefix': 'SOF'
    },
    {
        'file': 'ug-medicina-humana.pdf',
        'slug': 'medicina-humana',
        'pages': [7, 8, 9],
        'total_cycles': 14,
        'prefix': 'MED'
    },
    {
        'file': 'ug-psicologia.pdf',
        'slug': 'psicologia',
        'pages': [5, 6],
        'total_cycles': 10,
        'prefix': 'PSI'
    },
    {
        'file': 'ug_ingenieria-industrial.pdf',
        'slug': 'ingenieria-industrial',
        'pages': [5, 6],
        'total_cycles': 10,
        'prefix': 'IND'
    },
]

def extract_courses_from_page(page, cycles_count, starting_cycle):
    # Determine vertical slices for the cycles on this page
    # Typical page height is ~2524. 
    # For 5 cycles per page:
    # cycle 1: 250 - 750
    # cycle 2: 750 - 1200
    # cycle 3: 1200 - 1680
    # cycle 4: 1680 - 2080
    # cycle 5: 2080 - 2500
    
    height = page.height
    
    if cycles_count == 5:
        slices = [
            (starting_cycle + 0, 200, 750),
            (starting_cycle + 1, 750, 1200),
            (starting_cycle + 2, 1200, 1680),
            (starting_cycle + 3, 1680, 2080),
            (starting_cycle + 4, 2080, height),
        ]
    elif cycles_count == 4: # Medicina page 10 has 4 cycles (11, 12, 13, 14)
        slices = [
            (starting_cycle + 0, 200, 780),
            (starting_cycle + 1, 780, 1350),
            (starting_cycle + 2, 1350, 1920),
            (starting_cycle + 3, 1920, height),
        ]
    else:
        # Generic equal division
        step = (height - 250) / cycles_count
        slices = [(starting_cycle + i, 250 + i*step, 250 + (i+1)*step) for i in range(cycles_count)]
        
    page_words = page.extract_words()
    
    cycle_results = {}
    for cycle_num, y_min, y_max in slices:
        words = [w for w in page_words if y_min <= w['top'] < y_max]
        # Sort words in reading order: group by line
        words = sorted(words, key=lambda w: (round(w['top'] / 7), w['x0']))
        
        lines = []
        curr_y = None
        curr_line = []
        for w in words:
            y = round(w['top'] / 7)
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
        cum_credits = None
        
        for line in lines:
            s = line.strip()
            if not s or 'plan de estudios' in s.lower() or 'estructura curricular' in s.lower() or 'upn.edu.pe' in s.lower():
                continue
                
            # Check for credits
            m_cred = re.search(r'(\d+)\s*cr[ée]ditos', s, re.IGNORECASE)
            if m_cred:
                cum_credits = int(m_cred.group(1))
                s = re.sub(r'\d+\s*cr[ée]ditos', '', s, flags=re.IGNORECASE).strip()
                
            # Filter isolated numbers or "Ciclo"
            tokens = s.split()
            filtered_tokens = []
            for t in tokens:
                if t.lower() == 'ciclo' or t.lower() == 'créditos' or t.lower() == 'crditos':
                    continue
                if re.match(r'^\d+$', t):
                    if cum_credits is None:
                        cum_credits = int(t)
                    continue
                filtered_tokens.append(t)
                
            s = ' '.join(filtered_tokens).strip()
            if not s:
                continue
                
            # Check if line contains bullets inside it, e.g. "curso 1 - curso 2"
            # Split on bullet
            bullet_parts = re.split(r'(?:^|\s+)[-•]\s*', s)
            for bp in bullet_parts:
                bp = bp.strip()
                if not bp:
                    continue
                if s.startswith('-') or s.startswith('•') or bp != bullet_parts[0]:
                    if curr_c:
                        courses.append(curr_c)
                    curr_c = bp
                else:
                    if curr_c:
                        curr_c += ' ' + bp
                    else:
                        curr_c = bp
                        
        if curr_c:
            courses.append(curr_c)
            
        # Clean course names
        cleaned_courses = []
        for c in courses:
            c_clean = re.sub(r'\s+', ' ', c).strip()
            # remove leading/trailing punctuation
            c_clean = c_clean.lstrip('-•: ').rstrip(': ')
            if len(c_clean) > 2 and not c_clean.lower().startswith('ciclo'):
                cleaned_courses.append(c_clean)
                
        cycle_results[cycle_num] = {
            'courses': cleaned_courses,
            'cum_credits': cum_credits
        }
        
    return cycle_results

def test_all():
    summary = {}
    for item in FILES:
        print(f"Parsing {item['slug']} ...")
        career_cycles = {}
        with pdfplumber.open(os.path.join('archivos u', item['file'])) as pdf:
            if item['slug'] == 'medicina-humana':
                # Page 8: cycles 1-5
                res1 = extract_courses_from_page(pdf.pages[item['pages'][0]], 5, 1)
                # Page 9: cycles 6-10
                res2 = extract_courses_from_page(pdf.pages[item['pages'][1]], 5, 6)
                # Page 10: cycles 11-14
                res3 = extract_courses_from_page(pdf.pages[item['pages'][2]], 4, 11)
                career_cycles.update(res1)
                career_cycles.update(res2)
                career_cycles.update(res3)
            else:
                # Page 6: cycles 1-5
                res1 = extract_courses_from_page(pdf.pages[item['pages'][0]], 5, 1)
                # Page 7: cycles 6-10
                res2 = extract_courses_from_page(pdf.pages[item['pages'][1]], 5, 6)
                career_cycles.update(res1)
                career_cycles.update(res2)
                
        summary[item['slug']] = career_cycles
        
    with open('scratch/parsed_curricula_precise.json', 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    print("Done! Saved to scratch/parsed_curricula_precise.json")

if __name__ == '__main__':
    test_all()
