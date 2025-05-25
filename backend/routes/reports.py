from flask import Blueprint, jsonify, request
from database import db_pool
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint("reports", __name__)

@bp.route("/", methods=["GET"])
def get_reports():
    conn = None
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("""
                SELECT
                  report_id,
                  report_name,
                  generated_at,
                  payload
                FROM report
                ORDER BY generated_at DESC;
            """)
            rows = cur.fetchall()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)

    data = [
        {
          "report_id":   r[0],
          "report_name": r[1],
          "generated_at": r[2].isoformat(),
          "payload":     r[3]
        }
        for r in rows
    ]
    return jsonify(data), 200


@bp.route("/<int:report_id>", methods=["GET"])
def get_report_by_id(report_id):
    conn = None
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("""
                SELECT
                  report_id,
                  report_name,
                  generated_at,
                  payload
                FROM report
                WHERE report_id = %s;
            """, (report_id,))
            row = cur.fetchone()
            if row is None:
                return jsonify({"error": "Report not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)

    report = {
      "report_id":    row[0],
      "report_name":  row[1],
      "generated_at": row[2].isoformat(),
      "payload":      row[3]
    }
    return jsonify(report), 200
        
@bp.route("/daily_revenue", methods=["GET"])
def get_daily_revenue():
    start = request.args.get("start_date")
    end   = request.args.get("end_date")

    sql = """
      SELECT rev_date, total_amount
        FROM daily_revenue
      WHERE 1=1
    """
    params = []
    if start:
        sql += " AND rev_date >= %s"
        params.append(start)
    if end:
        sql += " AND rev_date <= %s"
        params.append(end)

    sql += " ORDER BY rev_date;"

    conn = None
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute(sql, params)
            rows = cur.fetchall()
    finally:
        if conn:
            db_pool.putconn(conn)

    data = [
        {
            "date": row[0].isoformat(),
            "total_amount": float(row[1])
        }
        for row in rows
    ]
    return jsonify(data), 200

@bp.route("/sales_summary", methods=["GET"])
def sales_summary():
    conn = None
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("""
                        WITH
                        daily AS (
                            SELECT
                            COUNT(*)         AS cnt,
                            COALESCE(SUM(payment_amount), 0) AS total
                            FROM payment
                            WHERE payment_date = CURRENT_DATE
                        ),
                        weekly AS (
                            SELECT
                            COUNT(*)         AS cnt,
                            COALESCE(SUM(payment_amount), 0) AS total
                            FROM payment
                            WHERE payment_date BETWEEN CURRENT_DATE - INTERVAL '6 days'
                                                AND CURRENT_DATE
                        )
                        SELECT
                        d.cnt      AS daily_count,
                        d.total    AS daily_total,
                        w.cnt      AS weekly_count,
                        w.total    AS weekly_total
                        FROM daily d
                        CROSS JOIN weekly w;
                        """
                        )
            row = cur.fetchone()
    finally:
        if conn:
            db_pool.putconn(conn)

    daily_count, daily_total, weekly_count, weekly_total = row

    return jsonify({
        "daily":  { "count": daily_count,  "total_amount": float(daily_total) },
        "weekly": { "count": weekly_count, "total_amount": float(weekly_total) }
    }), 200


@bp.route("/top_events", methods=["GET"])
def get_top_events():
    conn = None
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("""
                        SELECT
                            e.event_id,
                            e.event_title,
                            COUNT(t.ticket_id) AS tickets_sold,
                            COALESCE(SUM(t.price), 0) AS revenue
                        FROM event e JOIN ticket t ON t.event_id = e.event_id JOIN payment p ON t.payment_id = p.payment_id
                        GROUP BY e.event_id, e.event_title
                        ORDER BY tickets_sold DESC
                        LIMIT 5;
                        """
                        )
            rows = cur.fetchall()
    finally:
        if conn:
            db_pool.putconn(conn)

    data = [
        {
          "event_id":      row[0],
          "event_title":   row[1],
          "tickets_sold":  row[2],
          "revenue":       float(row[3])
        }
        for row in rows
    ]
    return jsonify(data), 200
