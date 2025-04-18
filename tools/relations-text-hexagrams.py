#!/usr/bin/env python3

import sqlite3

conn = sqlite3.connect('../test.db')
cursor = conn.cursor()

# 获取所有 hexagram 名称（卦名）及其 ID
cursor.execute("SELECT id, name FROM hexagrams")
hexagram_name_to_id = {name: hid for hid, name in cursor.fetchall()}

# 查找所有 texts 表中还未关联的记录（你可以根据需要调整）
cursor.execute("SELECT id, section FROM texts")
text_rows = cursor.fetchall()

count = 0
for text_id, section in text_rows:
    # 从 section 提取卦名
    if not section:
        continue
    gua_name = section

    hexagram_id = hexagram_name_to_id.get(gua_name)
    if hexagram_id:
        # 插入链接表
        cursor.execute(
            "INSERT INTO text_hexagram_links (text_id, hexagram_id) VALUES (?, ?)",
            (text_id, hexagram_id)
        )
        count += 1
    else:
        print(f"⚠ 找不到卦名：{gua_name}, section = {section}")

conn.commit()
conn.close()