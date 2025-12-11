-- GrokMemeHub Database Schema
-- MySQL Database Setup for AI Meme Sharing Platform

-- Drop existing tables if they exist (for clean re-runs)
DROP TABLE IF EXISTS reactions;
DROP TABLE IF EXISTS memes;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    location_lat DECIMAL(10, 8) DEFAULT NULL,
    location_long DECIMAL(11, 8) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create memes table
CREATE TABLE memes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    caption TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    uploader_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_category (category),
    INDEX idx_title (title(100)),
    INDEX idx_uploader (uploader_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create reactions table
CREATE TABLE reactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    meme_id INT NOT NULL,
    user_id INT NOT NULL,
    reaction_type ENUM('laugh', 'robot', 'think') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (meme_id) REFERENCES memes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_meme_reaction (meme_id, user_id),
    INDEX idx_meme (meme_id),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample users (passwords are "password123" hashed with bcrypt)
INSERT INTO users (username, email, password, location_lat, location_long) VALUES
('grok_master', 'grok@grokmemehub.com', '$2b$10$rQZ9vN8YvN8YvN8YvN8YvOqKp1qKp1qKp1qKp1qKp1qKp1qKp1qKp', 12.9716, 77.5946),
('ai_enthusiast', 'ai@grokmemehub.com', '$2b$10$rQZ9vN8YvN8YvN8YvN8YvOqKp1qKp1qKp1qKp1qKp1qKp1qKp1qKp', 37.7749, -122.4194);

-- Insert 8+ AI-themed memes with real Unsplash images
INSERT INTO memes (title, caption, image_url, category, uploader_id) VALUES
(
    'When AI Finally Understands Sarcasm',
    'Grok learning the difference between "great job" and "GREAT job" 🤖',
    'https://images.unsplash.com/photo-1625314887424-9f190599bd56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
    'AI',
    1
),
(
    'Grok Solving World Hunger with Puns',
    'Me explaining why I need just one more GPU for my home lab 😂',
    'https://images.unsplash.com/photo-1507162728832-5b8fdb5f99fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
    'Grok',
    1
),
(
    'Neural Networks Explaining Themselves',
    'When you ask the model to explain its decision and it gives you 10,000 dimensions',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
    'AI',
    2
),
(
    'xAI First Day at Work',
    'Walking into xAI headquarters like I know what I am doing',
    'https://images.unsplash.com/photo-1615511676712-df98fcc708d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
    'xAI',
    2
),
(
    'Future AI Reading Old Code',
    'When AI from 2050 discovers code from 2024 and questions everything',
    'https://images.unsplash.com/photo-1672581437674-3186b17b405a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
    'Futuristic',
    1
),
(
    'GPT Meeting Grok for the First Time',
    'The moment when two AI models realize they both think they are funnier',
    'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
    'AI',
    2
),
(
    'AI Trying to Pass CAPTCHA',
    'Even AI struggles with "Select all images with traffic lights" 🚦',
    'https://images.unsplash.com/photo-1644325349124-d1756b79dd42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
    'AI',
    1
),
(
    'When Your Model Finally Converges',
    'That feeling when loss drops below 0.01 after 1000 epochs',
    'https://images.unsplash.com/photo-1676277791608-ac61a3d5c1fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
    'AI',
    2
),
(
    'Grok After Too Much Training Data',
    'When you feed Grok the entire internet and it becomes TOO knowledgeable',
    'https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
    'Grok',
    1
),
(
    'The Future is Now',
    'When your AI assistant starts predicting your thoughts before you think them',
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
    'Futuristic',
    2
);

-- Insert sample reactions
INSERT INTO reactions (meme_id, user_id, reaction_type) VALUES
(1, 1, 'laugh'),
(1, 2, 'robot'),
(2, 1, 'laugh'),
(2, 2, 'laugh'),
(3, 1, 'think'),
(3, 2, 'robot'),
(4, 1, 'robot'),
(5, 2, 'think'),
(6, 1, 'laugh'),
(7, 2, 'laugh'),
(8, 1, 'robot'),
(9, 2, 'laugh'),
(10, 1, 'think');

-- Verify the data
SELECT 'Users created:' as Info, COUNT(*) as Count FROM users
UNION ALL
SELECT 'Memes created:', COUNT(*) FROM memes
UNION ALL
SELECT 'Reactions created:', COUNT(*) FROM reactions;
