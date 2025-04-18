#!/usr/bin/env python3

import sqlite3
import re
from opencc import OpenCC

cc = OpenCC('s2t')
conn = sqlite3.connect('../test.db')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# 阴阳映射表
yao_map = {
    "初九": "1", "九二": "1", "九三": "1", "九四": "1", "九五": "1", "上九": "1",
    "初六": "0", "六二": "0", "六三": "0", "六四": "0", "六五": "0", "上六": "0"
}
# 排序顺序
yao_order = ["初六", "初九", "六二", "九二", "六三", "九三", "六四", "九四", "六五", "九五", "上六", "上九"]
# 正则
yao_pattern = re.compile(r'(初六|初九|六二|九二|六三|九三|六四|九四|六五|九五|上六|上九)')

# 找出所有卦名（section 不为空的文本中提取唯一卦名）
cursor.execute("SELECT DISTINCT section FROM texts WHERE section IS NOT NULL")
sections = [row["section"] for row in cursor.fetchall()]

for section in sections:
    # 查找对应爻辞
    cursor.execute("SELECT id, content FROM texts WHERE section = ?", (section,))
    yao_rows = cursor.fetchall()

    yao_dict = {}
    for row in yao_rows:
        match = yao_pattern.match(row["content"])
        if match:
            label = match.group(1)
            yao_dict[label] = yao_map[label]

    sorted_yaos = [yao_dict[y] for y in yao_order if y in yao_dict]

    if len(sorted_yaos) == 6:
        binary = ''.join(sorted_yaos[::-1])  # 上爻为高位
        upper = binary[:3]  # 上三爻
        lower = binary[3:]  # 下三爻

        cursor.execute("""
            INSERT INTO hexagrams (name, binary, upper_trigram, lower_trigram)
            VALUES (?, ?, ?, ?)
        """, (section, binary, upper, lower))
        
        print(f"✓ Inserted hexagram: {section} — {binary}")
    else:
        print(f"⚠ Skipped {section} — incomplete: {sorted_yaos}")

conn.commit()
conn.close()