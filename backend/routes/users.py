from flask import Blueprint, jsonify, request
from database import db_pool

bp = Blueprint("users", __name__)

@bp.route("/", methods=["GET"])
def get_users():
    search=request.args.get("search", "").strip()
    user_type=request.args.get("user_type")
    filters = []
    params  = []
    if user_type:
        filters.append("u.user_type = %s")
        params.append(user_type)
    if search:
        filters.append(
            "(u.name ILIKE %s OR o.organization_name ILIKE %s)"
        )
        like = f"%{search}%"
        params.extend([like, like])
    where = ""
    if filters:
        where = "WHERE " + " AND ".join(filters)
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute(f"""SELECT u.user_id, u.name, u.email, u.user_type, u.phone, u.birth_date, o.organization_name FROM users u LEFT JOIN organizer o ON u.user_id = o.user_id {where};""", params)
            users = cur.fetchall()
            result = []
            for u_id, u_name, u_email, u_type, u_phone, u_birth, o_organization in users:
                json = {
                    "id":         u_id,
                    "name":       u_name,
                    "email":      u_email,
                    "user_type":  u_type,
                    "phone":      u_phone,
                    "birth_date": u_birth.isoformat() if u_birth else None,
                }
                if u_type == 1 and o_organization:
                    json["organization_name"] = o_organization
                result.append(json)
            return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)

@bp.route("/<int:user_id>", methods=["GET"])
def get_user_by_id(user_id):
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT u.user_id, u.name, u.email, u.user_type, u.phone, u.birth_date,
                       a.attended_event_number, a.account_balance,
                       o.organization_name
                FROM users u
                LEFT JOIN attendee a ON u.user_id = a.user_id
                LEFT JOIN organizer o ON u.user_id = o.user_id
                WHERE u.user_id=%s;
                """,
                (user_id,),
            )
            user = cur.fetchone()
        if not user:
            return jsonify({"error": "User not found"}), 404
        result = {
            "id": user[0],
            "name": user[1],
            "email": user[2],
            "user_type": user[3],
            "phone": user[4],
            "birth_date": user[5].isoformat() if user[5] else None,
        }
        if user[6] is not None:
            result["attendee"] = {
                "attended_event_number": user[6],
                "account_balance": float(user[7]) if user[7] is not None else None,
            }
        if user[8] is not None:
            result["organizer"] = {"organization_name": user[8]}
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)

@bp.route("/<int:user_id>", methods=["DELETE"])
def delete_user_by_id(user_id):
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute("DELETE FROM attendee WHERE user_id=%s;", (user_id,))
            cur.execute("DELETE FROM organizer WHERE user_id=%s;", (user_id,))
            cur.execute("DELETE FROM users WHERE user_id=%s;", (user_id,))
            conn.commit()
        return "Deletion Successful", 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)

@bp.route("/", methods=["POST"])
def post_user():
    data=request.get_json()
    name=data.get("name")
    email=data.get("email")
    password=data.get("password")
    user_type=data.get("user_type")
    phone=data.get("phone")
    birth_date=data.get("birth_date")
    attended_event_number=data.get("attended_event_number")
    account_balance=data.get("account_balance")
    organization_name=data.get("organization_name")
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO users (name, email, password, user_type, phone, birth_date)"
                "VALUES (%s, %s, %s, %s, %s, %s) RETURNING user_id;",
                (name, email, password, user_type, phone, birth_date)
            )
            user_id = cur.fetchone()[0]
            if user_type == 0 and attended_event_number is not None and account_balance is not None:
                cur.execute(
                    "INSERT INTO attendee (user_id, attended_event_number, account_balance)"
                    "VALUES (%s, %s, %s);",
                    (user_id, attended_event_number, account_balance)
                )
            elif user_type == 1 and organization_name:
                cur.execute(
                    "INSERT INTO organizer (user_id, organization_name)"
                    "VALUES (%s, %s);",
                    (user_id, organization_name)
                )
            conn.commit()
        return "Insertion Successful", 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)

@bp.route("/<int:user_id>", methods=["PUT"])
def put_user_by_id(user_id):
    data=request.get_json()
    name=data.get("name")
    email=data.get("email")
    password=data.get("password")
    user_type=data.get("user_type")
    phone=data.get("phone")
    birth_date=data.get("birth_date")
    attended_event_number=data.get("attended_event_number")
    account_balance=data.get("account_balance")
    organization_name=data.get("organization_name")
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE users SET name=%s, email=%s, password=%s, user_type=%s, phone=%s, birth_date=%s"
                "WHERE user_id=%s;",
                (name, email, password, user_type, phone, birth_date, user_id)
            )
            cur.execute("DELETE FROM attendee WHERE user_id=%s;", (user_id,))
            cur.execute("DELETE FROM organizer WHERE user_id=%s;", (user_id,))
            if user_type == 0 and attended_event_number is not None and account_balance is not None:
                cur.execute(
                    "INSERT INTO attendee (user_id, attended_event_number, account_balance)"
                    "VALUES (%s, %s, %s);",
                    (user_id, attended_event_number, account_balance)
                )
            elif user_type == 1 and organization_name:
                cur.execute(
                    "INSERT INTO organizer (user_id, organization_name)"
                    "VALUES (%s, %s);",
                    (user_id, organization_name)
                )
            conn.commit()
        return "Update Successful", 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)
