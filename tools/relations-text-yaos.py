#!/usr/bin/env python3

import sqlite3
import re

# 连接数据库
conn = sqlite3.connect('../test.db')  # 替换为你的数据库路径
cursor = conn.cursor()

# 正则匹配爻位（例如 初六、九三）
yao_pattern = r'^(初六|初九|六二|九二|六三|九三|六四|九四|六五|九五|上六|上九)'

# 爻位到 position 的映射
yao_position_map = {
    "初六": 1, "初九": 1,
    "六二": 2, "九二": 2,
    "六三": 3, "九三": 3,
    "六四": 4, "九四": 4,
    "六五": 5, "九五": 5,
    "上六": 6, "上九": 6
}

linked = 0
skipped = 0

# 获取所有可能是爻辞的文本记录
cursor.execute("SELECT id, content, section FROM texts")
rows = cursor.fetchall()

for text_id, content, section in rows:
    match = re.match(yao_pattern, content.strip())
    if not match:
        continue  # 非爻辞，跳过

    yao_label = match.group(1)
    position = yao_position_map.get(yao_label)

    if not position:
        print(f"⚠ 未识别的爻位：{yao_label}")
        skipped += 1
        continue

    # 获取卦名（来自 section，格式如 “艮·初六” 或 “艮”）
    gua_name = None
    if section:
        gua_name = section.split("·")[0].strip()
    else:
        print(f"⚠ 缺失 section：text_id={text_id}")
        skipped += 1
        continue

    # 查找爻 ID
    cursor.execute("""
        SELECT id FROM yaos
        WHERE position = ? AND hexagram_id = (
            SELECT id FROM hexagrams WHERE name = ?
        )
    """, (position, gua_name))
    result = cursor.fetchone()

    if result:
        yao_id = result[0]
        cursor.execute("""
            INSERT INTO text_yao_links (text_id, yao_id) VALUES (?, ?)
        """, (text_id, yao_id))
        linked += 1
    else:
        print(f"⚠ 未找到爻记录：{gua_name} - {yao_label}")
        skipped += 1

conn.commit()
conn.close()

print(f"✅ 完成：成功关联 {linked} 条爻辞，跳过 {skipped} 条。")
