from flask import Blueprint, jsonify, request
from database import db_pool

bp = Blueprint("follows", __name__)

@bp.route("/", methods=["GET"])
def get_follows():
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("SELECT user_id, organizer_id FROM follow;")
            follows = cur.fetchall()
        return jsonify([{"user_id": follow[0], "organizer_id": follow[1]} for follow in follows])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)

@bp.route("/<int:user_id>", methods=["GET"])
def get_user_follows(user_id):
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("SELECT user_id, organizer_id FROM follow WHERE user_id=%s;", (user_id,))
            follows = cur.fetchall()
        return jsonify([{"user_id": follow[0], "organizer_id": follow[1]} for follow in follows])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)

@bp.route("/", methods=["POST"])
def follow():
    data = request.get_json()
    user_id = data.get("user_id")
    organizer_id = data.get("organizer_id")
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("""INSERT INTO follow (user_id, organizer_id)
                VALUES (%s, %s);""",(user_id, organizer_id,))
        conn.commit()
        return "Insertion Successful", 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)

@bp.route("/<int:user_id>/<int:organizer_id>", methods=["DELETE"])
def unfollow(user_id, organizer_id):
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("DELETE FROM follow WHERE user_id=%s AND organizer_id=%s;",(user_id, organizer_id,))
            conn.commit()
        return "Deletion Successful", 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)
    