import os
import json
import hashlib

BASE_DIR = r"d:\Orientador Vocacional IA"
PDF_DIR = os.path.join(BASE_DIR, "archivos u", "usmp")
JSON_DIR = os.path.join(BASE_DIR, "scratch", "usmp_json")
OUTPUT_VERIFIED = os.path.join(BASE_DIR, "scratch", "usmp_curricula_verified.json")

# 14 USMP Careers Configuration
CAREER_METADATA = {
    "ADMINISTRACION-DE-NEGOCIOS-INTERNACIONALES-USMP-WEB": {
        "career_name": "Administración de Negocios Internacionales",
        "career_slug": "administracion-de-negocios-internacionales",
        "faculty": "Facultad de Ciencias Administrativas y Recursos Humanos",
        "degree": "Bachiller en Administración de Negocios Internacionales",
        "title": "Licenciado en Administración de Negocios Internacionales",
        "semesters": 10,
        "campuses": ["Sede Santa Anita", "Sede Lima Norte - Comas"],
        "pdf_file": "ADMINISTRACION-DE-NEGOCIOS-INTERNACIONALES-USMP-WEB.pdf",
    },
    "ADMINISTRACION-USMP-WEB25": {
        "career_name": "Administración",
        "career_slug": "administracion",
        "faculty": "Facultad de Ciencias Administrativas y Recursos Humanos",
        "degree": "Bachiller en Ciencias Administrativas",
        "title": "Licenciado en Administración",
        "semesters": 10,
        "campuses": ["Sede Santa Anita", "Sede Lima Norte - Comas", "Filial Norte - Chiclayo", "Filial Sur - Arequipa"],
        "pdf_file": "ADMINISTRACION-USMP-WEB25.pdf",
    },
    "ARQUITECTURA-WEB-v4_compressed": {
        "career_name": "Arquitectura",
        "career_slug": "arquitectura",
        "faculty": "Facultad de Ingeniería y Arquitectura",
        "degree": "Bachiller en Arquitectura",
        "title": "Arquitecto",
        "semesters": 10,
        "campuses": ["Sede La Molina", "Sede Lima Norte - Comas", "Filial Sur - Arequipa"],
        "pdf_file": "ARQUITECTURA-WEB-v4_compressed.pdf",
    },
    "CIENCIAS-DE-LA-COMUNICACION-WEB1": {
        "career_name": "Ciencias de la Comunicación",
        "career_slug": "ciencias-de-la-comunicacion",
        "faculty": "Facultad de Ciencias de la Comunicación, Turismo y Psicología",
        "degree": "Bachiller en Ciencias de la Comunicación",
        "title": "Licenciado en Ciencias de la Comunicación",
        "semesters": 10,
        "campuses": ["Sede Surquillo", "Filial Norte - Chiclayo"],
        "pdf_file": "CIENCIAS-DE-LA-COMUNICACION-WEB1.pdf",
    },
    "CONTABILIDAD-Y-FINANZAS-USMP-WEB-1": {
        "career_name": "Contabilidad y Finanzas",
        "career_slug": "contabilidad-y-finanzas",
        "faculty": "Facultad de Ciencias Contables, Económicas y Financieras",
        "degree": "Bachiller en Contabilidad y Finanzas",
        "title": "Contador Público",
        "semesters": 10,
        "campuses": ["Sede Santa Anita", "Sede Lima Norte - Comas", "Filial Norte - Chiclayo", "Filial Sur - Arequipa"],
        "pdf_file": "CONTABILIDAD-Y-FINANZAS-USMP-WEB-1.pdf",
    },
    "DERECHO-USMP-WEB": {
        "career_name": "Derecho",
        "career_slug": "derecho",
        "faculty": "Facultad de Derecho",
        "degree": "Bachiller en Derecho",
        "title": "Abogado",
        "semesters": 12,
        "campuses": ["Sede Santa Anita", "Sede La Molina", "Sede Lima Norte - Comas", "Filial Norte - Chiclayo", "Filial Sur - Arequipa"],
        "pdf_file": "DERECHO-USMP-WEB.pdf",
    },
    "ECONOMIA-USMP-WEB": {
        "career_name": "Economía",
        "career_slug": "economia",
        "faculty": "Facultad de Ciencias Contables, Económicas y Financieras",
        "degree": "Bachiller en Economía",
        "title": "Economista",
        "semesters": 10,
        "campuses": ["Sede Santa Anita"],
        "pdf_file": "ECONOMIA-USMP-WEB.pdf",
    },
    "ENFERMERIA-v4-WEB": {
        "career_name": "Enfermería",
        "career_slug": "enfermeria",
        "faculty": "Facultad de Medicina Humana",
        "degree": "Bachiller en Enfermería",
        "title": "Licenciado en Enfermería",
        "semesters": 10,
        "campuses": ["Sede Santa Anita", "Sede Lima Norte - Comas"],
        "pdf_file": "ENFERMERIA-v4-WEB.pdf",
    },
    "INGENIERIA-CIVIL-WEB-v4": {
        "career_name": "Ingeniería Civil",
        "career_slug": "ingenieria-civil",
        "faculty": "Facultad de Ingeniería y Arquitectura",
        "degree": "Bachiller en Ingeniería Civil",
        "title": "Ingeniero Civil",
        "semesters": 10,
        "campuses": ["Sede La Molina", "Sede Lima Norte - Comas", "Filial Sur - Arequipa"],
        "pdf_file": "INGENIERIA-CIVIL-WEB-v4.pdf",
    },
    "INGENIERIA-EN-COMPUTACION-Y-SISTEMAS-WEB-v4": {
        "career_name": "Ingeniería de Computación y Sistemas",
        "career_slug": "ingenieria-de-sistemas-computacionales",
        "faculty": "Facultad de Ingeniería y Arquitectura",
        "degree": "Bachiller en Ingeniería de Computación y Sistemas",
        "title": "Ingeniero de Computación y Sistemas",
        "semesters": 10,
        "campuses": ["Sede La Molina", "Sede Lima Norte - Comas", "Filial Sur - Arequipa"],
        "pdf_file": "INGENIERIA-EN-COMPUTACION-Y-SISTEMAS-WEB-v4.pdf",
    },
    "INGENIERIA-INDUSTRIAL-WEB-v4": {
        "career_name": "Ingeniería Industrial",
        "career_slug": "ingenieria-industrial",
        "faculty": "Facultad de Ingeniería y Arquitectura",
        "degree": "Bachiller en Ingeniería Industrial",
        "title": "Ingeniero Industrial",
        "semesters": 10,
        "campuses": ["Sede La Molina", "Sede Lima Norte - Comas", "Filial Sur - Arequipa"],
        "pdf_file": "INGENIERIA-INDUSTRIAL-WEB-v4.pdf",
    },
    "MARKETING-USMP-WEB": {
        "career_name": "Marketing",
        "career_slug": "administracion-y-marketing",
        "faculty": "Facultad de Ciencias Administrativas y Recursos Humanos",
        "degree": "Bachiller en Marketing",
        "title": "Licenciado en Marketing",
        "semesters": 10,
        "campuses": ["Sede Santa Anita"],
        "pdf_file": "MARKETING-USMP-WEB.pdf",
    },
    "MEDICINA-HUMANA-USMP-WEB": {
        "career_name": "Medicina Humana",
        "career_slug": "medicina-humana",
        "faculty": "Facultad de Medicina Humana",
        "degree": "Bachiller en Medicina Humana",
        "title": "Médico Cirujano",
        "semesters": 14,
        "campuses": ["Sede La Molina", "Sede Lima Norte - Comas", "Filial Norte - Chiclayo", "Filial Sur - Arequipa"],
        "pdf_file": "MEDICINA-HUMANA-USMP-WEB.pdf",
    },
    "PSICOLOGIA-USMP-WEB": {
        "career_name": "Psicología",
        "career_slug": "psicologia",
        "faculty": "Facultad de Ciencias de la Comunicación, Turismo y Psicología",
        "degree": "Bachiller en Psicología",
        "title": "Licenciado en Psicología",
        "semesters": 10,
        "campuses": ["Sede Surquillo", "Sede Santa Anita", "Sede Lima Norte - Comas", "Filial Norte - Chiclayo", "Filial Sur - Arequipa"],
        "pdf_file": "PSICOLOGIA-USMP-WEB.pdf",
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
            print(f"Waiting for: {key}")
            continue
            
        with open(json_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        pdf_path = os.path.join(PDF_DIR, meta["pdf_file"])
        sha256 = get_file_sha256(pdf_path)
        
        malla_raw = data.get("malla", {})
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
        
    print(f"\nTotal careers parsed: {len(results)}/14 | Total courses: {total_courses}")
    
    if len(results) == 14:
        with open(OUTPUT_VERIFIED, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        print(f"Wrote verified curricula to {OUTPUT_VERIFIED}")

if __name__ == "__main__":
    main()
