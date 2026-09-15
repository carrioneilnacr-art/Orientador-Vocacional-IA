import json

def check():
    with open('scratch/utp_curricula_verified.json', encoding='utf-8') as f:
        data = json.load(f)

    suspicious_count = 0
    total_courses = 0
    for slug, cinfo in data.items():
        cycles = cinfo['cycles']
        for c_num, courses in cycles.items():
            total_courses += len(courses)
            for c in courses:
                c_low = c.lower().strip()
                trailing_words = [' de', ' y', ' en', ' para', ' del', ' la', ' el', ' al', ' a']
                is_trailing = any(c_low.endswith(tw) for tw in trailing_words)
                if len(c) < 5 or is_trailing or c_low.startswith('de ') or c_low.startswith('y '):
                    print(f"[{slug} Ciclo {c_num}]: '{c}'")
                    suspicious_count += 1
                    
    print(f"\nTotal UTP courses: {total_courses}")
    print(f"Total suspicious items: {suspicious_count}")

if __name__ == '__main__':
    check()
