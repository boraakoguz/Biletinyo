from flask import Blueprint, jsonify, request
from database import db_pool
import bcrypt
import definitions

bp = Blueprint("register", __name__)

@bp.route("/", methods=["POST"])
def register():
    data = request.get_json(force=True)
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone")
    birth_date = data.get("birth_date")

    if not all([name, email, password, phone, birth_date]):
        return jsonify({"error": "Missing required fields"}), 400
    
    hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    conn = None

    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO users (name, email, password, user_type, phone, birth_date)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (name, email, hashed_password, definitions.USER_TYPE_ATTENDEE, phone, birth_date))
            conn.commit()
        return jsonify({"Success" : "User Created"}), 200
    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"error" : str(e)}), 400
    finally:
        if conn:
            db_pool.putconn(conn)

