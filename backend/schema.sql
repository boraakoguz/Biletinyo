CREATE TABLE student (
    sid CHAR(6) PRIMARY KEY,
    sname VARCHAR(50) NOT NULL,
    bdate DATE,
    dept CHAR(2),
    year INT,
    gpa FLOAT
);

CREATE TABLE company (
    cid CHAR(5) PRIMARY KEY,
    cname VARCHAR(20) NOT NULL,
    quota INT,
    gpa_threshold FLOAT,
    city VARCHAR(20)
);

CREATE TABLE apply (
    app_no SERIAL PRIMARY KEY,
    sid CHAR(6),
    cid CHAR(5),
    FOREIGN KEY (sid) REFERENCES student(sid),
    FOREIGN KEY (cid) REFERENCES company(cid)
);

INSERT INTO student (sid, sname, bdate, dept, year, gpa) VALUES
('S101', 'Ali', '2005-03-11', 'CS', 2, 2.92),
('S102', 'Veli', '2002-01-07', 'EE', 3, 3.96),
('S103', 'Ayşe', '2004-02-12', 'IE', 1, 3.30),
('S104', 'Mehmet', '2003-05-23', 'CS', 3, 3.07),
('S105', 'Zeynep', '2002-11-19', 'ME', 3, 2.55);

INSERT INTO company (cid, cname, quota, gpa_threshold, city) VALUES
('C101', 'tübitak', 10, 2.50, 'Ankara'),
('C102', 'bist', 2, 2.80, 'Istanbul'),
('C103', 'aselsan', 3, 3.00, 'Ankara'),
('C104', 'thy', 5, 2.40, 'Istanbul'),
('C105', 'milsoft', 6, 2.50, 'Ankara'),
('C106', 'amazon', 1, 3.80, 'Palo Alto'),
('C107', 'tai', 4, 3.00, 'Ankara'),
('C108', 'arcelik', 5, 2.75, 'Istanbul'),
('C109', 'siemens', 2, 2.50, 'Istanbul');

INSERT INTO apply (app_no, sid, cid) VALUES
(1, 'S101', 'C101'),
(2, 'S101', 'C102'),
(3, 'S101', 'C104'),
(4, 'S101', 'C108'),
(5, 'S101', 'C109'),
(6, 'S102', 'C103'),
(7, 'S102', 'C106'),
(8, 'S102', 'C107'),
(9, 'S103', 'C104'),
(10, 'S103', 'C107'),
(11, 'S103', 'C109'),
(12, 'S104', 'C102'),
(13, 'S104', 'C103'),
(14, 'S104', 'C107'),
(15, 'S104', 'C108'),
(16, 'S104', 'C109'),
(17, 'S105', 'C101'),
(18, 'S105', 'C104'),
(19, 'S105', 'C105'),
(20, 'S105', 'C109');