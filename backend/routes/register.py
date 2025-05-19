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
    organization_name = data.get("organization_name")

    # Validate common fields
    if not all([name, email, password, phone, birth_date]):
        return jsonify({"error": "Missing required fields"}), 400

    hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    conn = None

    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            # Check for duplicate email
            cur.execute("SELECT 1 FROM users WHERE email=%s", (email,))
            if cur.fetchone():
                return jsonify({"error": "Email already registered"}), 400

            if organization_name:
                # Register as organizer
                cur.execute("""
                    INSERT INTO users (name, email, password, user_type, phone, birth_date)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING user_id
                """, (name, email, hashed_password, definitions.USER_TYPE_ORGANIZER, phone, birth_date))
                user_id = cur.fetchone()[0]
                cur.execute("""
                    INSERT INTO organizer (user_id, organization_name)
                    VALUES (%s, %s)
                """, (user_id, organization_name))
                conn.commit()
                return jsonify({"Success": "Organizer Created"}), 200
            else:
                # Register as attendee
                cur.execute("""
                    INSERT INTO users (name, email, password, user_type, phone, birth_date)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING user_id
                """, (name, email, hashed_password, definitions.USER_TYPE_ATTENDEE, phone, birth_date))
                user_id = cur.fetchone()[0]
                cur.execute("""
                    INSERT INTO attendee (user_id, attended_event_count, account_balance)
                    VALUES (%s, %s, %s)
                """, (user_id, 0, 0.0))
                conn.commit()
                return jsonify({"Success": "Attendee Created"}), 200
    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        if conn:
            db_pool.putconn(conn)

