from flask import Blueprint, jsonify, request
from database import db_pool
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint("payments", __name__)

@bp.route("/<int:user_id>", methods=["GET"])
def get_payments_by_user_id(user_id):
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("SELECT payment_id, attendee_id, payment_amount, payment_method, payment_date FROM payment WHERE attendee_id=%s;", (user_id,))
            payments = cur.fetchall()
        return jsonify([{"payment_id": payment[0], "attendee_id": payment[1], "payment_amount": payment[2], "payment_method": payment[3], "payment_date": payment[4]} for payment in payments])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)
