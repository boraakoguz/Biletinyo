from flask import Blueprint, jsonify, request
from database import db_pool
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint("comments", __name__)

@bp.route("/", methods=["GET"])
def get_comments():
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("SELECT comment_id, event_id, attendee_id, rating, comment_title, comment_text, comment_date FROM comment;")
            comments = cur.fetchall()
        return jsonify([{"comment_id": comment[0], "event_id": comment[1], "attendee_id": comment[2], "rating": comment[3], "comment_title": comment[4], "comment_text": comment[5], "comment_date": comment[6]} for comment in comments])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)
    
@bp.route("/<int:comment_id>", methods=["DELETE"])
@jwt_required()
def delete_comment_by_id(comment_id):
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("DELETE FROM comments WHERE comment_id=%s;", (comment_id,))
            conn.commit()
        return "Deletion Successful", 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)

@bp.route("/", methods=["POST"])
@jwt_required()
def post_comment():
    data = request.get_json()
    event_id = data.get("event_id")
    attendee_id = data.get("attendee_id")
    rating = data.get("rating")
    comment_title = data.get("comment_title")
    comment_text = data.get("comment_text")
    comment_date = data.get("comment_date")
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("""INSERT INTO comment (event_id, attendee_id, rating, comment_title, comment_text, comment_date)
                VALUES (%s, %s, %s, %s, %s, %s);""",(event_id, attendee_id, rating, comment_title, comment_text, comment_date,))
        conn.commit()
        return "Insertion Successful", 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)