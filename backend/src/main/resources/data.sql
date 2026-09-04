INSERT INTO roles (role_id, role_name) VALUES (1, 'ADMIN');
INSERT INTO roles (role_id, role_name) VALUES (2, 'LECTURER');
INSERT INTO roles (role_id, role_name) VALUES (3, 'FINANCE');
INSERT INTO roles (role_id, role_name) VALUES (4, 'STUDENT');

INSERT INTO users (id, username, password_hash, email, role_id, status) VALUES (1, 'admin', '$2a$10$q.JHO/LUxxrOAdBQVkYfeuy2kQlqoCyRrGXDoWSDrV3DsUgA/X6PS', 'admin@amis.edu', 1, 'ACTIVE');
INSERT INTO users (id, username, password_hash, email, role_id, status) VALUES (2, 'student', '$2a$10$16HWwwBytSAOHzeTXTdVi./I6uCkfi0VYqWl9KOo3uJIJmQhv/.Pe', 'student@amis.edu', 4, 'ACTIVE');
