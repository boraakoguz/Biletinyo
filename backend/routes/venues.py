from flask import Blueprint, jsonify, request
from database import db_pool
from flask_jwt_extended import jwt_required, get_jwt_identity
import definitions

bp = Blueprint("venues", __name__)

@bp.route("/", methods=["GET"])
def get_venues():
    conn = None
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
    finally:
        if conn:
            db_pool.putconn(conn)
    
@bp.route("/available", methods=["GET"])
def get_available_venues():
    conn = None
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
                WHERE available = %s
                ORDER BY venue_name;
            """, (definitions.VENUE_AVAILABLE,))
            venues = cur.fetchall()
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
    finally:
        if conn:
            db_pool.putconn(conn)

@bp.route("/request", methods=["GET"])
def get_requested_venues():
    conn = None
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
                WHERE available = %s
                ORDER BY venue_name;
            """, (definitions.VENUE_REQUEST,))
            venues = cur.fetchall()
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
    finally:
        if conn:
            db_pool.putconn(conn)

@bp.route("/<int:venue_id>", methods=["GET"])
def get_venue_by_id(venue_id):
    conn = None
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
    available = definitions.VENUE_REQUEST
    
    conn = None
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

@bp.route("/accept/<int:venue_id>", methods=["POST"])
def accept_venue_request(venue_id):
    conn = None
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute(
                "SELECT available FROM venue WHERE venue_id = %s;",
                (venue_id,)
            )
            row = cur.fetchone()
            if row is None:
                return jsonify({"error": "Venue not found"}), 404

            current_status = row[0]
            if current_status != definitions.VENUE_REQUEST:
                return jsonify({"error": f"Venue not pending (status={current_status})"}), 400
            
            cur.execute("""
                UPDATE venue
                   SET available=%s
                 WHERE venue_id=%s;
            """, (definitions.VENUE_AVAILABLE, venue_id))

            conn.commit()
        return "Venuce Accepted", 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)

@bp.route("/reject/<int:venue_id>", methods=["DELETE"])
def reject_venue_request(venue_id):
    conn = None
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute(
                "SELECT available FROM venue WHERE venue_id = %s;",
                (venue_id,)
            )
            row = cur.fetchone()
            if row is None:
                return jsonify({"error": "Venue not found"}), 404

            current_status = row[0]
            if current_status != definitions.VENUE_REQUEST:
                return jsonify({"error": f"Venue not pending (status={current_status})"}), 400
            
            cur.execute(
                "DELETE FROM venue WHERE venue_id = %s;",
                (venue_id,)
            )

            conn.commit()
        return "Venuce Rejected", 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)

@bp.route("/unavailable/<int:venue_id>", methods=["POST"])
def make_venue_unavailable(venue_id):
    conn = None
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute(
                "SELECT available FROM venue WHERE venue_id = %s;",
                (venue_id,)
            )
            row = cur.fetchone()
            if row is None:
                return jsonify({"error": "Venue not found"}), 404

            current_status = row[0]
            if current_status != definitions.VENUE_AVAILABLE:
                return jsonify({"error": f"Venue not available (status={current_status})"}), 400
            
            cur.execute("""
                UPDATE venue
                   SET available=%s
                 WHERE venue_id=%s;
            """, (definitions.VENUE_UNAVAILABLE, venue_id))

            conn.commit()
        return "Venuce Accepted", 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)

@bp.route("/<int:venue_id>", methods=["PUT"])
def put_venue_by_id(venue_id):
    data = request.get_json(force=True) or {}
    conn = None
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

@bp.route("/<int:venue_id>/capacity", methods=["GET"])
def get_venue_computed_capacity(venue_id):
    conn = None
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("""
                SELECT seat_map
                FROM venue
                WHERE venue_id = %s;
            """, (venue_id,))
            row = cur.fetchone()
            if not row:
                return jsonify({"error": "Venue not found"}), 404

            seat_map = row[0] or []
            capacity = sum(
                1 for row in seat_map for seat in row if seat != 0
            )

            return jsonify({
                "venue_id": venue_id,
                "capacity": capacity
            }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)