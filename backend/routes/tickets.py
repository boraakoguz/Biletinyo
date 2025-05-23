from flask import Blueprint, jsonify, request, send_file
from database import db_pool
from flask_jwt_extended import jwt_required, get_jwt_identity
import qrcode
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
)
from reportlab.lib.utils import ImageReader
import definitions
import datetime


bp = Blueprint("tickets", __name__)

@bp.route("/", methods=["GET"])
def get_tickets():
    attendee_id = request.args.get("attendee_id")
    event_id = request.args.get("event_id")
    ticket_state = request.args.get("ticket_state")
    ticket_class = request.args.get("ticket_class")
    seat_pairs = request.args.getlist("seats")

    clauses = []
    params = []

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

    seat_conditions = []
    for seat in seat_pairs:
        try:
            row, col = map(int, seat.split("-"))
            seat_conditions.append("(seat_row=%s AND seat_column=%s)")
            params.extend([row, col])
        except ValueError:
            continue

    if seat_conditions:
        clauses.append(f"({' OR '.join(seat_conditions)})")

    where = ""
    if clauses:
        where = "WHERE " + " AND ".join(clauses)

    try:
        conn = db_pool.getconn()
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
            tickets = cur.fetchall()

            results = []
            for row in tickets:
                ticket_id, attendee_id, payment_id, event_id, \
                ticket_state, ticket_class, price, \
                seat_row, seat_column = row
                cur.execute("""
                    SELECT guest_name,
                           guest_mail,
                           guest_phone,
                           guest_birth_date
                    FROM ticket_guest
                    WHERE ticket_id = %s;
                """, (ticket_id,))
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


def get_ticket(ticket_id):
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
            return ticket
    except:
        return None
    finally:
        if conn:
            db_pool.putconn(conn)

@bp.route("/<int:ticket_id>", methods=["GET"])
def get_ticket_by_id(ticket_id):
    try:
        ticket = get_ticket(ticket_id)
        if not ticket:
            return jsonify({"error": "Ticket not found"}), 404
        return jsonify(ticket), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route("/<int:ticket_id>", methods=["PUT"])
def put_ticket(ticket_id):
    data = request.get_json()
    conn = None
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("""
                        SELECT ticket_state, ticket_class, price
                        FROM ticket
                        WHERE ticket_id = %s
                        """,(ticket_id,)
                        )

            old_ticket = cur.fetchone()

            (ticket_state, ticket_class, price) = old_ticket

            ticket_state  = data.get("ticket_state", ticket_state)
            ticket_class  = data.get("ticket_class", ticket_class)
            price         = data.get("price", price)

            cur.execute(
                """UPDATE ticket
                   SET 
                       ticket_state=%s,
                       ticket_class=%s,
                       price=%s
                    WHERE ticket_id=%s;""",
                (ticket_state, ticket_class, price, ticket_id)
                )
            
            conn.commit()
        return "Update Successful", 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)
        

@bp.route("/<int:ticket_id>/sell", methods=["POST"])
def sell_ticket(ticket_id):
    data = request.get_json(force=True)

    required = ["user_id", "payment_method", "guest_info"]
    for field in required:
        if field not in data or data[field] is None:
            return jsonify({
                "error": "Missing required field(s)",
                "fields": field
            }), 400

    guest_required = ["guest_name", "guest_mail", "guest_phone", "guest_birth_date"]
    guest_info = data["guest_info"]
    for field in guest_required:
        if field not in guest_info or guest_info[field] is None:
            return jsonify({
                "error": "Missing required field(s)",
                "fields": field
            }), 400
    
    payment_method = data.get("payment_method")
    user_id = data.get("user_id")
    guest_name = guest_info.get("guest_name")
    guest_mail = guest_info.get("guest_mail")
    guest_phone = guest_info.get("guest_phone")
    guest_birth_date = guest_info.get("guest_birth_date")

    current_date = datetime.date.today()

    if payment_method not in (definitions.PAYMENT_CREDIT_CARD, definitions.PAYMENT_WALLET):
        return jsonify({"error": "Wrong payment method"}), 400
    
    conn = None
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("""
                        SELECT account_balance, attended_event_count
                        FROM attendee
                        WHERE user_id = %s
                        """, (user_id, ))

            attendee = cur.fetchone()

            if not attendee:
                return jsonify({"error": "Wrong attendee_id"}), 400

            account_balance, attended_event_count = attendee

            cur.execute("""
                        SELECT ticket_state, price, event_id, seat_row, seat_column
                        FROM ticket
                        WHERE ticket_id = %s
                        """,(ticket_id,)
                        )
            
            ticket = cur.fetchone()
            if not ticket:
                return jsonify({"error": "No matching ticket"}), 500
            
            ticket_state, price, event_id, seat_row, seat_column = ticket

            if ticket_state == definitions.TICKET_STATE_SOLD:
                return jsonify({"error": "Ticket already sold"}), 500
            
            cur.execute("""
                        SELECT seat_type_map, revenue
                        FROM event
                        WHERE event_id = %s
                        """,(event_id, ))
            
            event = cur.fetchone()

            if not event:
                return jsonify({"error": "No matching event"}), 500
            
            seat_type_map, revenue = event

            if payment_method == definitions.PAYMENT_WALLET:
                if price > account_balance:
                    return jsonify({"error": "Insufficient credit in Wallet"}), 400
                account_balance -= price

            attended_event_count += 1
            revenue += price
            cur.execute("""
                        UPDATE attendee
                        SET account_balance = %s, attended_event_count = %s
                        WHERE user_id = %s;
                        """,
                    (account_balance, attended_event_count, user_id)
                )

            cur.execute("""
                        INSERT INTO payment (
                            attendee_id,
                            payment_amount,
                            payment_method,
                            payment_date
                        )
                        VALUES (%s, %s, %s, %s)
                        RETURNING payment_id;
                        """,
                        (user_id, price, payment_method, current_date)
                        )
            
            new_payment_id = cur.fetchone()[0]

            cur.execute("""
                        UPDATE ticket
                        SET payment_id   = %s,
                            ticket_state = %s,
                            attendee_id  = %s
                        WHERE ticket_id  = %s;""",
                        (new_payment_id, user_id, definitions.TICKET_STATE_SOLD, ticket_id)
                        )

            cur.execute("""
                        INSERT INTO ticket_guest (
                            ticket_id,
                            guest_name,
                            guest_mail,
                            guest_phone,
                            guest_birth_date
                        )
                        VALUES (%s, %s, %s, %s, %s);
                        """,
                        (ticket_id, guest_name, guest_mail, guest_phone, guest_birth_date)
                        )

            seat_type_map[seat_row][seat_column] = definitions.OCCUPIED_SEAT

            cur.execute(
                "UPDATE event SET seat_type_map = %s WHERE event_id = %s;",
                (seat_type_map, event_id)
            )
            cur.execute(
                "UPDATE event SET revenue = %s WHERE event_id = %s;",
                (revenue, event_id)
            )

            conn.commit()     
        return jsonify({
                "ticket_id": ticket_id,
                "payment_id": new_payment_id
                }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)

def make_qr_from_str(data):
    qr = qrcode.make(data)
    buffer = BytesIO()
    qr.save(buffer, format='PNG')
    buffer.seek(0)
    return buffer

def fetch_event(event_id):
    conn = db_pool.getconn()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT 
                    e.event_title,
                    e.event_date::date,
                    TO_CHAR(e.event_date, 'HH24:MI') AS event_time,
                    v.venue_name,
                    v.city,
                    v.location
                FROM event e
                JOIN venue v ON v.venue_id = e.venue_id
                WHERE e.event_id = %s;
            """, (event_id,))
            row = cur.fetchone()
            if not row:
                return None
            keys = ['event_title','event_date','event_time','venue_name','city','location']
            return dict(zip(keys, row))
    finally:
        db_pool.putconn(conn)

@bp.route("/<int:ticket_id>/pdf", methods=["GET"])
def pdf_ticket(ticket_id):
    ticket = get_ticket(ticket_id)
    if not ticket:
        return jsonify({"error": "Ticket not found"}), 404

    event = fetch_event(ticket['event_id'])
    if not event:
        return jsonify({"error": "Event not found"}), 404

    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=20*mm, leftMargin=20*mm,
        topMargin=20*mm, bottomMargin=20*mm
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'Title', parent=styles['Heading1'],
        fontSize=20, alignment=1,
        textColor=colors.HexColor('#333333')
    )
    label_style = ParagraphStyle(
        'Label', parent=styles['Normal'],
        fontSize=12, textColor=colors.HexColor('#555555'),
        spaceAfter=4
    )

    flowables = []

    flowables.append(Paragraph(f"{event['event_title']}", title_style))
    flowables.append(Spacer(1, 4*mm))

    flowables.append(Paragraph(
        f"<b>Date:</b> {event['event_date'].strftime('%Y-%m-%d')} &nbsp;&nbsp; "
        f"<b>Time:</b> {event['event_time']}",
        label_style
    ))
    flowables.append(Paragraph(
        f"<b>Venue:</b> {event['venue_name']} — {event['city']}, {event['location']}",
        label_style
    ))
    flowables.append(Spacer(1, 8*mm))

    flowables.append(Paragraph(f"Ticket #{ticket['ticket_id']}", styles['Heading2']))
    flowables.append(Spacer(1, 4*mm))
    flowables.append(Paragraph(
        f"<b>Class:</b> {ticket['ticket_class']} &nbsp;&nbsp; "
        f"<b>Price:</b> ${ticket['price']} &nbsp;&nbsp; "
        f"<b>Seat:</b> Row {ticket['seat_row']}, Col {ticket['seat_column']}",
        label_style
    ))
    flowables.append(Spacer(1, 6*mm))

    data = [['Name','Email','Phone','Birth Date']]
    for g in ticket['ticket_guest']:
        data.append([
            g['guest_name'],
            g['guest_mail'],
            g['guest_phone'],
            g['guest_birth_date'].strftime('%Y-%m-%d')
        ])
    tbl = Table(data, colWidths=[50*mm,60*mm,40*mm,30*mm])
    tbl.setStyle(TableStyle([
        ('BACKGROUND',(0,0),(-1,0),colors.HexColor('#f5f5f5')),
        ('FONTNAME',(0,0),(-1,0),'Helvetica-Bold'),
        ('ALIGN',(0,0),(-1,-1),'LEFT'),
        ('GRID',(0,0),(-1,-1),0.5,colors.HexColor('#dddddd')),
    ]))
    flowables.append(tbl)
    flowables.append(Spacer(1,12*mm))

    qr_buf = make_qr_from_str(f"https://localhost:8080/api/tickets/{ticket_id}")
    qr_buf.seek(0)
    qr = Image(qr_buf, 35*mm, 35*mm)
    qr.hAlign = 'RIGHT'
    flowables.append(qr)

    doc.build(flowables)
    buffer.seek(0)
    return send_file(
        buffer,
        mimetype='application/pdf',
        as_attachment=True,
        download_name=f"ticket_{ticket_id}.pdf"
    )
