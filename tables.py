#!/usr/bin/env python3

import sqlite3

# 初始化数据库连接
conn = sqlite3.connect("test.db")
cursor = conn.cursor()

# 创建表结构
cursor.executescript("""
CREATE TABLE IF NOT EXISTS hexagrams (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    binary TEXT NOT NULL,
    upper_trigram TEXT,
    lower_trigram TEXT
);

CREATE TABLE IF NOT EXISTS yaos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hexagram_id INTEGER NOT NULL,
    position INTEGER NOT NULL,
    label TEXT,
    FOREIGN KEY (hexagram_id) REFERENCES hexagrams(id)
);

CREATE TABLE IF NOT EXISTS texts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source TEXT NOT NULL,
    section TEXT,
    content TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS text_hexagram_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text_id INTEGER NOT NULL,
    hexagram_id INTEGER NOT NULL,
    FOREIGN KEY (text_id) REFERENCES texts(id),
    FOREIGN KEY (hexagram_id) REFERENCES hexagrams(id)
);

CREATE TABLE IF NOT EXISTS text_yao_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text_id INTEGER NOT NULL,
    yao_id INTEGER NOT NULL,
    FOREIGN KEY (text_id) REFERENCES texts(id),
    FOREIGN KEY (yao_id) REFERENCES yaos(id)
);

CREATE TABLE IF NOT EXISTS hexagram_relations (
    hexagram_id INTEGER PRIMARY KEY,
    inverted_id INTEGER,
    opposite_id INTEGER,
    mutual_id INTEGER,
    FOREIGN KEY (hexagram_id) REFERENCES hexagrams(id),
    FOREIGN KEY (inverted_id) REFERENCES hexagrams(id),
    FOREIGN KEY (opposite_id) REFERENCES hexagrams(id),
    FOREIGN KEY (mutual_id) REFERENCES hexagrams(id)
);
""")

# 定义六十四卦
hexagrams_data = [
    ("乾", "111111"),
    ("坤", "000000"),
    ("屯", "100010"),
    ("蒙", "010001"),
    ("需", "111010"),
    ("讼", "010111"),
    ("师", "000010"),
    ("比", "010000"),
    ("小畜", "110111"),
    ("履", "111011"),
    ("泰", "000111"),
    ("否", "111000"),
    ("同人", "101111"),
    ("大有", "111101"),
    ("谦", "000100"),
    ("豫", "001000"),
    ("随", "011001"),
    ("蛊", "100110"),
    ("临", "000011"),
    ("观", "110000"),
    ("噬嗑", "101001"),
    ("贲", "100101"),
    ("剥", "000001"),
    ("复", "100000"),
    ("无妄", "111001"),
    ("大畜", "100111"),
    ("颐", "100001"),
    ("大过", "110011"),
    ("坎", "010010"),
    ("离", "101101"),
    ("咸", "011100"),
    ("恒", "001110"),
    ("遁", "111100"),
    ("大壮", "001111"),
    ("晋", "101000"),
    ("明夷", "000101"),
    ("家人", "101100"),
    ("睽", "001101"),
    ("蹇", "010100"),
    ("解", "001010"),
    ("损", "110001"),
    ("益", "100011"),
    ("夬", "111110"),
    ("姤", "011111"),
    ("萃", "011000"),
    ("升", "000110"),
    ("困", "010011"),
    ("井", "110010"),
    ("革", "101110"),
    ("鼎", "011101"),
    ("震", "001001"),
    ("艮", "100100"),
    ("渐", "110100"),
    ("归妹", "001011"),
    ("丰", "101011"),
    ("旅", "110101"),
    ("巽", "011011"),
    ("兑", "110110"),
    ("涣", "011010"),
    ("节", "010110"),
    ("中孚", "011101"),
    ("小过", "110111"),
    ("既济", "101010"),
    ("未济", "010101"),
]

# 爻标签定义
yao_labels = ["初", "二", "三", "四", "五", "上"]
yao_symbols = {"1": "九", "0": "六"}

# 插入数据
for i, (name, binary) in enumerate(hexagrams_data):
    hid = i + 1
    upper = binary[0:3]
    lower = binary[3:6]
    cursor.execute("""
        INSERT INTO hexagrams (id, name, binary, upper_trigram, lower_trigram)
        VALUES (?, ?, ?, ?, ?)
    """, (hid, name, binary, upper, lower))

    for pos in range(6):
        bit = binary[pos]
        label = yao_labels[pos] + yao_symbols[bit]
        cursor.execute("""
            INSERT INTO yaos (hexagram_id, position, label)
            VALUES (?, ?, ?)
        """, (hid, pos + 1, label))

# 提交并关闭连接
conn.commit()
conn.close()

print("done")
