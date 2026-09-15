import os
import json
import hashlib

BASE_DIR = r"d:\Orientador Vocacional IA"
PDF_DIR = os.path.join(BASE_DIR, "archivos u", "ucsur")
JSON_DIR = os.path.join(BASE_DIR, "scratch", "ucsur_json")
OUTPUT_VERIFIED = os.path.join(BASE_DIR, "scratch", "ucsur_curricula_verified.json")

# Metadata mapping for all 15 UCSUR careers
CAREER_METADATA = {
    "INGENIERIA-DE-SISTEMAS-DE-INFORMACION-CIENTIFICA": {
        "career_name": "Ingeniería de Sistemas de Información",
        "career_slug": "ingenieria-de-sistemas-de-informacion",
        "faculty": "Ingeniería y Negocios",
        "degree": "Bachiller en Ingeniería de Sistemas de Información",
        "title": "Ingeniero de Sistemas de Información",
        "semesters": 10,
        "campuses": ["Campus Villa", "Campus Norte", "Campus Aramburú", "Campus Ate"],
        "pdf_file": "INGENIERIA-DE-SISTEMAS-DE-INFORMACION-CIENTIFICA.pdf",
    },
    "Ingenieria-de-software-2026-cientifica": {
        "career_name": "Ingeniería de Software",
        "career_slug": "ingenieria-de-software",
        "faculty": "Ingeniería y Negocios",
        "degree": "Bachiller en Ingeniería de Software",
        "title": "Ingeniero de Software",
        "semesters": 10,
        "campuses": ["Campus Villa", "Campus Norte", "Campus Aramburú", "Campus Ate"],
        "pdf_file": "Ingenieria-de-software-2026-cientifica.pdf",
    },
    "Ingenieria-industrial-2026-cientifica": {
        "career_name": "Ingeniería Industrial",
        "career_slug": "ingenieria-industrial",
        "faculty": "Ingeniería y Negocios",
        "degree": "Bachiller en Ingeniería Industrial",
        "title": "Ingeniero Industrial",
        "semesters": 10,
        "campuses": ["Campus Villa", "Campus Norte", "Campus Aramburú", "Campus Ate"],
        "pdf_file": "Ingenieria-industrial-2026-cientifica.pdf",
    },
    "administracion-de-empresas-2026-cientifica": {
        "career_name": "Administración de Empresas",
        "career_slug": "administracion",
        "faculty": "Ingeniería y Negocios",
        "degree": "Bachiller en Administración de Empresas",
        "title": "Licenciado en Administración de Empresas",
        "semesters": 10,
        "campuses": ["Campus Villa", "Campus Norte", "Campus Aramburú", "Campus Ate"],
        "pdf_file": "administracion-de-empresas-2026-cientifica.pdf",
    },
    "comunicacion-y-marketing-2026-cientifica": {
        "career_name": "Comunicación y Marketing",
        "career_slug": "comunicacion-y-marketing-digital",
        "faculty": "Humanidades y Comunicación",
        "degree": "Bachiller en Comunicación y Marketing",
        "title": "Licenciado en Comunicación y Marketing",
        "semesters": 10,
        "campuses": ["Campus Villa", "Campus Norte", "Campus Aramburú", "Campus Ate"],
        "pdf_file": "comunicacion-y-marketing-2026-cientifica.pdf",
    },
    "derecho-2026-cientifica": {
        "career_name": "Derecho",
        "career_slug": "derecho",
        "faculty": "Derecho y Ciencias Políticas",
        "degree": "Bachiller en Derecho",
        "title": "Abogado",
        "semesters": 10,
        "campuses": ["Campus Villa", "Campus Norte", "Campus Aramburú", "Campus Ate"],
        "pdf_file": "derecho-2026-cientifica.pdf",
    },
    "malla-arquitectura-interiores": {
        "career_name": "Arquitectura de Interiores",
        "career_slug": "arquitectura-y-diseno-de-interiores",
        "faculty": "Arquitectura y Diseño",
        "degree": "Bachiller en Arquitectura y Diseño de Interiores",
        "title": "Licenciado en Arquitectura de Interiores",
        "semesters": 10,
        "campuses": ["Campus Villa", "Campus Aramburú", "Campus Ate"],
        "pdf_file": "malla-arquitectura-interiores.pdf",
    },
    "malla-carrera-economia-finanzas": {
        "career_name": "Economía y Finanzas",
        "career_slug": "economia-y-finanzas",
        "faculty": "Ingeniería y Negocios",
        "degree": "Bachiller en Economía y Finanzas",
        "title": "Licenciado en Economía y Finanzas",
        "semesters": 10,
        "campuses": ["Campus Villa", "Campus Norte", "Campus Aramburú", "Campus Ate"],
        "pdf_file": "malla-carrera-economia-finanzas.pdf",
    },
    "malla-carrera-enfermeria": {
        "career_name": "Enfermería",
        "career_slug": "enfermeria",
        "faculty": "Ciencias de la Salud",
        "degree": "Bachiller en Enfermería",
        "title": "Licenciado en Enfermería",
        "semesters": 10,
        "campuses": ["Campus Villa", "Campus Norte", "Campus Aramburú", "Campus Ate"],
        "pdf_file": "malla-carrera-enfermeria.pdf",
    },
    "malla-carrera-ingenieria-civil": {
        "career_name": "Ingeniería Civil",
        "career_slug": "ingenieria-civil",
        "faculty": "Ingeniería y Negocios",
        "degree": "Bachiller en Ingeniería Civil",
        "title": "Ingeniero Civil",
        "semesters": 10,
        "campuses": ["Campus Villa", "Campus Norte", "Campus Aramburú", "Campus Ate"],
        "pdf_file": "malla-carrera-ingenieria-civil.pdf",
    },
    "malla-carrera-medicina-humana": {
        "career_name": "Medicina Humana",
        "career_slug": "medicina-humana",
        "faculty": "Ciencias de la Salud",
        "degree": "Bachiller en Medicina Humana",
        "title": "Médico Cirujano",
        "semesters": 14,
        "campuses": ["Campus Villa", "Campus Norte", "Campus Ate"],
        "pdf_file": "malla-carrera-medicina-humana.pdf",
    },
    "malla-carrera-psicologia": {
        "career_name": "Psicología",
        "career_slug": "psicologia",
        "faculty": "Ciencias de la Salud",
        "degree": "Bachiller en Psicología",
        "title": "Licenciado en Psicología",
        "semesters": 10,
        "campuses": ["Campus Villa", "Campus Norte", "Campus Aramburú", "Campus Ate"],
        "pdf_file": "malla-carrera-psicologia.pdf",
    },
    "malla-ingenieria-ambiental": {
        "career_name": "Ingeniería Ambiental",
        "career_slug": "ingenieria-ambiental",
        "faculty": "Ciencias Ambientales",
        "degree": "Bachiller en Ingeniería Ambiental",
        "title": "Ingeniero Ambiental",
        "semesters": 10,
        "campuses": ["Campus Villa", "Campus Norte"],
        "pdf_file": "malla-ingenieria-ambiental.pdf",
    },
    "marketing-y-administracion-2026-cientifica": {
        "career_name": "Marketing y Administración",
        "career_slug": "administracion-y-marketing",
        "faculty": "Ingeniería y Negocios",
        "degree": "Bachiller en Marketing y Administración",
        "title": "Licenciado en Marketing y Administración",
        "semesters": 10,
        "campuses": ["Campus Villa", "Campus Norte", "Campus Aramburú", "Campus Ate"],
        "pdf_file": "marketing-y-administracion-2026-cientifica.pdf",
    },
    "medicina-veterinaria-y-zootecnica-digital-2026-cientifica": {
        "career_name": "Medicina Veterinaria y Zootecnia",
        "career_slug": "medicina-veterinaria-y-zootecnia",
        "faculty": "Ciencias Veterinarias y Biológicas",
        "degree": "Bachiller en Medicina Veterinaria y Zootecnia",
        "title": "Médico Veterinario Zootecnista",
        "semesters": 10,
        "campuses": ["Campus Villa", "Campus Norte", "Campus Ate"],
        "pdf_file": "medicina-veterinaria-y-zootecnica-digital-2026-cientifica.pdf",
    },
}

def get_file_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()

def main():
    results = {}
    total_courses = 0
    
    for key, meta in CAREER_METADATA.items():
        json_file = os.path.join(JSON_DIR, f"{key}.json")
        if not os.path.exists(json_file):
            print(f"Waiting/missing JSON for: {key}")
            continue
            
        with open(json_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        pdf_path = os.path.join(PDF_DIR, meta["pdf_file"])
        sha256 = get_file_sha256(pdf_path)
        
        malla_raw = data.get("malla", {})
        # Normalize cycles
        parsed_malla = {}
        course_count = 0
        for cycle_str in sorted(malla_raw.keys(), key=lambda x: int(x)):
            c_num = int(cycle_str)
            courses = malla_raw[cycle_str]
            clean_courses = []
            for crs in courses:
                crs_clean = crs.strip()
                if crs_clean:
                    clean_courses.append(crs_clean)
                    course_count += 1
            parsed_malla[c_num] = clean_courses
            
        meta_res = dict(meta)
        meta_res["sha256"] = sha256
        meta_res["total_courses"] = course_count
        meta_res["malla"] = parsed_malla
        results[key] = meta_res
        total_courses += course_count
        print(f"Validated {meta['career_name']}: {len(parsed_malla)} cycles, {course_count} courses.")
        
    print(f"\nTotal careers parsed: {len(results)}/15 | Total courses: {total_courses}")
    
    if len(results) == 15:
        with open(OUTPUT_VERIFIED, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        print(f"Wrote verified curricula to {OUTPUT_VERIFIED}")

if __name__ == "__main__":
    main()
