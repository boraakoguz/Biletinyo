from flask import Blueprint, jsonify, request
from database import db_pool

bp = Blueprint("events", __name__)
    
@bp.route("/", methods=["GET"])
def get_events():
    # --- Parse query parameters ---
    search = request.args.get("search", "").strip()
    category = request.args.get("category")
    event_date = request.args.get("event_date")
    city = request.args.get("city")
    event_status = request.args.get("event_status")

    # --- Build dynamic WHERE clause and parameters ---
    where_clauses = []
    sql_params = []

    if search:
        where_clauses.append(
            "(e.event_title ILIKE %s OR v.venue_name ILIKE %s OR v.city ILIKE %s)"
        )
        like = f"%{search}%"
        sql_params.extend([like, like, like])
    if category:
        where_clauses.append("e.category = %s")
        sql_params.append(category)
    if event_date:
        where_clauses.append("e.event_date = %s")
        sql_params.append(event_date)
    if city:
        where_clauses.append("v.city = %s")
        sql_params.append(city)
    if event_status:
        where_clauses.append("e.event_status = %s")
        sql_params.append(event_status)

    where_sql = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""

    # --- Query database ---
    query = f"""
        SELECT
            e.event_id,
            e.organizer_id,
            e.venue_id,
            e.event_title,
            e.event_status,
            e.description,
            e.event_date,
            e.category,
            e.revenue,
            e.regulations,
            e.category_name,
            e.image_ids,
            v.venue_name,
            v.city,
            v.location
        FROM event AS e
        LEFT JOIN venue AS v ON v.venue_id = e.venue_id
        {where_sql}
        ORDER BY e.event_date;
    """
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute(query, sql_params)
            events = cur.fetchall()
            # --- Build response ---
            result = [
                {
                    "event_id": row[0],
                    "organizer_id": row[1],
                    "venue_id": row[2],
                    "event_title": row[3],
                    "event_status": row[4],
                    "description": row[5],
                    "event_date": row[6],
                    "category": row[7],
                    "revenue": row[8],
                    "regulations": row[9],
                    "category_name": row[10],
                    "image_ids": row[11],
                    "venue_name": row[12],
                    "city": row[13],
                    "location": row[14],
                }
                for row in events
            ]
            return jsonify(result), 200
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
                    e.organizer_id,
                    e.venue_id,
                    e.event_title,
                    e.event_status,
                    e.description,
                    e.event_date::date AS event_date,
                    TO_CHAR(e.event_date, 'HH24:MI') AS event_time,
                    e.category,
                    e.revenue,
                    e.regulations,
                    e.category_name,
                    e.image_ids,
                    v.venue_name,
                    v.city,
                    v.location
                FROM event  e
                JOIN venue  v  ON v.venue_id = e.venue_id
                WHERE e.event_id = %s;
                """, (event_id,))
            event = cur.fetchone()
        return jsonify({
            "event_id": event[0],
            "organizer_id": event[1],
            "venue_id": event[2],
            "event_title": event[3],
            "event_status": event[4],
            "description": event[5],
            "event_date": event[6],
            "event_time": event[7],
            "category": event[8],
            "revenue": event[9],
            "regulations": event[10],
            "category_name": event[11],
            "image_ids": event[12],
            "venue_name": event[13],
            "city": event[14],
            "location": event[15],
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
    organizer_id = data.get("organizer_id")
    venue_id = data.get("venue_id")
    event_title = data.get("event_title")
    event_status = data.get("event_status")
    description = data.get("description")
    event_date = data.get("event_date")
    category = data.get("category")
    revenue = data.get("revenue", 0.0)
    regulations = data.get("regulations")
    category_name = data.get("category_name")
    image_ids = data.get("image_ids")

    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("""INSERT INTO event (organizer_id, venue_id, event_title, event_status, description, event_date, category, revenue, regulations, category_name, image_ids)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);""",(organizer_id, venue_id, event_title, event_status, description, event_date, category, revenue, regulations, category_name, image_ids,))
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
    organizer_id = data.get("organizer_id")
    venue_id = data.get("venue_id")
    event_title = data.get("event_title")
    event_status = data.get("event_status")
    description = data.get("description")
    event_date = data.get("event_date")
    category = data.get("category")
    revenue = data.get("revenue", 0.0)
    regulations = data.get("regulations")
    category_name = data.get("category_name")
    image_ids = data.get("image_ids")
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("UPDATE event SET organizer_id=%s, venue_id=%s, event_title=%s, event_status=%s, description=%s, event_date=%s, category=%s, revenue=%s, regulations=%s, category_name=%s, image_ids=%s WHERE event_id=%s;",(organizer_id, venue_id, event_title, event_status, description, event_date, category, revenue, regulations, category_name, image_ids, event_id,))
            conn.commit()
        return "Update Successful", 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)