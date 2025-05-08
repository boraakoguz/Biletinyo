from flask import Blueprint, jsonify, request
from database import db_pool

bp = Blueprint("tickets", __name__)

@bp.route("/", methods=["GET"])
def get_tickets():
    attendee_id=request.args.get("attendee_id")
    event_id=request.args.get("event_id")
    ticket_state=request.args.get("ticket_state")
    ticket_class=request.args.get("ticket_class")
    
    clauses=[]
    params=[]

    if attendee_id:
        clauses.append("attendee_id=%s")
        params.append(attendee_id)
    if event_id:
        clauses.append("event_id=%s")
        params.append(event_id)
    if ticket_state:
        clauses.append("ticket_state=%s")
        params.append(ticket_state)
    if ticket_class:
        clauses.append("ticket_class=%s")
        params.append(ticket_class)
    where=""
    if clauses:
        where="WHERE " + " AND ".join(clauses)
    
    try:
        conn=db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute(f"""
                SELECT ticket_id, 
                        attendee_id, 
                        payment_id, 
                        event_id, 
                        ticket_state, 
                        ticket_class, 
                        price, 
                        seat_row, 
                        seat_column
                FROM ticket
                {where};
            """, params)
            tickets=cur.fetchall()

            results = []
            for row in tickets:
                ticket_id, attendee_id, payment_id, event_id, \
                ticket_state, ticket_class, price, \
                seat_row, seat_column = row
                cur.execute(
                    """
                    SELECT guest_name,
                           guest_mail,
                           guest_phone,
                           guest_birth_date
                    FROM ticket_guest
                    WHERE ticket_id = %s;
                    """,
                    (ticket_id,)
                )
                guests = [
                    {
                      "guest_name": guest[0],
                      "guest_mail": guest[1],
                      "guest_phone": guest[2],
                      "guest_birth_date": guest[3]
                    }
                    for guest in cur.fetchall()
                ]

                results.append({
                    "ticket_id": ticket_id,
                    "attendee_id": attendee_id,
                    "payment_id": payment_id,
                    "event_id": event_id,
                    "ticket_state": ticket_state,
                    "ticket_class": ticket_class,
                    "price": price,
                    "seat_row": seat_row,
                    "seat_column": seat_column,
                    "ticket_guest": guests
                })
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)

@bp.route("/<int:ticket_id>", methods=["GET"])
def get_ticket_by_id(ticket_id):
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("""
                SELECT ticket_id, 
                        attendee_id, 
                        payment_id, 
                        event_id, 
                        ticket_state, 
                        ticket_class, 
                        price, 
                        seat_row, 
                        seat_column
                FROM ticket
                WHERE ticket_id=%s;
            """, (ticket_id,))
            event = cur.fetchone()
            columns = [
                "ticket_id", "attendee_id", "payment_id",
                "event_id", "ticket_state", "ticket_class",
                "price", "seat_row", "seat_column"
            ]
            ticket = dict(zip(columns, event))
            cur.execute(
                    """
                    SELECT guest_name,
                           guest_mail,
                           guest_phone,
                           guest_birth_date
                    FROM ticket_guest
                    WHERE ticket_id = %s;
                    """,
                    (ticket_id,)
                )
            guests = cur.fetchall()
            ticket["ticket_guest"] = [
                {
                    "guest_name": guest[0],
                    "guest_mail": guest[1],
                    "guest_phone": guest[2],
                    "guest_birth_date": guest[3]
                }
                for guest in guests
            ]
        return jsonify(ticket), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)

@bp.route("/<int:ticket_id>", methods=["DELETE"])
def delete_user_by_id(ticket_id):
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("DELETE FROM ticket_guest WHERE ticket_id=%s;", (ticket_id,))
            cur.execute("DELETE FROM ticket WHERE ticket_id=%s;", (ticket_id,))
            conn.commit()
        return "Deletion Successful", 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)

@bp.route("/", methods=["POST"])
def post_ticket():
    data=request.get_json()
    attendee_id=data.get("attendee_id")
    payment_id=data.get("payment_id")
    event_id=data.get("event_id")
    ticket_state=data.get("ticket_state")
    ticket_class=data.get("ticket_class")
    price=data.get("price")
    seat_row=data.get("seat_row")
    seat_column=data.get("seat_column")
    ticket_guests=data.get("ticket_guest", [])
    try:
        conn=db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO ticket (attendee_id, payment_id, event_id, ticket_state, ticket_class, price, seat_row, seat_column) VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING ticket_id;",
                (attendee_id, payment_id, event_id, ticket_state, ticket_class, price, seat_row, seat_column)
            )
            ticket_id = cur.fetchone()[0]
            for guest in ticket_guests:
                cur.execute(
                    "INSERT INTO ticket_guest (ticket_id, guest_name, guest_mail, guest_phone, guest_birth_date) VALUES (%s, %s, %s, %s, %s);",
                    (ticket_id, guest["guest_name"], guest.get("guest_mail"), guest.get("guest_phone"), guest.get("guest_birth_date"))
                )
            conn.commit()
        return "Insertion Successful", 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)

@bp.route("/<int:ticket_id>", methods=["PUT"])
def put_ticket(ticket_id):
    data = request.get_json()
    attendee_id   = data.get("attendee_id")
    payment_id    = data.get("payment_id")
    event_id      = data.get("event_id")
    ticket_state  = data.get("ticket_state")
    ticket_class  = data.get("ticket_class")
    price         = data.get("price")
    seat_row      = data.get("seat_row")
    seat_column   = data.get("seat_column")
    ticket_guests = data.get("ticket_guest", [])
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute(
                """UPDATE ticket
                   SET attendee_id=%s,
                       payment_id=%s,
                       event_id=%s,
                       ticket_state=%s,
                       ticket_class=%s,
                       price=%s,
                       seat_row=%s,
                       seat_column=%s
                    WHERE ticket_id=%s;""",
                (attendee_id, payment_id, event_id,
                 ticket_state, ticket_class, price,
                 seat_row, seat_column,
                 ticket_id,))
            cur.execute(
                "DELETE FROM ticket_guest WHERE ticket_id = %s;",
                (ticket_id,))
            for guest in ticket_guests:
                cur.execute(
                    """INSERT INTO ticket_guest
                      (ticket_id, guest_name, guest_mail, guest_phone, guest_birth_date)
                    VALUES (%s, %s, %s, %s, %s);""",
                    (
                        ticket_id,
                        guest.get("guest_name"),
                        guest.get("guest_mail"),
                        guest.get("guest_phone"),
                        guest.get("guest_birth_date"),
                    )
                )
            conn.commit()
        return "Update Successful", 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)
