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
    organizer_id = request.args.get("organizer_id", type=int)
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            if organizer_id:
                cur.execute(
                    "SELECT user_id, organizer_id FROM follow WHERE user_id=%s AND organizer_id=%s;",
                    (user_id, organizer_id)
                )
                follow = cur.fetchone()
                if follow:
                    return jsonify({"user_id": follow[0], "organizer_id": follow[1]}), 200
                else:
                    return jsonify(None), 200  # Not following
            else:
                cur.execute("SELECT user_id, organizer_id FROM follow WHERE user_id=%s;", (user_id,))
                follows = cur.fetchall()
                return jsonify([
                    {"user_id": f[0], "organizer_id": f[1]} for f in follows
                ]), 200
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
                VALUES (%s, %s)
                ON CONFLICT DO NOTHING;""",(user_id, organizer_id,))
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

@bp.route("/count", methods=["GET"])
def get_follower_counts():
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("""
                SELECT
                    o.user_id AS organizer_id,
                    o.organization_name,
                    COUNT(f.user_id) AS follower_count
                FROM follow f
                JOIN organizer o ON f.organizer_id = o.user_id
                GROUP BY o.user_id, o.organization_name;
            """)
            rows = cur.fetchall()
        return jsonify([
            {
                "organizer_id": row[0],
                "organization_name": row[1],
                "follower_count": row[2]
            }
            for row in rows
        ])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)

@bp.route("/count/<int:user_id>", methods=["GET"])
def get_following_count(user_id):
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM follow WHERE user_id = %s;", (user_id,))
            count = cur.fetchone()[0]
        return jsonify({"user_id": user_id, "following_count": count})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)
