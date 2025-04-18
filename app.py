from flask import Flask, jsonify, g
import sqlite3

app = Flask(__name__)
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

# 获取某一卦的详细信息，包括文本
@app.route('/api/hexagram/<int:hexagram_id>')
def get_hexagram(hexagram_id):
    db = get_db()
    
    # 卦象基本信息
    cursor = db.execute('SELECT id, name, binary FROM hexagrams WHERE id = ?', (hexagram_id,))
    hexagram = cursor.fetchone()
    if not hexagram:
        return jsonify({'error': 'Hexagram not found'}), 404

    # 卦辞和爻辞
    cursor = db.execute('SELECT id, content, section FROM texts WHERE hexagram_id = ? ORDER BY id', (hexagram_id,))
    texts = [dict(row) for row in cursor.fetchall()]

    return jsonify({
        'id': hexagram['id'],
        'name': hexagram['name'],
        'binary': hexagram['binary'],
        'texts': texts
    })

# 测试页面（可选）
@app.route('/')
def index():
    return '<h2>易经 API 后端运行中</h2><p>访问 <code>/api/hexagrams</code> 获取数据</p>'

# -------------------------

if __name__ == '__main__':
    app.run(debug=True)
