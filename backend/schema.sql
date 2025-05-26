CREATE TABLE users (
    user_id     SERIAL PRIMARY KEY,
    
    name        VARCHAR(50) NOT NULL,
    email       VARCHAR(50) NOT NULL UNIQUE,
    password    VARCHAR(60) NOT NULL,
    user_type   INT NOT NULL,
    phone       VARCHAR(15),
    birth_date  DATE
);

CREATE TABLE password_reset (
  id         SERIAL PRIMARY KEY,
  user_id    INT UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  token      VARCHAR(128) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL
);

CREATE TABLE attendee (
    user_id                 INT PRIMARY KEY,
    
    attended_event_count    INT NOT NULL,
    account_balance         DECIMAL(10,2),

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE organizer (
    user_id             INT PRIMARY KEY,

    organization_name   VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE follow (
    user_id             INT,
    organizer_id        INT NOT NULL,
    PRIMARY KEY (user_id, organizer_id), 
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (organizer_id) REFERENCES organizer(user_id)
);

CREATE TABLE venue(
    venue_id			SERIAL PRIMARY KEY,
    capacity			INT NOT NULL, 
    location			VARCHAR(100) NOT NULL,
    venue_name			VARCHAR(100) NOT NULL,
    venue_description	TEXT,
    city                VARCHAR(100) NOT NULL,
    seat_map			INT[][] NOT NULL,
    available     INT NOT NULL
);

CREATE TABLE event (
    event_id 	    SERIAL PRIMARY KEY,
    organizer_id    INT NOT NULL,
    venue_id        INT NOT NULL,

    event_title	    VARCHAR(100) NOT NULL,
    event_time      TIME NOT NULL DEFAULT '00:00:00',
    event_status    INT NOT NULL,
    description	    TEXT,
    event_date	    DATE NOT NULL,
    category 	    VARCHAR(50) NOT NULL,
    revenue	        DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    regulations	    TEXT,
    image_ids       INT[],
    seat_type_map   INT[][] NOT NULL,
    default_ticket_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    vip_ticket_price     DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    premium_ticket_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    
    FOREIGN KEY (organizer_id) REFERENCES organizer(user_id),
    FOREIGN KEY (venue_id) REFERENCES venue(venue_id)
);

CREATE TABLE report (
    report_id               SERIAL PRIMARY KEY,
  
    report_name    VARCHAR(100) NOT NULL DEFAULT 'generic_report',
    generated_at   TIMESTAMP WITH TIME ZONE DEFAULT now(),
    payload        JSONB
);

CREATE TABLE daily_revenue (
  rev_date    DATE        PRIMARY KEY,
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00
);

CREATE TABLE comment(
    comment_id      SERIAL PRIMARY KEY,
    event_id        INT NOT NULL,
    attendee_id     INT NOT NULL,

    rating          INT NOT NULL, 
    comment_title	VARCHAR(100) NOT NULL,
    comment_text	TEXT NOT NULL,
    comment_date	DATE NOT NULL,

    FOREIGN KEY (attendee_id) REFERENCES attendee(user_id),
    FOREIGN KEY (event_id) REFERENCES event(event_id)
);

CREATE TABLE payment(
    payment_id			SERIAL PRIMARY KEY,
    attendee_id         INT NOT NULL,

    payment_amount		DECIMAL(10,2) NOT NULL, 
    payment_method		VARCHAR(50),
    payment_date		DATE,
    FOREIGN KEY (attendee_id) REFERENCES attendee(user_id)
);

CREATE TABLE ticket (
    ticket_id       SERIAL PRIMARY KEY,
    attendee_id     INT,
    payment_id      INT,
    event_id        INT NOT NULL,

    ticket_state    INT NOT NULL,
    ticket_class    INT NOT NULL,
    price           INT NOT NULL,
    seat_row        INT NOT NULL,
    seat_column     INT NOT NULL,

    UNIQUE (event_id, seat_row, seat_column),

    FOREIGN KEY (attendee_id) REFERENCES attendee(user_id),
    FOREIGN KEY (event_id) REFERENCES event(event_id),
    FOREIGN KEY (payment_id) REFERENCES payment(payment_id)
);

CREATE TABLE ticket_guest (
    guest_id            SERIAL PRIMARY KEY,
    ticket_id           INT NOT NULL,

    guest_name          VARCHAR(100) NOT NULL,
    guest_mail          VARCHAR(100) NOT NULL,
    guest_phone         VARCHAR(20) NOT NULL,
    guest_birth_date    DATE NOT NULL,

    FOREIGN KEY (ticket_id) REFERENCES ticket(ticket_id)
);

CREATE OR REPLACE FUNCTION auto_create_attendee()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_type = 0 THEN
    INSERT INTO attendee(user_id, attended_event_count, account_balance)
    VALUES (NEW.user_id, 0, 0.00);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_create_attendee_trigger
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION auto_create_attendee();

CREATE OR REPLACE FUNCTION update_daily_revenue()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO daily_revenue (rev_date, total_amount)
  VALUES (NEW.payment_date, NEW.payment_amount)
  ON CONFLICT (rev_date) DO
    UPDATE SET total_amount = daily_revenue.total_amount + NEW.payment_amount;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_daily_revenue_trigger
  AFTER INSERT ON payment
  FOR EACH ROW
  EXECUTE FUNCTION update_daily_revenue();

CREATE OR REPLACE FUNCTION log_ticket_sale()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO report (
    report_name,
    generated_at,
    payload
  )
  VALUES (
    'ticket_sale',
    now(),
    jsonb_build_object(
      'payment_id', NEW.payment_id,
      'amount',    NEW.payment_amount,
      'date',      NEW.payment_date
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_ticket_sale_trigger
  AFTER INSERT ON payment
  FOR EACH ROW
  EXECUTE FUNCTION log_ticket_sale();

CREATE OR REPLACE VIEW user_view AS
SELECT
  u.user_id,
  u.name,
  u.email,
  u.user_type,
  CASE
    WHEN u.user_type = 0 THEN 'attendee'
    WHEN u.user_type = 1 THEN 'organizer'
    WHEN u.user_type = 2 THEN 'admin'
    ELSE 'unknown'
  END AS user_role,
  a.attended_event_count,
  a.account_balance,
  o.organization_name,
  u.phone,
  u.birth_date
FROM users u
LEFT JOIN attendee a ON a.user_id = u.user_id
LEFT JOIN organizer o ON o.user_id = u.user_id;

INSERT INTO users (name, email, password, user_type, phone, birth_date) VALUES
('User user', 'user@user.com', '$2b$12$KKprei.9FfMVomfUWlYYAu8icc7TS58KesyN11GQpI.2eYteMWUXC', 0, '555-1234', '1995-06-15'),
('Organizer Organizer', 'org@org.com', '$2b$12$Srau6Ny7nGQQQ1tHeiBfUOsuinZZOdyplF2c831mVqlUgFqcetwmq', 1, '555-5678', '2000-06-15'),
('Admin admin', 'admin@admin.com', '$2b$12$xy.NXj5K8QAeYdgiGhGmW.9DKlsHIw7jf6PU8JfhSEwpCpp4wPA9K', 2, '555-8765', '2015-06-15');

INSERT INTO organizer (user_id, organization_name) VALUES
  (2,  'Smith Corp.');