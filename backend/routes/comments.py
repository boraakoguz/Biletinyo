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
        return jsonify([{"rating": e[0], "comment_title": e[1], "comment_text": e[2], "comment_date": e[3]} for e in comments])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)
    
@bp.route("/", methods=["POST"])
def post_comment():
    data = request.get_json()
    rating = data.get("rating")
    comment_title = data.get("comment_title")
    comment_text = data.get("comment_text")
    comment_date = data.get("comment_date")
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("""INSERT INTO comment (rating, comment_title, comment_text, comment_date)
                VALUES (%s, %s, %s, %s);""",(rating, comment_title, comment_text, comment_date,))
        conn.commit()
        return "Insertion Successful", 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)