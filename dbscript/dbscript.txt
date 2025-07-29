-- Common Queue Database Schema - English Version
-- Create database
CREATE DATABASE IF NOT EXISTS common_queue CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE common_queue;

-- 1. Businesses table
CREATE TABLE businesses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    business_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    description VARCHAR(500),
    logo_url VARCHAR(500),
    theme_color VARCHAR(7) DEFAULT '#007bff',
    opening_time TIME,
    closing_time TIME,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    business_type ENUM('CLINIC', 'RESTAURANT', 'RETAIL', 'SERVICE_CENTER', 'PHARMACY', 'BANK', 'GOVERNMENT', 'OTHER') DEFAULT 'OTHER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_business_type (business_type),
    INDEX idx_is_active (is_active)
);

-- 2. Customers table
CREATE TABLE customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    notification_preference ENUM('EMAIL', 'SMS', 'BOTH', 'NONE') DEFAULT 'BOTH',
    language_preference VARCHAR(5) DEFAULT 'en',
    is_active BOOLEAN DEFAULT TRUE,
    avatar_url VARCHAR(500),
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_is_active (is_active)
);

-- 3. Staff table
CREATE TABLE staff (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('ADMIN', 'MANAGER', 'STAFF') DEFAULT 'STAFF',
    business_id BIGINT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    INDEX idx_email (email),
    INDEX idx_business_id (business_id),
    INDEX idx_role (role)
);

-- 4. Queues table
CREATE TABLE queues (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    queue_name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    business_id BIGINT NOT NULL,
    avg_service_time_minutes INT DEFAULT 10,
    current_number INT DEFAULT 0,
    next_number INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    queue_type ENUM('GENERAL', 'CONSULTATION', 'PHARMACY', 'CASHIER', 'APPOINTMENT', 'PRIORITY', 'EXPRESS', 'WALKIN') DEFAULT 'GENERAL',
    max_capacity INT,
    color_code VARCHAR(7) DEFAULT '#007bff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    INDEX idx_business_id (business_id),
    INDEX idx_queue_type (queue_type),
    INDEX idx_is_active (is_active)
);

-- 5. Queue entries table
CREATE TABLE queue_entries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    queue_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    queue_number INT NOT NULL,
    status ENUM('WAITING', 'CALLED', 'SERVED', 'CANCELLED', 'NO_SHOW') DEFAULT 'WAITING',
    estimated_wait_time_minutes INT,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    called_at TIMESTAMP NULL,
    served_at TIMESTAMP NULL,
    cancelled_at TIMESTAMP NULL,
    no_show_at TIMESTAMP NULL,
    priority_level INT DEFAULT 0,
    notes TEXT,
    notification_sent BOOLEAN DEFAULT FALSE,
    reminder_sent BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (queue_id) REFERENCES queues(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_queue_id (queue_id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_status (status),
    INDEX idx_joined_at (joined_at),
    UNIQUE KEY unique_queue_customer_active (queue_id, customer_id, status)
);

-- 6. Feedbacks table
CREATE TABLE feedbacks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    business_id BIGINT NOT NULL,
    queue_entry_id BIGINT,
    accuracy_rating INT NOT NULL CHECK (accuracy_rating BETWEEN 1 AND 5),
    service_rating INT CHECK (service_rating BETWEEN 1 AND 5),
    comment TEXT,
    feedback_type ENUM('QUEUE_ACCURACY', 'SERVICE_QUALITY', 'GENERAL', 'COMPLAINT', 'SUGGESTION') DEFAULT 'QUEUE_ACCURACY',
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    FOREIGN KEY (queue_entry_id) REFERENCES queue_entries(id) ON DELETE SET NULL,
    INDEX idx_customer_id (customer_id),
    INDEX idx_business_id (business_id),
    INDEX idx_feedback_type (feedback_type),
    INDEX idx_created_at (created_at)
);

-- 7. Notifications table
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT,
    queue_entry_id BIGINT,
    notification_type ENUM('QUEUE_JOINED', 'TURN_APPROACHING', 'TURN_READY', 'QUEUE_CANCELLED', 'QUEUE_DELAYED', 'REMINDER', 'FEEDBACK_REQUEST') NOT NULL,
    channel ENUM('EMAIL', 'SMS', 'PUSH', 'IN_APP') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    recipient VARCHAR(255),
    status ENUM('PENDING', 'SENT', 'FAILED', 'CANCELLED') DEFAULT 'PENDING',
    sent_at TIMESTAMP NULL,
    read_at TIMESTAMP NULL,
    error_message TEXT,
    retry_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (queue_entry_id) REFERENCES queue_entries(id) ON DELETE CASCADE,
    INDEX idx_customer_id (customer_id),
    INDEX idx_status (status),
    INDEX idx_notification_type (notification_type),
    INDEX idx_created_at (created_at)
);

-- 8. Customer favorite businesses table (Many-to-Many)
CREATE TABLE customer_favorite_businesses (
    customer_id BIGINT NOT NULL,
    business_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (customer_id, business_id),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- Insert sample test data (English)
INSERT INTO businesses (business_name, email, password, phone, address, description, business_type, opening_time, closing_time) VALUES
('Singapore General Clinic', 'admin@sgclinic.com', '$2a$10$dummyhashedpassword123', '+65-6123-4567', '123 Orchard Road, Singapore 238858', 'Comprehensive healthcare services and medical consultations', 'CLINIC', '08:00:00', '18:00:00'),
('Golden Dragon Restaurant', 'manager@goldendragon.sg', '$2a$10$dummyhashedpassword123', '+65-6234-5678', '456 Chinatown Street, Singapore 049568', 'Authentic Asian cuisine and fine dining experience', 'RESTAURANT', '11:00:00', '22:00:00'),
('24/7 Pharmacy Plus', 'info@pharmacy24.sg', '$2a$10$dummyhashedpassword123', '+65-6345-6789', '789 Tampines Ave 1, Singapore 520789', 'Round-the-clock pharmacy and healthcare products', 'PHARMACY', '00:00:00', '23:59:59'),
('City Bank Singapore', 'service@citybank.sg', '$2a$10$dummyhashedpassword123', '+65-6456-7890', '100 Raffles Place, Singapore 048623', 'Full-service banking and financial solutions', 'BANK', '09:00:00', '17:00:00'),
('TechFix Service Center', 'support@techfix.sg', '$2a$10$dummyhashedpassword123', '+65-6567-8901', '200 Jurong East Ave 1, Singapore 609731', 'Electronic device repair and technical support', 'SERVICE_CENTER', '10:00:00', '19:00:00');

INSERT INTO customers (name, email, phone, notification_preference) VALUES
('John Smith', 'john.smith@email.com', '+65-8123-4567', 'BOTH'),
('Sarah Johnson', 'sarah.johnson@email.com', '+65-8234-5678', 'EMAIL'),
('Michael Chen', 'michael.chen@email.com', '+65-8345-6789', 'SMS'),
('Emily Davis', 'emily.davis@email.com', '+65-8456-7890', 'BOTH'),
('David Wilson', 'david.wilson@email.com', '+65-8567-9012', 'EMAIL'),
('Lisa Anderson', 'lisa.anderson@email.com', '+65-8678-0123', 'BOTH'),
('Robert Taylor', 'robert.taylor@email.com', '+65-8789-1234', 'SMS'),
('Jennifer Brown', 'jennifer.brown@email.com', '+65-8890-2345', 'BOTH');

-- Create staff accounts for businesses
INSERT INTO staff (name, email, password, phone, role, business_id) VALUES
('Dr. Amanda Lee', 'dr.lee@sgclinic.com', '$2a$10$dummyhashedpassword123', '+65-9123-4567', 'ADMIN', 1),
('Nurse Betty Tan', 'nurse.tan@sgclinic.com', '$2a$10$dummyhashedpassword123', '+65-9234-5678', 'STAFF', 1),
('Chef Wong Ming', 'chef.wong@goldendragon.sg', '$2a$10$dummyhashedpassword123', '+65-9345-6789', 'MANAGER', 2),
('Waiter James Lim', 'james.lim@goldendragon.sg', '$2a$10$dummyhashedpassword123', '+65-9456-7890', 'STAFF', 2),
('Pharmacist Mary Ng', 'mary.ng@pharmacy24.sg', '$2a$10$dummyhashedpassword123', '+65-9567-8901', 'ADMIN', 3);

-- Create queues for Singapore General Clinic
INSERT INTO queues (queue_name, description, business_id, queue_type, avg_service_time_minutes, max_capacity, color_code) VALUES
('General Consultation', 'General medical consultation and checkup', 1, 'CONSULTATION', 15, 50, '#28a745'),
('Specialist Consultation', 'Specialist doctor consultation', 1, 'CONSULTATION', 25, 30, '#007bff'),
('Pharmacy Counter', 'Prescription medication collection', 1, 'PHARMACY', 5, 100, '#ffc107'),
('Blood Test', 'Laboratory blood testing service', 1, 'GENERAL', 10, 40, '#dc3545');

-- Create queues for Golden Dragon Restaurant
INSERT INTO queues (queue_name, description, business_id, queue_type, avg_service_time_minutes, max_capacity, color_code) VALUES
('Dining Area', 'Table reservation and dining service', 2, 'GENERAL', 45, 20, '#fd7e14'),
('Takeaway Counter', 'Food pickup for takeaway orders', 2, 'EXPRESS', 5, 50, '#20c997');

-- Create queues for 24/7 Pharmacy Plus
INSERT INTO queues (queue_name, description, business_id, queue_type, avg_service_time_minutes, max_capacity, color_code) VALUES
('Prescription Counter', 'Prescription medication dispensing', 3, 'PHARMACY', 8, 60, '#6f42c1'),
('Over-the-Counter', 'Non-prescription items and consultation', 3, 'GENERAL', 5, 80, '#e83e8c');

-- Create queues for City Bank Singapore
INSERT INTO queues (queue_name, description, business_id, queue_type, avg_service_time_minutes, max_capacity, color_code) VALUES
('Teller Service', 'General banking transactions', 4, 'GENERAL', 12, 25, '#17a2b8'),
('Customer Service', 'Account inquiries and support', 4, 'GENERAL', 20, 15, '#6c757d'),
('Loan Department', 'Loan applications and consultations', 4, 'APPOINTMENT', 30, 10, '#495057');

-- Create queues for TechFix Service Center
INSERT INTO queues (queue_name, description, business_id, queue_type, avg_service_time_minutes, max_capacity, color_code) VALUES
('Device Drop-off', 'Device registration and initial assessment', 5, 'GENERAL', 10, 30, '#343a40'),
('Consultation', 'Technical consultation and diagnosis', 5, 'CONSULTATION', 20, 20, '#6610f2');

-- Add some sample queue entries (customers currently in queues)
INSERT INTO queue_entries (queue_id, customer_id, queue_number, status, estimated_wait_time_minutes) VALUES
(1, 1, 1, 'WAITING', 15),  -- John Smith waiting for General Consultation
(1, 2, 2, 'WAITING', 30),  -- Sarah Johnson waiting for General Consultation
(3, 3, 1, 'CALLED', 0),    -- Michael Chen called for Pharmacy Counter
(5, 4, 1, 'WAITING', 45),  -- Emily Davis waiting for Dining Area
(6, 5, 1, 'WAITING', 5),   -- David Wilson waiting for Takeaway Counter
(9, 6, 1, 'WAITING', 12),  -- Lisa Anderson waiting for Teller Service
(12, 7, 1, 'WAITING', 10); -- Robert Taylor waiting for Device Drop-off

-- Add some sample feedback
INSERT INTO feedbacks (customer_id, business_id, queue_entry_id, accuracy_rating, service_rating, comment, feedback_type) VALUES
(8, 1, NULL, 5, 4, 'Very accurate wait time estimation. Great service!', 'QUEUE_ACCURACY'),
(1, 2, NULL, 4, 5, 'Food was excellent and wait time was reasonable.', 'SERVICE_QUALITY'),
(2, 3, NULL, 5, 5, 'Quick service and very efficient pharmacy.', 'GENERAL');

-- Display created tables
SHOW TABLES;

-- Check table structures
SELECT 'Businesses Table' as 'Table Info';
SELECT COUNT(*) as 'Total Businesses' FROM businesses;
SELECT business_name, business_type, is_active FROM businesses;

SELECT 'Customers Table' as 'Table Info';
SELECT COUNT(*) as 'Total Customers' FROM customers;
SELECT name, email, notification_preference FROM customers LIMIT 5;

SELECT 'Queues Table' as 'Table Info';
SELECT COUNT(*) as 'Total Queues' FROM queues;
SELECT q.queue_name, b.business_name, q.queue_type, q.avg_service_time_minutes 
FROM queues q 
JOIN businesses b ON q.business_id = b.id;

SELECT 'Queue Entries Table' as 'Table Info';
SELECT COUNT(*) as 'Total Active Queue Entries' FROM queue_entries WHERE status IN ('WAITING', 'CALLED');
SELECT c.name, b.business_name, q.queue_name, qe.queue_number, qe.status
FROM queue_entries qe
JOIN customers c ON qe.customer_id = c.id
JOIN queues q ON qe.queue_id = q.id
JOIN businesses b ON q.business_id = b.id
WHERE qe.status IN ('WAITING', 'CALLED');
