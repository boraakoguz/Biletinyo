from flask import Blueprint, jsonify, request
from database import db_pool

bp = Blueprint("events", __name__)

@bp.route("/", methods=["GET"])
def get_events():
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("""
                SELECT 
                  e.event_title, 
                  e.event_date, 
                  v.venue_name,
                  e.event_id
                FROM event AS e
                LEFT JOIN venue AS v 
                  ON e.venue_id = v.venue_id
                ORDER BY e.event_date;
            """)
            events = cur.fetchall()
        db_pool.putconn(conn)
        return jsonify([{"event_title": e[0], "event_date": e[1], "venue_name": e[2], "event_id": e[3]} for e in events])
    except Exception as e:
        return jsonify({"error": str(e)}), 500