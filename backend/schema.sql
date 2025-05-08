CREATE TABLE users (
    user_id     SERIAL PRIMARY KEY,
    
    name        VARCHAR(50) NOT NULL,
    email       VARCHAR(50) NOT NULL UNIQUE,
    password    VARCHAR(60) NOT NULL,
    user_type   INT NOT NULL,
    phone       VARCHAR(15),
    birth_date  DATE
);

CREATE TABLE attendee (
    user_id                 INT PRIMARY KEY,
    
    attended_event_count    INT NOT NULL,
    account_balance         DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE organizer (
    user_id             INT PRIMARY KEY,

    organization_name   VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE venue(
    venue_id			SERIAL PRIMARY KEY,

    capacity			INT NOT NULL, 
    location			VARCHAR(100) NOT NULL,
    venue_name			VARCHAR(100) NOT NULL,
    venue_description	TEXT,
    city                VARCHAR(100) NOT NULL,
    seat_map			INT[][] NOT NULL
);

CREATE TABLE event (
    event_id 	    SERIAL PRIMARY KEY,
    organizer_id    INT NOT NULL,
    venue_id        INT NOT NULL,

    event_title	    VARCHAR(100) NOT NULL UNIQUE,
    event_status    INT NOT NULL,
    description	    TEXT,
    event_date	    DATE NOT NULL,
    category 	    VARCHAR(50) NOT NULL,
    revenue	        DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    regulations	    TEXT,
    category_name   INT NOT NULL,
    image_ids       INT[],
    FOREIGN KEY (organizer_id) REFERENCES organizer(user_id),
    FOREIGN KEY (venue_id) REFERENCES venue(venue_id)
);


CREATE TABLE report (
    report_id               SERIAL PRIMARY KEY,
    user_id                 INT NOT NULL,
    most_popular_event_id   INT,

    report_date             DATE,
    revenue_trend_data      INT[],
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (most_popular_event_id) REFERENCES event(event_id)
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
    payment_status		VARCHAR(50) NOT NULL,
    payment_date		DATE,
    FOREIGN KEY (attendee_id) REFERENCES attendee(user_id)
);

CREATE TABLE ticket (
    ticket_id       SERIAL PRIMARY KEY,
    attendee_id     INT NOT NULL,
    payment_id      INT,
    event_id        INT NOT NULL,

    ticket_state    INT NOT NULL,
    ticket_class    INT NOT NULL,
    price           INT NOT NULL,
    seat_row             INT NOT NULL,
    seat_column         INT NOT NULL,

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

INSERT INTO users (name, email, password, user_type, phone, birth_date) VALUES
('User johnson', 'user@user.com', '$2b$12$KKprei.9FfMVomfUWlYYAu8icc7TS58KesyN11GQpI.2eYteMWUXC', 0, '555-1234', '1995-06-15'),
('Organizer Smith', 'org@org.com', '$2b$12$mGapQFzDalequVp3S7GZpOp8NZbghmNmlMsD4wusmo76lKQQjI4CG', 1, '555-5678', '2000-06-15'),
('Ege Babs', 'ege@gmail.com', '$2b$12$xy.NXj5K8QAeYdgiGhGmW.9DKlsHIw7jf6PU8JfhSEwpCpp4wPA9K', 0, '555-8765', '2015-06-15');

INSERT INTO venue (capacity, location, venue_name, venue_description, city, seat_map)
VALUES
  (100, 'Atakule, Ankara', 'Atakule Hall', 'Central conference hall', 'Ankara',
   '{{1,1,1},{1,1,1},{1,1,1}}'),
  (200, 'Konya Road, Konya', 'Fairgrounds', 'Open-air fairgrounds', 'Konya',
   '{{1,1},{1,1}}');

INSERT INTO organizer (user_id, organization_name)
VALUES
  (2, 'Smith Corp.');
  
INSERT INTO event (
  organizer_id, venue_id, event_title, event_status, description,
  event_date, category, revenue, regulations, category_name, image_ids
) VALUES
  (2, 1, 'Spring Music Festival',    1, 'A festival featuring local bands.',
   '2025-04-20', 'Music', 15000.00, 'No outside food allowed.',       1, '{101,102}'),
  (2, 2, 'Tech Expo 2025',            0, 'Annual technology expo showcasing startups.',
   '2025-06-15', 'Technology',    0.00,   'Tickets non-refundable.',    2, '{201,202,203}');

INSERT INTO attendee (user_id, attended_event_count, account_balance)
VALUES
  (1, 1, 100.50),  
  (3, 0,  50.00); 

INSERT INTO payment (attendee_id, payment_amount, payment_method, payment_status, payment_date)
VALUES
  (1, 150.00, 'Credit Card', 'Completed', '2025-04-18'),
  (3,  75.00, 'PayPal',      'Completed', '2025-06-14');

INSERT INTO ticket (
  attendee_id, payment_id, event_id,
  ticket_state, ticket_class, price, seat_row, seat_column
) VALUES
  (1, 1, 1, 1, 2, 150, 5, 10),
  (3, 2, 2, 0, 1,  75, 1,  1);

INSERT INTO comment (
  event_id, attendee_id, rating, comment_title, comment_text, comment_date
) VALUES
  (1, 1, 5, 'Amazing show',    'Loved every performance!', '2025-04-21'),
  (2, 3, 4, 'Great exhibits',  'Really enjoyed the demos.', '2025-06-16');

INSERT INTO ticket_guest (
  ticket_id, guest_name, guest_mail, guest_phone, guest_birth_date
) VALUES
  (1, 'Guest One', 'guest1@example.com', '555-0001', '1990-01-01'),
  (2, 'Friend A',  'friendA@example.com','555-0011', '1998-03-03');

INSERT INTO report (
  user_id, most_popular_event_id, report_date, revenue_trend_data
) VALUES
  (2, 1, '2025-04-30', '{1000,2000,1500,3000}');