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
    seat_map			INT[][] NOT NULL,
    available     INT NOT NULL
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
    attendee_id     INT,
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

INSERT INTO venue (capacity, location, venue_name, venue_description, city, seat_map, available)
VALUES
  (100, 'Atakule, Ankara', 'Atakule Hall', 'Central conference hall', 'Ankara',
   '{{1,1,1},{1,1,1},{1,1,1}}', 1),
  (200, 'Konya Road, Konya', 'Fairgrounds', 'Open-air fairgrounds', 'Konya',
   '{{1,1},{1,1}}', 1);

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

INSERT INTO users (name, email, password, user_type, phone, birth_date) VALUES
  ('Alice Johnson',    'alice.j@example.com',   '$2b$12$examplehashA', 0, '555-1001', '1992-02-10'),
  ('Bob Martinez',     'bob.m@example.com',     '$2b$12$examplehashB', 0, '555-1002', '1988-07-22'),
  ('Carol Singh',      'carol.s@example.com',   '$2b$12$examplehashC', 0, '555-1003', '1995-11-05'),
  ('David Lee',        'david.l@example.com',   '$2b$12$examplehashD', 0, '555-1004', '1990-03-30'),
  ('Eva González',     'eva.g@example.com',     '$2b$12$examplehashE', 0, '555-1005', '1993-08-15'),
  ('Frank Zhang',      'frank.z@example.com',   '$2b$12$examplehashF', 1, '555-1006', '1985-12-01'),
  ('Grace Kim',        'grace.k@example.com',   '$2b$12$examplehashG', 1, '555-1007', '1987-04-18'),
  ('Henry ONeill',   'henry.o@example.com',   '$2b$12$examplehashH', 1, '555-1008', '1991-09-09'),
  ('Isabel Rossi',     'isabel.r@example.com',  '$2b$12$examplehashI', 1, '555-1009', '1989-06-25'),
  ('Jack Thompson',    'jack.t@example.com',    '$2b$12$examplehashJ', 1, '555-1010', '1994-01-12'),
  ('Karen Patel',      'karen.p@example.com',   '$2b$12$examplehashK', 0, '555-1011', '1996-10-02'),
  ('Leo Müller',       'leo.m@example.com',     '$2b$12$examplehashL', 0, '555-1012', '1992-05-20');

INSERT INTO attendee (user_id, attended_event_count, account_balance) VALUES
  (4,  3, 120.00),
  (5,  0,  80.50),
  (6,  5, 200.75),
  (7,  2,  34.25),
  (12, 1,  15.00),
  (13, 0,  60.00);

INSERT INTO organizer (user_id, organization_name) VALUES
  (8,  'Techify Inc.'),
  (9,  'MusicLive LLC'),
  (10, 'FoodFest Co.'),
  (11, 'ArtHouse Org.'),
  (14, 'GreenGames Ltd.'),
  (15, 'HealthSummit AG');

INSERT INTO venue (capacity, location, venue_name, venue_description, city, seat_map, available) VALUES
  ( 80, 'Kızılay, Ankara',       'City Theater',     'Indoor theater with tiered seating.',      'Ankara', '{{1,1,1,1},{1,1,1,1},{1,1,1,1}}', 1),
  (300, 'Nişantaşı, İstanbul',   'Grand Expo Hall',  'Spacious hall for expos & trade fairs.',  'Istanbul','{{1,1},{1,1},{1,1},{1,1},{1,1}}', 1),
  (120, 'Alsancak, İzmir',       'Harbor Arena',     'Waterfront open-air arena.',              'Izmir',   '{{1,1,1,1,1},{1,1,1,1,1}}',        1),
  ( 50, 'Odunpazarı, Eskişehir', 'Pavilion A',       'Small intimate performance space.',      'Eskişehir','{{1,1,1},{1,1,1}}',             1);

INSERT INTO event (organizer_id, venue_id, event_title, event_status, description, event_date, category, revenue, regulations, category_name, image_ids) VALUES
  ( 8,  3, 'Startup Pitch Night',      1, 'Early-stage startups pitch ideas.',              '2025-05-25', 'Business',   5000.00, 'ID badge required.', 3, '{301,302}'),
  ( 9,  1, 'Indie Rock Concert',       1, 'Live indie bands from Turkey.',                   '2025-05-28', 'Music',      8000.00, 'No cameras.',         1, '{303,304,305}'),
  (10,  2, 'Gourmet Food Festival',    1, 'Taste dishes from around the world.',            '2025-06-05', 'Food',       12000.00,'No outside drinks.', 4, '{306,307}'),
  (11,  4, 'Contemporary Art Expo',    1, 'Showcase of emerging visual artists.',           '2025-06-12', 'Art',        7000.00, 'No flash photography.',5,'{308,309,310}'),
  (14,  5, 'eSports Championship',     0, 'Top teams battle for the title.',                '2025-07-03', 'Gaming',     25000.00,'No cheating.',        6, '{311,312}'),
  (15,  6, 'Wellness Retreat',         1, 'Yoga, meditation and health workshops.',         '2025-07-20', 'Health',     9000.00, 'Bring your own mat.', 7, '{313}'),
  ( 8,  2, 'Cloud Computing Summit',   1, 'Industry experts share cloud strategies.',       '2025-08-10', 'Business',   15000.00,'Registration required.',3,'{314,315}'),
  ( 9,  3, 'Jazz Evening',             1, 'Smooth jazz by lakeside.',                       '2025-09-01', 'Music',      6000.00, 'Formal attire.',      1, '{316,317}');

INSERT INTO payment (attendee_id, payment_amount, payment_method, payment_status, payment_date) VALUES
  (4,  120.00, 'Credit Card', 'Completed', '2025-05-23'),
  (5,   80.50, 'PayPal',      'Completed', '2025-05-22'),
  (6,  200.75, 'Credit Card', 'Completed', '2025-05-24'),
  (7,   34.25, 'Cash',        'Completed', '2025-05-25'),
  (12,  15.00, 'Credit Card', 'Pending',   '2025-05-26'),
  (13,  60.00, 'PayPal',      'Completed', '2025-06-01');

INSERT INTO ticket (attendee_id, payment_id, event_id, ticket_state, ticket_class, price, seat_row, seat_column) VALUES
  (4,  1, 1, 1, 2, 120,  3, 2),
  (5,  2, 2, 1, 1,  80,  2, 1),
  (6,  3, 3, 1, 2, 200,  1, 5),
  (7,  4, 4, 1, 3,  34,  2, 3),
  (12, 5, 1, 0, 1,  15,  1, 1),
  (13, 6, 5, 1, 2,  60,  4, 4);

INSERT INTO ticket_guest (ticket_id, guest_name, guest_mail, guest_phone, guest_birth_date) VALUES
  (1, 'Mark Twain',  'mark.twain@example.com',   '555-2001', '1975-06-15'),
  (2, 'Lucy Heart',  'lucy.heart@example.com',  '555-2002', '1980-10-20'),
  (3, 'Sam Rivers',  'sam.rivers@example.com',  '555-2003', '1992-12-12');

INSERT INTO comment (event_id, attendee_id, rating, comment_title, comment_text, comment_date) VALUES
  (1, 4,  4, 'Great night',          'Really enjoyed the pitches!',  '2025-05-26'),
  (2, 5,  5, 'Rocked!',              'The bands were awesome.',      '2025-05-29'),
  (3, 6,  3, 'Good food',            'Tasty but a bit crowded.',     '2025-06-06'),
  (4, 7,  5, 'Art was stunning',     'Loved the installations.',     '2025-06-13');

INSERT INTO report (user_id, most_popular_event_id, report_date, revenue_trend_data) VALUES
  (8,  2, '2025-05-31', '{500,1200,900,1500}'),
  (9,  1, '2025-06-10', '{800,600,1400,1000}'),
  (10, 3, '2025-06-20', '{1200,1300,1100,900}');