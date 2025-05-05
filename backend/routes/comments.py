from flask import Blueprint, jsonify, request
from database import db_pool

bp = Blueprint("comments", __name__)

@bp.route("/", methods=["GET"])
def get_comments():
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("SELECT comment_id, rating, comment_title, comment_text, comment_date FROM comment;")
            comments = cur.fetchall()
        db_pool.putconn(conn)
        return jsonify([{"rating": e[0], "comment_title": e[1], "comment_text": e[2], "comment_date": e[3]} for e in comments])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
#POST COMMENT