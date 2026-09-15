import json

def check_integrity():
    with open('scratch/curricula_verified.json', encoding='utf-8') as f:
        data = json.load(f)

    for slug, cdata in data.items():
        print(f"=== {slug} ===")
        total_courses = 0
        for c_i in range(1, len(cdata['cycles']) + 1):
            courses = cdata['cycles'][str(c_i)]['courses']
            total_courses += len(courses)
            for idx, c in enumerate(courses):
                c_low = c.lower().strip()
                # Check suspicious
                trailing_words = [' de', ' y', ' en', ' para', ' del', ' la', ' el', ' al', ' a']
                is_trailing = any(c_low.endswith(tw) for tw in trailing_words)
                if len(c) < 6 or is_trailing or c_low.startswith('de ') or c_low.startswith('y '):
                    print(f"  [SUSPICIOUS Ciclo {c_i} #{idx+1}]: '{c}'")
        print(f"  Total courses: {total_courses}")

if __name__ == '__main__':
    check_integrity()
