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

@bp.route("/", methods=["GET"])
def get_payments():
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("SELECT payment_id, attendee_id, payment_amount, payment_method, payment_date FROM payment;")
            payments = cur.fetchall()
        return jsonify([{"payment_id": payment[0], "attendee_id": payment[1], "payment_amount": payment[2], "payment_method": payment[3], "payment_date": payment[4]} for payment in payments])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)


@bp.route("/", methods=["POST"])
def create_test_payment():
    """
    Expects JSON in the body:
    {
      "attendee_id": <int>,
      "payment_amount": <number>,
      "payment_method": <string or int>,
      "payment_date": "YYYY-MM-DD"
    }
    """
    data = request.get_json()
    attendee_id     = data.get("attendee_id")
    payment_amount  = data.get("payment_amount")
    payment_method  = data.get("payment_method")
    payment_date    = data.get("payment_date")  # e.g. "2025-05-25"

    if not all([attendee_id, payment_amount, payment_date]):
        return jsonify({"error": "attendee_id, payment_amount and payment_date are required"}), 400

    conn = None
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO payment (attendee_id, payment_amount, payment_method, payment_date)
                VALUES (%s, %s, %s, %s)
                RETURNING payment_id;
            """, (attendee_id, payment_amount, payment_method, payment_date))
            new_id = cur.fetchone()[0]
        conn.commit()

        return jsonify({
            "message": "Test payment created",
            "payment_id": new_id
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if conn:
            db_pool.putconn(conn)