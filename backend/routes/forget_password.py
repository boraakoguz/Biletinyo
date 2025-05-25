from flask import Blueprint, jsonify, request
from database import db_pool
import bcrypt
import definitions
from routes.mail import Mail
import secrets
import datetime

bp = Blueprint("forgot_password", __name__)

@bp.route("/", methods=["POST"])
def forgot_password():
    data = request.get_json(force=True)
    email = data.get("email")
    if not email:
        return jsonify({"error": "Email required"}), 400

    conn = None
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("SELECT user_id, name FROM users WHERE email = %s", (email,))
            row = cur.fetchone()
            if row:
                user_id, name = row
                token = secrets.token_urlsafe(32)
                expires = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
                cur.execute("""
                    INSERT INTO password_reset (user_id, token, expires_at)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (user_id) DO UPDATE
                      SET token = EXCLUDED.token,
                          expires_at = EXCLUDED.expires_at;
                """, (user_id, token, expires))
                conn.commit()
                Mail.send_password_reset_email(email, name, token)
    except Exception as e:
        if conn:
            conn.rollback()
    finally:
        if conn:
            db_pool.putconn(conn)

    return jsonify({
        "msg": "If that account exists, you’ll receive a reset link shortly."
    }), 200

@bp.route("/<token>", methods=["POST"])
def reset_password(token):
    data = request.get_json(force=True)
    new_password = data.get("password")
    if not new_password:
        return jsonify({"error": "Password required"}), 400

    conn = None
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("""
                SELECT user_id, expires_at
                  FROM password_reset
                 WHERE token = %s
            """, (token,))
            row = cur.fetchone()

            if not row:
                return jsonify({"error": "Invalid token"}), 400

            user_id, expires_at = row
            if expires_at < datetime.datetime.utcnow():
                return jsonify({"error": "Token expired"}), 400

            hashed = bcrypt.hashpw(new_password.encode(), bcrypt.gensalt()).decode()
            cur.execute("UPDATE users SET password = %s WHERE user_id = %s", (hashed, user_id))

            cur.execute("DELETE FROM password_reset WHERE user_id = %s", (user_id,))
            conn.commit()
        return jsonify({"success": "Password has been reset"}), 200

    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"error": str(e)}), 400

    finally:
        if conn:
            db_pool.putconn(conn)