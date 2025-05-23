from flask import Blueprint, jsonify, request
from database import db_pool
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint("payments", __name__)

@bp.route("/<int:user_id>", methods=["GET"])
@jwt_required()
def get_payments_by_user_id(user_id):
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("SELECT payment_id, attendee_id, payment_amount, payment_method, payment_status, payment_date FROM payment WHERE attendee_id=%s;", (user_id,))
            payments = cur.fetchall()
        return jsonify([{"payment_id": payment[0], "attendee_id": payment[1], "payment_amount": payment[2], "payment_method": payment[3], "payment_status": payment[4], "payment_date": payment[5]} for payment in payments])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)

@bp.route("/", methods=["POST"])
@jwt_required()
def post_payment():
    data = request.get_json()
    attendee_id = data.get("attendee_id")
    payment_amount = data.get("payment_amount")
    payment_method = data.get("payment_method")
    payment_status = data.get("payment_status")
    payment_date = data.get("payment_date")
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("""INSERT INTO payment (attendee_id, payment_amount, payment_method, payment_status, payment_date)
                VALUES (%s, %s, %s, %s, %s);""",(attendee_id, payment_amount, payment_method, payment_status, payment_date,))
        conn.commit()
        return "Insertion Successful", 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)