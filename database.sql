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
  `rating` DECIMAL(3, 2) DEFAULT 0,
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

-- PASO 6: CREAR TABLA REVIEWS
CREATE TABLE `reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `game_id` INT NOT NULL,
  `rating` INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  `comment` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`game_id`) REFERENCES `user_library`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_game_id` (`game_id`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PASO 7: CREAR ÍNDICES
CREATE INDEX `idx_user_email` ON `users`(`email`);
CREATE INDEX `idx_user_library_user` ON `user_library`(`user_id`);
CREATE INDEX `idx_user_library_game` ON `user_library`(`game_id`);

-- PASO 8: CREAR TABLA ROLES
CREATE TABLE `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) UNIQUE NOT NULL,
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PASO 9: CREAR TABLA PERMISOS
CREATE TABLE `permissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) UNIQUE NOT NULL,
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PASO 10: CREAR TABLA ROL-PERMISO (Relación muchos a muchos)
CREATE TABLE `role_permissions` (
  `role_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`),
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PASO 11: AÑADIR CAMPO ROL A USUARIOS
ALTER TABLE `users` ADD COLUMN `role_id` INT DEFAULT 2;

-- PASO 12: CREAR RELACIÓN USUARIO-ROL
ALTER TABLE `users` ADD FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE SET NULL;

-- PASO 13: INSERTAR ROLES
INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'admin', 'Administrador del sistema con todos los permisos'),
(2, 'user', 'Usuario estándar con permisos básicos');

-- PASO 14: INSERTAR PERMISOS
INSERT INTO `permissions` (`name`, `description`) VALUES
('create_game', 'Crear nuevos juegos en el catálogo'),
('edit_game', 'Editar juegos existentes'),
('delete_game', 'Eliminar juegos del catálogo'),
('manage_users', 'Gestionar usuarios del sistema'),
('view_reports', 'Ver reportes y estadísticas'),
('manage_reviews', 'Gestionar reseñas de usuarios'),
('add_to_library', 'Añadir juegos a la biblioteca personal'),
('edit_library', 'Editar juegos en la biblioteca personal'),
('delete_library', 'Eliminar juegos de la biblioteca personal'),
('create_review', 'Crear reseñas de juegos'),
('edit_review', 'Editar reseñas propias'),
('delete_review', 'Eliminar reseñas propias'),
('view_all_reviews', 'Ver todas las reseñas'),
('manage_catalog', 'Gestionar el catálogo de juegos');

-- PASO 15: ASIGNAR PERMISOS A ROLES
-- Permisos para Admin (todos los permisos)
INSERT INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 1, id FROM permissions;

-- Permisos para Usuarios estándar
INSERT INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 2, id FROM permissions WHERE name IN (
  'add_to_library',
  'edit_library', 
  'delete_library',
  'create_review',
  'edit_review',
  'delete_review',
  'view_all_reviews'
);

-- PASO 16: INSERTAR USUARIO DE PRUEBA (con rol de admin)
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role_id`) VALUES
(1, 'Admin User', 'admin@test.com', '$2a$10$sG0mfSJD5HG0mfSJD5HG0m.7N.8K3F7Q2R1T5V8X0Z1Y2W3E4R5T', 1);

-- ✅ LISTO! La BD está creada completamente con roles y permisos
-- Los juegos se cargarán con seed-games.js
-- SELECT * FROM users;
-- SELECT COUNT(*) FROM games;
