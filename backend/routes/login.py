from flask import Blueprint, jsonify, request
from database import db_pool
import bcrypt
from flask_jwt_extended import create_access_token

bp = Blueprint("login", __name__)

@bp.route("/", methods=["POST"])
def login():
    data = request.get_json(force=True)
    email    = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error":"Invalid email or password"}), 401
    
    conn = None

    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("SELECT user_id, name, email, password, user_type, phone FROM users U WHERE U.email = %s", (email, ))
            user = cur.fetchone()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)
                
    if not user:
        return jsonify({"error":"Invalid email or password"}), 401
    
    user_id, name, email, hashed_password, user_type, phone  = user

    if not bcrypt.checkpw(password.encode(), hashed_password.encode()):
        return jsonify({"error":"Invalid email or password"}), 401

    access_token  = create_access_token(identity=user_id)
    return jsonify({
        "access_token":  access_token,
        "user": {
            "id": user_id,
            "name": name,
            "email": email,
            "user_type": user_type,
            "phone": phone
        }
    }), 200