from flask import Blueprint, jsonify, request
from database import db_pool
from flask_jwt_extended import jwt_required, get_jwt_identity
import definitions

bp = Blueprint("events", __name__)
    
@bp.route("/", methods=["GET"])
def get_events():
    search = request.args.get("search", "").strip()
    category = request.args.get("category")
    city = request.args.get("city")
    event_status = request.args.get("event_status")
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    organizer_id  = request.args.get("organizer_id") 

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
    if start_date:
        where_clauses.append("e.event_date >= %s")
        sql_params.append(start_date)
    if end_date:
        where_clauses.append("e.event_date <= %s")
        sql_params.append(end_date)
    if city:
        where_clauses.append("v.city = %s")
        sql_params.append(city)
    if event_status:
        where_clauses.append("e.event_status = %s")
        sql_params.append(event_status)
    if organizer_id:
        where_clauses.append("e.organizer_id = %s")
        sql_params.append(organizer_id)

    where_sql = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""

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
            e.image_ids,
            v.venue_name,
            v.city,
            v.location,
            e.event_time
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
            result = []
            for row in events:
                result.append({
                    "event_id":      row[0],
                    "organizer_id":  row[1],
                    "venue_id":      row[2],
                    "event_title":   row[3],
                    "event_status":  row[4],
                    "description":   row[5],
                    "event_date":    row[6].isoformat(),           
                    "category":      row[7],
                    "revenue":       float(row[8]),                 
                    "regulations":   row[9],
                    "image_ids":     row[10], 
                    "image_urls":    [f"/api/images/{id}" for id in row[10]] if row[10] else [],                    
                    "venue_name":    row[11],
                    "city":          row[12],
                    "location":      row[13],
                    "event_time":    row[14].strftime("%H:%M:%S"),
                })
            return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)
    
@bp.route("/<int:event_id>", methods=["GET"])
def get_event_by_id(event_id):
    conn = db_pool.getconn()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT
                    e.event_id,
                    e.organizer_id,
                    e.venue_id,
                    e.event_title,
                    e.event_status,
                    e.description,
                    e.event_date,
                    e.event_time,
                    e.category,
                    e.revenue,
                    e.regulations,
                    e.image_ids,
                    e.seat_type_map,
                    e.default_ticket_price,
                    e.vip_ticket_price,
                    e.premium_ticket_price,
                    v.venue_name,
                    v.city,
                    v.location
                FROM event AS e
                JOIN venue AS v
                  ON v.venue_id = e.venue_id
                WHERE e.event_id = %s;
            """, (event_id,))
            row = cur.fetchone()
            if not row:
                return jsonify({"error": "Event not found"}), 404

            (
                _eid,
                organizer_id,
                venue_id,
                title,
                status,
                desc,
                date,
                time,
                category,
                revenue,
                regs,
                image_ids,
                seat_type_map,
                default_price,
                vip_price,
                premium_price,
                venue_name,
                city,
                location
            ) = row

        return jsonify({
            "event_id": _eid,
            "organizer_id": organizer_id,
            "venue_id": venue_id,
            "event_title": title,
            "event_status": status,
            "description": desc,
            "event_date": date.isoformat(),
            "event_time": time.strftime("%H:%M:%S"),
            "category": category,
            "revenue": float(revenue),
            "regulations": regs,
            "image_ids": image_ids,
            "image_urls":  [f"/api/images/{id}" for id in image_ids] if image_ids else [],  
            "seat_type_map": seat_type_map,
            "default_ticket_price": float(default_price),
            "vip_ticket_price": float(vip_price),
            "premium_ticket_price": float(premium_price),
            "venue_name": venue_name,
            "city": city,
            "location": location
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        db_pool.putconn(conn)

@bp.route("/", methods=["POST"])
def post_event():
    data = request.get_json()
    organizer_id = data.get("organizer_id")
    venue_id = data.get("venue_id")
    event_title = data.get("event_title")
    event_time = data.get("event_time")
    event_status = data.get("event_status")
    description = data.get("description")
    event_date = data.get("event_date")
    category = data.get("category")
    revenue = data.get("revenue")
    regulations = data.get("regulations")
    default_ticket_price = data.get("default_ticket_price")
    vip_ticket_price = data.get("vip_ticket_price")
    premium_ticket_price = data.get("premium_ticket_price")
    seat_type_map = data.get("seat_type_map")

    conn = db_pool.getconn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO event (
                    organizer_id,
                    venue_id,
                    event_title,
                    event_time,
                    event_status,
                    description,
                    event_date,
                    category,
                    revenue,
                    regulations,
                    default_ticket_price,
                    vip_ticket_price,
                    premium_ticket_price,
                    seat_type_map
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                )
                RETURNING event_id;
                """,
                (
                    organizer_id,
                    venue_id,
                    event_title,
                    event_time,
                    event_status,
                    description,
                    event_date,
                    category,
                    revenue,
                    regulations,
                    default_ticket_price,
                    vip_ticket_price,
                    premium_ticket_price,
                    seat_type_map
                )
            )
            new_event_id = cur.fetchone()
            
            if not new_event_id:
                return jsonify({"error": "Insert failed"}), 500
            
            new_event_id = new_event_id[0]

            cur.execute(
                """
                SELECT venue_id
                FROM event e
                WHERE e.event_id = %s
                """,(new_event_id,)
                )
            
            venue_id = cur.fetchone()

            if not venue_id:
                return jsonify({"error": "Insert failed"}), 500
            
            venue_id = venue_id[0]

            cur.execute(
                """
                SELECT seat_map
                FROM venue v
                WHERE v.venue_id = %s
                """,(venue_id,)
                )
            
            seat_map = cur.fetchone()

            if not seat_map:
                conn.rollback()
                return jsonify({"error": "Insert failed"}), 500

            seat_map = seat_map[0]

            for row in range(len(seat_map)):
                for col in range(len(seat_map[row])):
                    if row >= len(seat_type_map) or col >= len(seat_type_map[row]):
                        return jsonify({"error": "Invalid seat_type_map"}), 500
                    if seat_map[row][col] == 0 and seat_type_map[row][col] != 0:
                        return jsonify({"error": "Invalid seat_type_map"}), 500

            for row in range(len(seat_type_map)):
                for col in range(len(seat_type_map[row])):
                    seat_type = seat_type_map[row][col]

                    if seat_type == definitions.NO_SEAT or seat_type == definitions.OCCUPIED_SEAT:
                        continue
                    
                    price = default_ticket_price

                    if seat_type == definitions.DEFAULT_SEAT:
                        price = default_ticket_price
                    elif seat_type == definitions.VIP_SEAT:
                        price = vip_ticket_price                    
                    elif seat_type == definitions.PREMIUM_SEAT:
                        price = premium_ticket_price

                    cur.execute(
                        "INSERT INTO ticket (attendee_id, payment_id, event_id, ticket_state, ticket_class, price, seat_row, seat_column) VALUES (NULL, NULL, %s, %s, %s, %s, %s, %s) RETURNING ticket_id;",
                        (new_event_id, definitions.TICKET_STATE_EMPTY, seat_type, price, row, col)
                        )
            
            conn.commit()
            return jsonify({"event_id": new_event_id}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db_pool.putconn(conn)


@bp.route("/<int:event_id>", methods=["PUT"])
def put_event_by_id(event_id):
    data = request.get_json()

    new_organizer_id = data.get("organizer_id")
    new_venue_id = data.get("venue_id")
    new_event_title = data.get("event_title")
    new_event_time = data.get("event_time")
    new_event_status = data.get("event_status")
    new_description = data.get("description")
    new_event_date = data.get("event_date")
    new_category = data.get("category")
    new_revenue = data.get("revenue")
    new_regulations = data.get("regulations")
    new_default_ticket_price = data.get("default_ticket_price")
    new_vip_ticket_price = data.get("vip_ticket_price")
    new_premium_ticket_price = data.get("premium_ticket_price")
    new_seat_type_map = data.get("seat_type_map")
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("""
                SELECT
                  organizer_id, venue_id, event_title, event_time,
                  event_status, description, event_date, category,
                  revenue, regulations, image_ids,
                  default_ticket_price, vip_ticket_price, premium_ticket_price,
                  seat_type_map
                FROM event
                WHERE event_id = %s;
            """, (event_id,))
            old = cur.fetchone()
            if not old:
                return jsonify({"error": "Event not found"}), 404

            (
                organizer_id,
                venue_id,
                event_title,
                event_time,
                event_status,
                description,
                event_date,
                category,
                revenue,
                regulations,
                image_ids,
                default_ticket_price,
                vip_ticket_price,
                premium_ticket_price,
                seat_type_map
            ) = old

            if new_organizer_id:
                organizer_id = new_organizer_id
            if new_venue_id:
                venue_id = new_venue_id
            if new_event_title:
                event_title = new_event_title
            if new_event_time:
                event_time = new_event_time
            if new_event_status:
                event_status = new_event_status
            if new_description:
                description = new_description
            if new_event_date:
                event_date = new_event_date
            if new_category:
                category = new_category
            if new_revenue is not None:
                revenue = new_revenue
            if new_regulations is not None:
                regulations = new_regulations
            if new_default_ticket_price is not None:
                default_ticket_price = new_default_ticket_price
            if new_vip_ticket_price is not None:
                vip_ticket_price = new_vip_ticket_price
            if new_premium_ticket_price is not None:
                premium_ticket_price = new_premium_ticket_price
            if new_seat_type_map is not None:
                seat_type_map = new_seat_type_map

            cur.execute(
                """
                UPDATE event SET
                    organizer_id           = %s,
                    venue_id               = %s,
                    event_title            = %s,
                    event_time             = %s,
                    event_status           = %s,
                    description            = %s,
                    event_date             = %s,
                    category               = %s,
                    revenue                = %s,
                    regulations            = %s,
                    default_ticket_price   = %s,
                    vip_ticket_price       = %s,
                    premium_ticket_price   = %s,
                    seat_type_map          = %s
                WHERE event_id = %s;
                """,
                (
                    organizer_id, venue_id, event_title, event_time,
                    event_status, description, event_date, category,
                    revenue, regulations,
                    default_ticket_price, vip_ticket_price, premium_ticket_price,
                    seat_type_map, event_id
                )
            )

            if new_seat_type_map is not None:
                cur.execute("""SELECT seat_map
                             FROM venue WHERE
                             venue_id = %s;""",
                            (venue_id,)
                            )
                
                seat_map = cur.fetchone()
                if not seat_map:
                    raise RuntimeError(f"Venue {venue_id} not found")
                seat_map = seat_map[0]

                for row in range(len(seat_map)):
                    for col in range(len(seat_map[row])):
                        if row >= len(new_seat_type_map) or col >= len(new_seat_type_map[row]):
                            return jsonify({"error": "Invalid new_seat_type_map"}), 500
                        if seat_map[row][col] == 0 and new_seat_type_map[row][col] != 0:
                            return jsonify({"error": "Invalid new_seat_type_map"}), 500

                for row in range(len(new_seat_type_map)):
                    for col in range(len(new_seat_type_map[row])):
                        seat_type = new_seat_type_map[row][col]

                        price = default_ticket_price

                        if seat_type == definitions.DEFAULT_SEAT:
                            price = default_ticket_price
                        elif seat_type == definitions.VIP_SEAT:
                            price = vip_ticket_price                    
                        elif seat_type == definitions.PREMIUM_SEAT:
                            price = premium_ticket_price

                        cur.execute(
                            "UPDATE ticket SET ticket_class = %s, price = %s WHERE event_id = %s AND seat_row = %s AND seat_column = %s;",
                            (seat_type, price, event_id, row, col)
                        )

        conn.commit()
        return jsonify({"event_id": event_id}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)
@bp.route("/<int:event_id>/capacity", methods=["GET"])
def get_event_capacity(event_id):
    conn = db_pool.getconn()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT seat_type_map
                FROM event
                WHERE event_id = %s;
            """, (event_id,))
            row = cur.fetchone()
            if not row:
                return jsonify({"error": "Event not found"}), 404

            seat_map_raw = row[0]
            seat_map = seat_map_raw or []

            capacity = sum(
                1 for row_seats in seat_map for seat in row_seats if seat != 0
            )

            return jsonify({
                "event_id": event_id,
                "capacity": capacity
            }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db_pool.putconn(conn)