-- ====================================
-- GameLibrary Database - Script Completo
-- Ejecuta TODO este contenido en phpMyAdmin
-- ====================================

-- PASO 1: ELIMINAR BD ANTERIOR (COMPLETO)
DROP DATABASE IF EXISTS `gamelibrary`;

-- PASO 2: CREAR BD NUEVA
CREATE DATABASE `gamelibrary` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `gamelibrary`;

-- PASO 3: CREAR TABLA USERS
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PASO 4: CREAR TABLA GAMES
CREATE TABLE `games` (
  `id` INT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` LONGTEXT,
  `genre` VARCHAR(255),
  `platform` VARCHAR(255),
  `image_url` LONGTEXT,
  `released_date` DATE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PASO 5: CREAR TABLA USER_LIBRARY
CREATE TABLE `user_library` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `game_id` INT NOT NULL,
  `titulo` VARCHAR(255) NOT NULL,
  `imagen_url` LONGTEXT,
  `plataforma` VARCHAR(100),
  `status` ENUM('pending', 'playing', 'completed', 'dropped') DEFAULT 'pending',
  `valoracion` INT DEFAULT 0,
  `added_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_user_game` (`user_id`, `game_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PASO 6: CREAR ÍNDICES
CREATE INDEX `idx_user_email` ON `users`(`email`);
CREATE INDEX `idx_user_library_user` ON `user_library`(`user_id`);
CREATE INDEX `idx_user_library_game` ON `user_library`(`game_id`);

-- PASO 7: INSERTAR USUARIO DE PRUEBA
INSERT INTO `users` (`id`, `name`, `email`, `password`) VALUES
(1, 'Demo User', 'demo@test.com', '$2a$10$sG0mfSJD5HG0mfSJD5HG0m.7N.8K3F7Q2R1T5V8X0Z1Y2W3E4R5T');

-- PASO 8: INSERTAR JUEGOS DE PRUEBA
INSERT INTO `games` (`id`, `title`, `description`, `genre`, `platform`, `image_url`, `released_date`) VALUES
(1, 'The Witcher 3', 'Un juego de rol fantástico épico', 'RPG', 'PC, PS5, Xbox', 'https://via.placeholder.com/300x400?text=Witcher+3', '2015-05-19'),
(2, 'Elden Ring', 'Un souls-like de acción en mundo abierto', 'Action RPG', 'PC, PS5, Xbox', 'https://via.placeholder.com/300x400?text=Elden+Ring', '2022-02-25'),
(3, 'Baldurs Gate 3', 'Un RPG basado en D&D increíble', 'RPG', 'PC, PS5', 'https://via.placeholder.com/300x400?text=BG3', '2023-08-03');

-- ✅ LISTO! La BD está creada completamente
-- SELECT * FROM users;
-- SELECT COUNT(*) FROM games;
