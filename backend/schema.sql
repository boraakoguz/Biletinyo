CREATE TABLE users (
    user_id     SERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,
    email       VARCHAR(50) NOT NULL UNIQUE,
    password    VARCHAR(50) NOT NULL,
    user_type   INT NOT NULL,
    phone       VARCHAR(15)
);

CREATE TABLE attendee (
    user_id                 INT PRIMARY KEY,
    attended_event_number   INT NOT NULL,
    account_balance         DECIMAL(10,2),
    birth_date              DATE,
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
    row_number			INT NOT NULL,
    column_number		INT NOT NULL
);

CREATE TABLE event (
    event_id 	 SERIAL PRIMARY KEY,
    event_title	 VARCHAR(100) NOT NULL UNIQUE,
    description	 TEXT,
    event_date	 DATE NOT NULL,
    category 	 VARCHAR(50) NOT NULL,
    revenue	     DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    regulations	 TEXT,
    organizer_id INT NOT NULL,
    venue_id INT NOT NULL,
    image_ids INT[],
    FOREIGN KEY (organizer_id) REFERENCES organizer(user_id),
    FOREIGN KEY (venue_id) REFERENCES venue(venue_id)
);

CREATE TABLE seat(
    venue_id			INT NOT NULL,
    seat_row			INT NOT NULL, 
    seat_column			INT NOT NULL,
 	
	PRIMARY KEY (venue_id, seat_row, seat_column),
	FOREIGN KEY (venue_id) REFERENCES venue(venue_id)
);

CREATE TABLE ticket_category (
    event_id          		INT NOT NULL,
    category_name     		VARCHAR(50) NOT NULL,
    category_capacity		INT NOT NULL,
    price            		DECIMAL(10,2) NOT NULL,

    PRIMARY KEY (event_id, category_name),
    FOREIGN KEY (event_id) REFERENCES event(event_id)
);

CREATE TABLE ticket (
    user_id        INT NOT NULL,
    event_id       INT NOT NULL,
    ticket_no      INT NOT NULL,
    category_name  VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, event_id, ticket_no),
    FOREIGN KEY (user_id) REFERENCES attendee(user_id),
    FOREIGN KEY (event_id) REFERENCES event(event_id),
    FOREIGN KEY (event_id, category_name) REFERENCES ticket_category(event_id, category_name)
);

CREATE TABLE comment(
    comment_id      SERIAL PRIMARY KEY,
    rating          INT NOT NULL, 
    comment_title	VARCHAR(100) NOT NULL,
    comment_text	TEXT NOT NULL,
    comment_date	DATE NOT NULL
);

CREATE TABLE payment(
    payment_id			SERIAL PRIMARY KEY,
    payment_amount		DECIMAL(10,2) NOT NULL, 
    payment_method		VARCHAR(50),
    payment_status		VARCHAR(50) NOT NULL,
    payment_date		DATE
);

CREATE TABLE books (
    user_id     	INT NOT NULL,
   	event_id    	INT NOT NULL,
    ticket_no  	    INT NOT NULL,
    PRIMARY KEY (user_id, event_id, ticket_no),
   	FOREIGN KEY (user_id, event_id, ticket_no) REFERENCES ticket(user_id, event_id, ticket_no)
);

CREATE TABLE writes(
    user_id	    INT NOT NULL,
    comment_id	INT NOT NULL, 
    PRIMARY KEY (user_id, comment_id),
    FOREIGN KEY (user_id) REFERENCES attendee(user_id),
    FOREIGN KEY (comment_id) REFERENCES comment(comment_id)
);

CREATE TABLE about(
    comment_id  INT NOT NULL,
    event_id    INT NOT NULL, 
    PRIMARY KEY (comment_id, event_id),
    FOREIGN KEY (comment_id) REFERENCES comment(comment_id),
    FOREIGN KEY (event_id) REFERENCES event(event_id)
);

CREATE TABLE ticket_seats (
    user_id        	INT NOT NULL,
    event_id       	INT NOT NULL,
    ticket_no      	INT NOT NULL,
    venue_id       	INT NOT NULL,
    seat_row       	INT NOT NULL,
    seat_column   	INT NOT NULL,
    PRIMARY KEY (user_id, event_id, ticket_no, venue_id, seat_row, seat_column),
    FOREIGN KEY (user_id, event_id, ticket_no) REFERENCES ticket(user_id, event_id, ticket_no),
    FOREIGN KEY (venue_id, seat_row, seat_column) REFERENCES seat(venue_id, seat_row, seat_column)
);

CREATE TABLE payments_of (
    payment_id   	INT NOT NULL,
    user_id      	INT NOT NULL,
    event_id     	INT NOT NULL,
    ticket_no    	INT NOT NULL,
    PRIMARY KEY (payment_id, user_id, event_id, ticket_no),
    FOREIGN KEY (payment_id) REFERENCES payment(payment_id),
    FOREIGN KEY (user_id, event_id, ticket_no) REFERENCES ticket(user_id, event_id, ticket_no)
);

CREATE TABLE ticket_guest (
    user_id     INT NOT NULL,
    event_id    INT NOT NULL,
    ticket_no   INT NOT NULL,
    guest_no    INT NOT NULL,
    guest_name  VARCHAR(100),
    guest_mail  VARCHAR(100),
    guest_phone VARCHAR(20),
    guest_age   INT,
    PRIMARY KEY (user_id, event_id, ticket_no, guest_no),
    FOREIGN KEY (user_id, event_id, ticket_no)
    REFERENCES ticket(user_id, event_id, ticket_no)
);

INSERT INTO users (name, email, password, user_type, phone) VALUES
('Alice Johnson', 'alice@example.com', 'hashed_pass1', 0, '555-1234'),
('Bob Smith', 'bob@example.com', 'hashed_pass2', 1, '555-5678'),
('Charlie Brown', 'charlie@example.com', 'hashed_pass3', 0, '555-8765');


INSERT INTO organizer (user_id, organization_name)
VALUES
  (1, 'Duman Productions'),
  (2, 'Bora Productions');

INSERT INTO seat (venue_id, seat_row, seat_column) VALUES
(1, 1, 1), (1, 1, 2), (1, 2, 1), (1, 2, 2),
(2, 1, 1), (2, 1, 2), (2, 2, 1), (2, 2, 2);

INSERT INTO ticket_category (event_id, category_name, category_capacity, price) VALUES
(1, 'VIP', 100, 500.00),
(1, 'General', 400, 150.00),
(2, 'VIP', 50, 600.00),
(2, 'General', 300, 200.00);

INSERT INTO ticket (user_id, event_id, ticket_no, category_name) VALUES
(1, 1, 1, 'VIP'),
(3, 1, 1, 'General'),
(3, 2, 1, 'VIP');

INSERT INTO comment (rating, comment_title, comment_text, comment_date) VALUES
(5, 'Amazing concert!', 'Loved the atmosphere and sound quality.', '2025-05-03'),
(4, 'Great performance', 'Ajda was spectacular but the seats were uncomfortable.', '2025-06-21');

INSERT INTO writes (user_id, comment_id) VALUES
(1, 1),
(3, 2);

INSERT INTO about (comment_id, event_id) VALUES
(1, 1),
(2, 2);

INSERT INTO payment (payment_amount, payment_method, payment_status, payment_date) VALUES
(500.00, 'Credit Card', 'Completed', '2025-04-30'),
(200.00, 'PayPal', 'Completed', '2025-06-18');

INSERT INTO books (user_id, event_id, ticket_no) VALUES
(1, 1, 1),
(3, 2, 1);

INSERT INTO ticket_seats (user_id, event_id, ticket_no, venue_id, seat_row, seat_column) VALUES
(1, 1, 1, 1, 1, 1),
(3, 1, 1, 1, 2, 2),
(3, 2, 1, 2, 1, 1);

INSERT INTO payments_of (payment_id, user_id, event_id, ticket_no) VALUES
(1, 1, 1, 1),
(2, 3, 2, 1);

INSERT INTO ticket_guest (user_id, event_id, ticket_no, guest_no, guest_name, guest_mail, guest_phone, guest_age) VALUES
(3, 1, 1, 1, 'John Doe', 'john@example.com', '555-4444', 28),
(3, 2, 1, 1, 'Jane Smith', 'jane@example.com', '555-8888', 32);

INSERT INTO venue (capacity, location, venue_name, venue_description, row_number, column_number)
VALUES
  (5000, 'Congresium',   'Main Hall',      'Indoor concert hall', 50, 100),
  (1000, 'City Park',     'Open-Air Stage', 'Outdoor amphitheater', 20,  30);


INSERT INTO event
  (event_title, description, event_date, category, revenue, regulations, organizer_id, venue_id)
VALUES
  (
    'Rock Concert – Duman',
    'Legendary Turkish rock band Duman will perform their greatest hits live.',
    '2025-05-02',
    'Music',
    85000.00,
    'No outside food or drinks. Bags will be searched at entrance.',
    1,  
    1  
  ),
  (
    'Ajda Pekkan Open-Air',
    'The superstar returns to the stage with a spectacular open-air show.',
    '2025-06-20',
    'Music',
    120000.00,
    'Event is 18+. ID required at the gate.',
    2,  
    2   
  );