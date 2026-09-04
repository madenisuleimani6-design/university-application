INSERT INTO roles (role_id, role_name) VALUES (1, 'ADMIN');
INSERT INTO roles (role_id, role_name) VALUES (2, 'LECTURER');
INSERT INTO roles (role_id, role_name) VALUES (3, 'FINANCE');
INSERT INTO roles (role_id, role_name) VALUES (4, 'STUDENT');

INSERT INTO users (id, username, password_hash, email, role_id, status) VALUES (1, 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhj2', 'admin@amis.edu', 1, 'ACTIVE');
INSERT INTO users (id, username, password_hash, email, role_id, status) VALUES (2, 'student', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhj2', 'student@amis.edu', 4, 'ACTIVE');
