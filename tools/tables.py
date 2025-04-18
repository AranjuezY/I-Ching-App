#!/usr/bin/env python3

import sqlite3

# 初始化数据库连接
conn = sqlite3.connect("../test.db")
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

# 创建 trigrams 表
cursor.execute("""
CREATE TABLE IF NOT EXISTS trigrams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    binary TEXT NOT NULL UNIQUE
)
""")

# 八卦数据
trigram_data = [
    ("乾", "111"),
    ("兑", "110"),
    ("离", "101"),
    ("震", "100"),
    ("巽", "011"),
    ("坎", "010"),
    ("艮", "001"),
    ("坤", "000")
]

# 插入数据
cursor.executemany("INSERT OR IGNORE INTO trigrams (name, binary) VALUES (?, ?)", trigram_data)

# 提交并关闭连接
conn.commit()
conn.close()