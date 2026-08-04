CREATE TABLE IF NOT EXISTS roles (
    role_id BIGSERIAL PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    role_id BIGINT,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

CREATE TABLE IF NOT EXISTS students (
    id BIGSERIAL PRIMARY KEY,
    registration_number VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(50),
    programme VARCHAR(150)
);

CREATE TABLE IF NOT EXISTS courses (
    id BIGSERIAL PRIMARY KEY,
    course_code VARCHAR(100) NOT NULL UNIQUE,
    course_name VARCHAR(150) NOT NULL,
    credit_hours INTEGER,
    department VARCHAR(150)
);

CREATE TABLE IF NOT EXISTS payments (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT,
    amount DECIMAL(10,2),
    payment_date TIMESTAMP,
    receipt_number VARCHAR(100) UNIQUE
);

CREATE TABLE IF NOT EXISTS accommodations (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT,
    hostel_name VARCHAR(150),
    room_number VARCHAR(50),
    allocation_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS results (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT,
    course_id BIGINT,
    marks DECIMAL(5,2),
    grade VARCHAR(10),
    semester VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS registrations (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT,
    course_id BIGINT,
    semester VARCHAR(50) NOT NULL,
    academic_year VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'ENROLLED'
);
