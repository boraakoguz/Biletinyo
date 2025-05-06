from flask import Blueprint, jsonify, request
from database import db_pool

bp = Blueprint("events", __name__)
    
@bp.route("/", methods=["GET"])
def get_events():
    category    = request.args.get("category")
    event_date  = request.args.get("date")
    city        = request.args.get("city")

    filters = []
    params  = []

    if category:
        filters.append("e.category = %s")
        params.append(category)
    if event_date:
        filters.append("e.event_date = %s")
        params.append(event_date)
    if city:
        filters.append("v.city = %s")
        params.append(city)

    where = ""
    if filters:
        where = "WHERE " + " AND ".join(filters)

    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute(f"""
            SELECT
            e.event_title,
            e.event_date,
            v.venue_name,
            e.event_id
            FROM event AS e
            LEFT JOIN venue AS v ON v.venue_id = e.venue_id
            {where}
            ORDER BY e.event_date;
            """, params)
            events = cur.fetchall()
            return jsonify([
            {
                "event_title": r[0],
                "event_date" : r[1],
                "venue_name" : r[2],
                "event_id"   : r[3],
            } for r in events]), 200 
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)   
    
@bp.route("/<int:event_id>", methods=["GET"])
def get_event_by_id(event_id):
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("""
                SELECT 
                    e.event_id,
                    e.event_title,
                    e.description,
                    e.event_date::date AS event_date,
                    TO_CHAR(e.event_date, 'HH24:MI') AS event_time,
                    e.category,
                    e.revenue,
                    e.regulations,
                    e.organizer_id,
                    e.venue_id,
                    v.venue_name,
                    v.city,
                    v.location
                FROM event  e
                JOIN venue  v  ON v.venue_id = e.venue_id
                WHERE e.event_id = %s;
                """, (event_id,))
            event = cur.fetchone()
        return jsonify({
            "event_id" : event[0],
            "event_title" : event[1],
            "description" : event[2],
            "event_date" : event[3],
            "event_time" : event[4],
            "category" : event[5],
            "revenue" : event[6],
            "regulations" : event[7],
            "organizer_id" : event[8],
            "venue_id" : event[9],
            "venue_name" : event[10],
            "venue_city" : event[11],
            "venue_location" : event[12],
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)

@bp.route("/<int:event_id>", methods=["DELETE"])
def delete_event_by_id(event_id):
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("DELETE FROM event WHERE event_id=%s;",(event_id,))
            conn.commit()
        return "Deletion Successful", 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)

@bp.route("/", methods=["POST"])
def post_event():
    data = request.get_json()
    event_title = data.get("event_title")
    description = data.get("description")
    event_date = data.get("event_date")
    category = data.get("category")
    revenue = data.get("revenue", 0.0)
    regulations = data.get("regulations")
    organizer_id = data.get("organizer_id")
    venue_id = data.get("venue_id")
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("""INSERT INTO event (event_title, description, event_date, category, revenue, regulations, organizer_id, venue_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s);""",(event_title, description, event_date, category, revenue, regulations, organizer_id, venue_id,))
            conn.commit()
        return "Insertion Successful", 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)

@bp.route("/<int:event_id>", methods=["PUT"])
def put_event_by_id(event_id):
    data = request.get_json()
    event_title = data.get("event_title")
    description = data.get("description")
    event_date = data.get("event_date")
    category = data.get("category")
    revenue = data.get("revenue", 0.0)
    regulations = data.get("regulations")
    organizer_id = data.get("organizer_id")
    venue_id = data.get("venue_id")
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("UPDATE event SET event_title=%s, description=%s, event_date=%s, category=%s, revenue=%s, regulations=%s, organizer_id=%s, venue_id=%s WHERE event_id=%s;",(event_title, description, event_date, category, revenue, regulations, organizer_id, venue_id, event_id,))
            conn.commit()
        return "Update Successful", 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)