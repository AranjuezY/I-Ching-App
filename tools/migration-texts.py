#!/usr/bin/env python3

import json
import sqlite3
from opencc import OpenCC

cc = OpenCC('s2t')
conn = sqlite3.connect('../test.db')
cursor = conn.cursor()

# 载入JSON文件
with open('hexagrams_text.json', 'r', encoding='utf-8') as f:
    gua_texts = json.load(f)

# 写入 texts 表
for gua_pinyin, gua in gua_texts.items():
    title = gua.get('title', '')
    hexagram_name = title.lstrip("䷀䷁䷂䷃䷄䷅䷆䷇䷈䷉䷊䷋䷌䷍䷎䷏䷐䷑䷒䷓䷔䷕䷖䷗䷘䷙䷚䷛䷜䷝䷞䷟䷠䷡䷢䷣䷤䷥䷦䷧䷨䷩䷪䷫䷬䷭䷮䷯䷰䷱䷲䷳䷴䷵䷶䷷䷸䷹䷺䷻䷼䷽䷾䷿")  # 只保留汉字
    fulltext = gua.get('fulltext', [])

    for line in fulltext:
        # 插入 texts 表（source、section 可先写默认）
        cursor.execute(
            'INSERT INTO texts (source, section, content) VALUES (?, ?, ?)',
            ('经文', cc.convert(hexagram_name), cc.convert(line))
        )

    print(f"✓ 已导入：{title}")

conn.commit()
conn.close()
