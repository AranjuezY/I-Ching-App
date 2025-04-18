#!/usr/bin/env python3

import sqlite3
from collections import defaultdict

# 加载数据库
conn = sqlite3.connect("../test.db")
cursor = conn.cursor()

# 获取所有卦的 id 和 binary
cursor.execute("SELECT id, binary FROM hexagrams")
hexagrams = cursor.fetchall()

# 检查binary是否有重复
binary_count = defaultdict(list)
for hid, binary in hexagrams:
    binary_count[binary].append(hid)

# 找出重复的binary
duplicates = {binary: ids for binary, ids in binary_count.items() if len(ids) > 1}

if duplicates:
    print("错误：发现重复的卦象binary：")
    for binary, ids in duplicates.items():
        print(f"binary: {binary}, 重复的ID: {ids}")
    conn.close()
    exit(1)

# 创建 binary -> id 映射方便查找
binary_to_id = {binary: hid for hid, binary in hexagrams}

def flip(binary):
    return ''.join('0' if b == '1' else '1' for b in binary)

def invert(binary):
    return binary[::-1]

def mutual(binary):
    # 中间四爻（第2~5位）变为新卦的外卦和内卦
    outer = binary[1:4]
    inner = binary[2:5]
    return outer + inner

relations = []
for hid, binary in hexagrams:
    opp = flip(binary)
    inv = invert(binary)
    mut = mutual(binary)

    opposite_id = binary_to_id.get(opp)
    inverted_id = binary_to_id.get(inv)
    mutual_id = binary_to_id.get(mut)

    # 检查转换后的卦象是否存在
    if opposite_id is None:
        print(f"警告：卦象ID {hid} 的 opposite 版本 {opp} 不存在于数据库中")
    if inverted_id is None:
        print(f"警告：卦象ID {hid} 的 inverted 版本 {inv} 不存在于数据库中")
    if mutual_id is None:
        print(f"警告：卦象ID {hid} 的 mutual 版本 {mut} 不存在于数据库中")

    relations.append((hid, inverted_id, opposite_id, mutual_id))

# 插入或替换 hexagram_relations 表
cursor.executemany("""
    INSERT OR REPLACE INTO hexagram_relations (hexagram_id, inverted_id, opposite_id, mutual_id)
    VALUES (?, ?, ?, ?)
""", relations)

# 提交并关闭
conn.commit()
conn.close()

print("卦象关系处理完成，未发现重复的binary")
