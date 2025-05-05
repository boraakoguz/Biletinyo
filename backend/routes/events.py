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
    
# APIs do not get image_ids
    
@bp.route("/<int:event_id>", methods=["GET"])
def get_event_by_id(event_id):
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("SELECT event_id, event_title, description, event_date, category, revenue, regulations, organizer_id, venue_id FROM event WHERE event_id=%s;",(event_id,))
            event = cur.fetchone()
        return jsonify([{"event_id": event[0], "event_title": event[1], "description": event[2], "event_date": event[3], "category": event[4], "revenue": event[5], "regulations": event[6], "organizer_id": event[7], "venue_id": event[8]}])
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

@bp.route("/<string:event_title>/<string:description>/<string:event_date>/<int:category>/<float:revenue>/<string:regulations>/<int:organizer_id>/<int:venue_id>", methods=["POST"])
def post_user_by_id(event_title, description, event_date, category, revenue, regulations, organizer_id, venue_id):
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

@bp.route("/<int:event_id>/<string:event_title>/<string:description>/<string:event_date>/<int:category>/<float:revenue>/<string:regulations>/<int:organizer_id>/<int:venue_id>", methods=["PUT"])
def put_user_by_id(event_id, event_title, description, event_date, category, revenue, regulations, organizer_id, venue_id):
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