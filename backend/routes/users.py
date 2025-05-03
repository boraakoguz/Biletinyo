from flask import Blueprint, jsonify, request
from database import db_pool

bp = Blueprint("users", __name__)

@bp.route("/", methods=["GET"])
def get_users():
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("SELECT user_id, name, email FROM users;")
            users = cur.fetchall()
        db_pool.putconn(conn)
        return jsonify([{"id": u[0], "name": u[1], "email": u[2]} for u in users])
    except Exception as e:
        return jsonify({"error": str(e)}), 500