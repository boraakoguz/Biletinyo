from flask import Blueprint, jsonify, request
from database import db_pool

bp = Blueprint("venues", __name__)

@bp.route("/", methods=["GET"])
def get_venues():
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("""
                SELECT 
                    venue_id,
                    capacity,
                    location,
                    venue_name,
                    venue_description,
                    city,
                    seat_map
                FROM venue
                ORDER BY venue_name;
            """)
            venues = cur.fetchall()
        db_pool.putconn(conn)
        return jsonify([
            {
                "venue_id": v[0],
                "capacity": v[1],
                "location": v[2],
                "venue_name": v[3],
                "venue_description": v[4],
                "city": v[5],
                "seat_map": v[6]
            }
            for v in venues
        ])
    except Exception as e:
        return jsonify({"error": str(e)}), 500