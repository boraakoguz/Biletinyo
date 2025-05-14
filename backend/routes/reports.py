from flask import Blueprint, jsonify, request
from database import db_pool

bp = Blueprint("reports", __name__)

@bp.route("/", methods=["GET"])
def get_reports():
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("SELECT report_id, user_id, most_popular_event_id, report_date, revenue_trend_data FROM report")
            reports = cur.fetchall()
        return jsonify([{"report_id": report[0], "user_id": report[1], "most_popular_event_id": report[2], "report_date": report[3], "revenue_trend_data": report[4]} for report in reports])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)

@bp.route("/<int:report_id>", methods=["GET"])
def get_reports_by_id(report_id):
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("SELECT report_id, user_id, most_popular_event_id, report_date, revenue_trend_data FROM report WHERE report_id=%s", (report_id,))
            report = cur.fetchone()
        return jsonify([{"report_id": report[0], "user_id": report[1], "most_popular_event_id": report[2], "report_date": report[3], "revenue_trend_data": report[4]}])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)


# TODO TO BE CONTINUED
