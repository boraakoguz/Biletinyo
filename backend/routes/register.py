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
    user_type = data.get("user_type")
    organization_name = data.get("organization_name")

    if not all([name, email, password, phone, birth_date]) or user_type is None:
        return jsonify({"error": "Missing required fields"}), 400

    hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    conn = None

    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO users (name, email, password, user_type, phone, birth_date)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING user_id;
            """, (name, email, hashed_password, user_type, phone, birth_date))

            user_id = cur.fetchone()[0]

            if user_type == 1:
                if not organization_name:
                    return jsonify({"error": "Missing organization name for organizer"}), 400
                cur.execute("""
                    INSERT INTO organizer (user_id, organization_name)
                    VALUES (%s, %s);
                """, (user_id, organization_name))
                
            conn.commit()
        return jsonify({"Success": "User Created"}), 200

    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        if conn:
            db_pool.putconn(conn)