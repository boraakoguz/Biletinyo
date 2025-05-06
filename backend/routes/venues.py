from flask import Blueprint, jsonify, request
from database import db_pool

bp = Blueprint("venues", __name__)

@bp.route("/", methods=["GET"])
def get_all_venues():
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("""
                SELECT 
                    venue_id,
                    venue_name,
                    city,
                    location
                FROM venue
                ORDER BY venue_name;
            """)
            venues = cur.fetchall()
        db_pool.putconn(conn)
        return jsonify([
            {
                "venue_id": v[0],
                "venue_name": v[1],
                "city": v[2],
                "location": v[3]
            }
            for v in venues
        ])
    except Exception as e:
        return jsonify({"error": str(e)}), 500