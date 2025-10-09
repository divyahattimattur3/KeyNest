-- KeyNest Database Setup
-- Run this script in MySQL to create the database and tables

CREATE DATABASE IF NOT EXISTS keynest;
USE keynest;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('seller', 'buyer') NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    beds INT NOT NULL,
    baths INT NOT NULL,
    area INT NOT NULL, -- in sqft
    description TEXT,
    images JSON, -- Store image paths as JSON array
    seller_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reviews/Ratings table
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    buyer_id INT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    upi_id VARCHAR(100) NOT NULL,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id),
    FOREIGN KEY (buyer_id) REFERENCES users(id)
);

-- Insert sample data
INSERT INTO users (username, password, user_type, name, email, mobile) VALUES
('seller1', 'password123', 'seller', 'John Doe', 'john@example.com', '9876543210'),
('seller2', 'password123', 'seller', 'Jane Smith', 'jane@example.com', '9876543211'),
('buyer1', 'password123', 'buyer', 'Mike Johnson', 'mike@example.com', '9876543212');

INSERT INTO properties (title, price, location, beds, baths, area, description, images, seller_id) VALUES
('Luxury Villa in Mumbai', 24500000.00, 'Mumbai, Maharashtra', 4, 3, 3200, 'Beautiful modern villa with ocean views', '["property1.jpg", "property1_2.jpg"]', 1),
('Modern Apartment in Delhi', 18500000.00, 'Delhi, India', 3, 2, 2100, 'Contemporary apartment in prime location', '["property2.jpg", "property2_2.jpg"]', 2),
('Beachfront Villa in Goa', 32000000.00, 'Goa, India', 6, 5, 5500, 'Stunning beachfront property with private access', '["property3.jpg", "property3_2.jpg"]', 1);

INSERT INTO reviews (property_id, user_id, rating, review_text) VALUES
(1, 3, 5, 'Excellent property with great amenities. Highly recommended!'),
(2, 3, 4, 'Great location and well-maintained property.'),
(3, 3, 5, 'Stunning property with ocean views. Absolutely perfect!');
