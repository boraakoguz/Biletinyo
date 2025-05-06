from flask import Blueprint, jsonify, request
from database import db_pool

bp = Blueprint("users", __name__)

@bp.route("/", methods=["GET"])
def get_users():
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("SELECT user_id, name, email, user_type, phone FROM users;")
            users = cur.fetchall()
        return jsonify([{"id": u[0], "name": u[1], "email": u[2], "user_type": u[3], "phone": u[4]} for u in users])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)
    
@bp.route("/<int:user_id>", methods=["GET"])
def get_user_by_id(user_id):
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("SELECT user_id, name, email, user_type, phone FROM users WHERE user_id=%s;",(user_id,))
            user = cur.fetchone()
        return jsonify([{"id": user[0], "name": user[1], "email": user[2], "user_type": user[3], "phone": user[4]}])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)
    
@bp.route("/<int:user_id>", methods=["DELETE"])
def delete_user_by_id(user_id):
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("DELETE FROM users WHERE user_id=%s;",(user_id,))
            conn.commit()
        return "Deletion Successful", 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)

@bp.route("/<string:name>/<string:email>/<string:password>/<int:user_type>/<string:phone>", methods=["POST"])
def post_user_by_id(name, email, password, user_type, phone):
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("""INSERT INTO users (name, email, password, user_type, phone)
                VALUES (%s, %s, %s, %s, %s);""",(name, email, password, user_type, phone,))
            conn.commit()
        return "Insertion Successful", 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)

@bp.route("/<int:user_id>/<string:name>/<string:email>/<string:password>/<int:user_type>/<string:phone>", methods=["PUT"])
def put_user_by_id(user_id, name, email, password, user_type, phone):
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("UPDATE users SET name=%s, email=%s, password=%s, user_type=%s, phone=%s WHERE user_id=%s;",(name, email, password, user_type, phone, user_id,))
            conn.commit()
        return "Update Successful", 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn) 
            