from flask import Flask, jsonify, g
from flask_cors import CORS
import sqlite3
import re

app = Flask(__name__)
CORS(app)
DATABASE = 'test.db'  # 改成你的数据库文件名

# 数据库连接
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row  # 支持 dict 风格访问
    return db

# 关闭连接
@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# -------------------------
# API 路由部分
# -------------------------

# 获取所有卦的简要信息
@app.route('/api/hexagrams')
def get_all_hexagrams():
    cursor = get_db().execute('SELECT id, name, binary FROM hexagrams ORDER BY id')
    rows = cursor.fetchall()
    data = [dict(row) for row in rows]
    return jsonify(data)

# ------------------------
# 获取某一卦的详细信息
# ------------------------
@app.route("/api/hexagram/<name>")
def get_hexagram(name):
    db = get_db()

    # 查找 hexagram
    hexagram = db.execute("SELECT id, binary FROM hexagrams WHERE name = ?", (name,)).fetchone()
    if not hexagram:
        return jsonify({"error": "hexagram not found"}), 404

    hexagram_id = hexagram["id"]
    binary = hexagram["binary"]

    yao_pattern = re.compile(r'^(初六|初九|六二|九二|六三|九三|六四|九四|六五|九五|上六|上九)')

    # 假设 texts 已经是查询结果，格式为 [{"content": "内容1"}, {"content": "内容2"}, ...]
    texts = db.execute("""
        SELECT t.content FROM texts t
        JOIN text_hexagram_links l ON t.id = l.text_id
        WHERE l.hexagram_id = ?
    """, (hexagram_id,)).fetchall()

    # 直接在Python中分类
    guaci = []
    yaoci = []

    for row in texts:
        content = row["content"]
        if yao_pattern.match(content):
            yaoci.append(content)
        else:
            guaci.append(content)

    # 关联卦象：互卦 mutual，错卦 opposite，综卦 inverted
    relation_row = db.execute("""
        SELECT
            r.mutual_id, r.opposite_id, r.inverted_id,
            h1.name AS mutual_name, h1.binary AS mutual_binary,
            h2.name AS opposite_name, h2.binary AS opposite_binary,
            h3.name AS inverted_name, h3.binary AS inverted_binary
        FROM hexagram_relations r
        LEFT JOIN hexagrams h1 ON r.mutual_id = h1.id
        LEFT JOIN hexagrams h2 ON r.opposite_id = h2.id
        LEFT JOIN hexagrams h3 ON r.inverted_id = h3.id
        WHERE r.hexagram_id = ?
    """, (hexagram_id,)).fetchone()

    #relations中要同时保存卦名
    relations = {
        "mutual": {
            "name": relation_row["mutual_name"],
            "binary": relation_row["mutual_binary"]
        } if relation_row and relation_row["mutual_name"] else None,
        "reverse": {
            "name": relation_row["opposite_name"],
            "binary": relation_row["opposite_binary"]
        } if relation_row and relation_row["opposite_name"] else None,
        "inverse": {
            "name": relation_row["inverted_name"],
            "binary": relation_row["inverted_binary"]
        } if relation_row and relation_row["inverted_name"] else None
    }

    return jsonify({
        "name": name,
        "binary": binary,
        "guaci": guaci,
        "yaoci": yaoci,
        "relations": relations
    })

# 测试页面（可选）
@app.route('/')
def index():
    return '<h2>易经 API 后端运行中</h2><p>访问 <code>/api/hexagrams</code> 获取数据</p>'

# -------------------------

if __name__ == '__main__':
    app.run(debug=True)
