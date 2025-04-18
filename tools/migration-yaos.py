#!/usr/bin/env python3

import sqlite3

conn = sqlite3.connect("../test.db")
cursor = conn.cursor()

# 从 hexagrams 表中读取所有卦的 binary 字符串
cursor.execute("SELECT id, binary FROM hexagrams")
rows = cursor.fetchall()

for hexagram_id, binary in rows:
    if len(binary) != 6:
        print(f"⚠ 卦 {hexagram_id} 的 binary 长度不为6，跳过")
        continue

    # binary 高位为上爻，低位为初爻，因此 position 反向编号
    for i, bit in enumerate(reversed(binary), start=1):  # i = 1 是初爻
        cursor.execute("""
            INSERT INTO yaos (hexagram_id, position, label)
            VALUES (?, ?, ?)
        """, (hexagram_id, i, bit))

conn.commit()
conn.close()
