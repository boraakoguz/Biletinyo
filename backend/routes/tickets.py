from flask import Blueprint, jsonify, request
from database import db_pool

bp = Blueprint("tickets", __name__)

@bp.route("/", methods=["GET"])
def get_tickets():
    user_id=request.args.get("user_id")
    event_id=request.args.get("event_id")
    ticket_no=request.args.get("ticket_no")
    
    clauses=[]
    params=[]

    if user_id:
        clauses.append("user_id=%s")
        params.append(user_id)
    if event_id:
        clauses.append("event_id=%s")
        params.append(event_id)
    if ticket_no:
        clauses.append("ticket_no=%s")
        params.append(ticket_no)
    where=""
    if clauses:
        where="WHERE " + " AND ".join(clauses)
    
    try:
        conn=db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute(f"""
                SELECT user_id, event_id, ticket_no, category_name
                FROM ticket
                {where};
            """, params)
            tickets=cur.fetchall()

            results=[]
            for u_id, e_id, t_no, cat in tickets:
                cur.execute(
                    "SELECT venue_id, seat_row, seat_column "
                    "FROM ticket_seats "
                    "WHERE user_id=%s AND event_id=%s AND ticket_no=%s;",
                    (u_id, e_id, t_no)
                )
                seat_rows=cur.fetchall()

                cur.execute(
                    "SELECT guest_no, guest_name, guest_mail, guest_phone, guest_age "
                    "FROM ticket_guest "
                    "WHERE user_id=%s AND event_id=%s AND ticket_no=%s;",
                    (u_id, e_id, t_no)
                )
                guest_rows=cur.fetchall()

                results.append({
                    "user_id": u_id,
                    "event_id": e_id,
                    "ticket_no": t_no,
                    "category_name": cat,
                    "seats": [
                        {"venue_id": venue, "seat_row": row, "seat_column": column}
                        for venue, row, column in seat_rows
                    ],
                    "guests": [
                        {"guest_no": guest_no, "guest_name": guest_name, "guest_mail": guest_mail, "guest_phone": guest_phone, "guest_age": guest_age}
                        for guest_no, guest_name, guest_mail, guest_phone, guest_age in guest_rows
                    ]
                })
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)

@bp.route("/<int:user_id>/<int:event_id>/<int:ticket_no>", methods=["DELETE"])
def delete_user_by_id(user_id, event_id, ticket_no):
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("DELETE FROM ticket_seats WHERE user_id=%s AND event_id=%s AND ticket_no=%s;", (user_id, event_id, ticket_no,))
            cur.execute("DELETE FROM ticket_guest WHERE user_id=%s AND event_id=%s AND ticket_no=%s;", (user_id, event_id, ticket_no,))
            cur.execute("DELETE FROM ticket WHERE user_id=%s AND event_id=%s AND ticket_no=%s;", (user_id, event_id, ticket_no,))
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
    user_id=data.get("user_id")
    event_id=data.get("event_id")
    ticket_no=data.get("ticket_no")
    category_name=data.get("category_name")
    seats=data.get("seats", [])
    guests=data.get("guests", [])

    try:
        conn=db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO ticket (user_id, event_id, ticket_no, category_name) VALUES (%s, %s, %s, %s);",
                (user_id, event_id, ticket_no, category_name)
            )
            for seat in seats:
                cur.execute(
                    "INSERT INTO ticket_seats (user_id, event_id, ticket_no, venue_id, seat_row, seat_column) VALUES (%s, %s, %s, %s, %s, %s);",
                    (user_id, event_id, ticket_no, seat["venue_id"], seat["seat_row"], seat["seat_column"])
                )
            for guest in guests:
                cur.execute(
                    "INSERT INTO ticket_guest (user_id, event_id, ticket_no, guest_no, guest_name, guest_mail, guest_phone, guest_age) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);",
                    (user_id, event_id, ticket_no, guest["guest_no"], guest.get("guest_name"), guest.get("guest_mail"), guest.get("guest_phone"), guest.get("guest_age"))
                )
            conn.commit()
        return "Insertion Successful", 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)
