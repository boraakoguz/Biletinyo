from flask import Blueprint, jsonify, request
from database import db_pool
from flask_jwt_extended import jwt_required, get_jwt_identity

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
                    seat_map,
                    available
                FROM venue
                ORDER BY venue_name;
            """)
            venues = cur.fetchall()
        db_pool.putconn(conn)
        return jsonify([
            {
                "venue_id": venue[0],
                "capacity": venue[1],
                "location": venue[2],
                "venue_name": venue[3],
                "venue_description": venue[4],
                "city": venue[5],
                "seat_map": venue[6],
                "available": venue[7]
            }
            for venue in venues
        ])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@bp.route("/<int:venue_id>", methods=["GET"])
def get_venue_by_id(venue_id):
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
                    seat_map,
                    available
                FROM venue
                WHERE venue_id = %s;
                """, (venue_id,))
            venue = cur.fetchone()
        return jsonify({
            "venue_id": venue[0],
            "capacity": venue[1],
            "location": venue[2],
            "venue_name": venue[3],
            "venue_description": venue[4],
            "city": venue[5],
            "seat_map": venue[6],
            "available": venue[7]
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)

@bp.route("/", methods=["POST"])
def post_venue():
    data = request.get_json()
    capacity = data.get("capacity")
    location = data.get("location")
    venue_name = data.get("venue_name")
    venue_description = data.get("venue_description")
    city = data.get("city")
    seat_map = data.get("seat_map")
    available = 1
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("""INSERT INTO venue (capacity, location, venue_name, venue_description, city, seat_map, available)
                VALUES (%s, %s, %s, %s, %s, %s, %s);""",(capacity, location, venue_name, venue_description, city, seat_map, available))
            conn.commit()
        return "Insertion Successful", 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)

@bp.route("/<int:venue_id>", methods=["PUT"])
def put_venue_by_id(venue_id):
    data = request.get_json(force=True) or {}
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("""
                SELECT capacity, location, venue_name, venue_description,
                       city, available
                FROM venue
                WHERE venue_id = %s
                FOR UPDATE
            """, (venue_id,))
            venue = cur.fetchone()
            (
                capacity, location, venue_name, venue_description,
                city, available
            ) = (
                data.get("capacity", venue[0]),
                data.get("location", venue[1]),
                data.get("venue_name", venue[2]),
                data.get("venue_description", venue[3]),
                data.get("city", venue[4]),
                data.get("available", venue[6]),
            )
            cur.execute("""
                UPDATE venue
                   SET capacity=%s,
                       location=%s,
                       venue_name=%s,
                       venue_description=%s,
                       city=%s,
                       available=%s
                 WHERE venue_id=%s;
            """, (
                capacity, location, venue_name, venue_description,
                city, available, venue_id
            ))
            conn.commit()
        return "Update successful", 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)
