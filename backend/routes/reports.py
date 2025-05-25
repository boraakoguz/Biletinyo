from flask import Blueprint, jsonify, request
from database import db_pool
from flask_jwt_extended import jwt_required, get_jwt_identity

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

@bp.route("/sales/<int:organizer_id>", methods=["GET"])
def get_sales_report(organizer_id):
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("""
                SELECT e.event_id, e.event_title, COUNT(t.ticket_id) as tickets_sold, SUM(t.price) as total_revenue
                FROM event e
                JOIN venue v ON e.venue_id = v.venue_id
                LEFT JOIN ticket t ON e.event_id = t.event_id
                WHERE v.organizer_id = %s
                GROUP BY e.event_id, e.event_title
                ORDER BY total_revenue DESC
            """, (organizer_id,))
            sales_data = cur.fetchall()
            
        return jsonify([{
            "event_id": row[0],
            "event_title": row[1],
            "tickets_sold": row[2],
            "total_revenue": float(row[3]) if row[3] else 0
        } for row in sales_data])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)

@bp.route("/", methods=["POST"])
def post_report():
    data = request.get_json()
    user_id = data.get("user_id")
    most_popular_event_id = data.get("most_popular_event_id")
    report_date = data.get("report_date")
    revenue_trend_data = data.get("revenue_trend_data")
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("""INSERT INTO report (user_id, most_popular_event_id, report_date, revenue_trend_data)
                VALUES (%s, %s, %s, %s);""",(user_id, most_popular_event_id, report_date, revenue_trend_data,))
            conn.commit()
        return "Insertion Successful", 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)
