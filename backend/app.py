import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
from psycopg2 import pool

app = Flask(__name__)
CORS(app)

DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', 5432),
    'database': os.getenv('DB_NAME', 'postgres'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', 'postgres')
}

db_pool = psycopg2.pool.SimpleConnectionPool(
    1, 10,
    host=DB_CONFIG['host'],
    port=DB_CONFIG['port'],
    database=DB_CONFIG['database'],
    user=DB_CONFIG['user'],
    password=DB_CONFIG['password']
)

@app.route("/api/connection_test")
def test_db():
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("SELECT 1;")
            result = cur.fetchone()
        db_pool.putconn(conn)
        return jsonify({"db": "connected", "result": result})
    except Exception as e:
        return jsonify({"db": "error", "error": str(e)}), 500

@app.route("/api/applications", methods=["GET"])
def get_applications():
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("""
                SELECT s.sid, s.sname, c.cid, c.cname
                FROM student s
                JOIN apply a ON s.sid = a.sid
                JOIN company c ON a.cid = c.cid
                ORDER BY s.sid, c.cid
            """)
            results = cur.fetchall()
        db_pool.putconn(conn)
        data = []
        for sid, sname, cid, cname in results:
            data.append({"sid": sid, "sname": sname, "cid": cid, "cname": cname})
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=port)
