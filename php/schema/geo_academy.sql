-- =============================================================
-- GEO ACADEMY — Full Database Schema
-- Run this in phpMyAdmin or via: mysql -u root geo_academy_db < geo_academy.sql
-- =============================================================

CREATE DATABASE IF NOT EXISTS `geo_academy_db`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `geo_academy_db`;

-- ── Users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `users` (
  `id`               VARCHAR(36)  NOT NULL,
  `role`             ENUM('student','teacher','admin','computer') NOT NULL,
  `full_name`        VARCHAR(100) NOT NULL,
  `identifier`       VARCHAR(150) NOT NULL,
  `email`            VARCHAR(150) NOT NULL,
  `password_hash`    VARCHAR(255) NOT NULL,
  `status`           ENUM('pending','approved','rejected','suspended') DEFAULT 'pending',
  `subject`          VARCHAR(100) DEFAULT NULL COMMENT 'Teachers only',
  `phone`            VARCHAR(20)  DEFAULT NULL,
  `avatar_initials`  VARCHAR(2)   DEFAULT NULL,
  `avatar_url`       VARCHAR(255) DEFAULT NULL,
  `created_at`       DATETIME     DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_email`      (`email`),
  UNIQUE KEY `uniq_identifier` (`identifier`),
  KEY `idx_role`   (`role`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Sessions (token-based auth) ───────────────────────────────
CREATE TABLE IF NOT EXISTS `sessions` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`    VARCHAR(36)  NOT NULL,
  `token`      VARCHAR(64)  NOT NULL,
  `expires_at` DATETIME     NOT NULL,
  `created_at` DATETIME     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_token` (`token`),
  KEY `idx_user_id` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Academic Results ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `results` (
  `id`           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `student_id`   VARCHAR(36)  NOT NULL,
  `subject`      VARCHAR(100) NOT NULL,
  `score`        DECIMAL(5,2) NOT NULL,
  `grade`        VARCHAR(5)   DEFAULT NULL,
  `term`         VARCHAR(20)  NOT NULL,
  `session_year` VARCHAR(9)   NOT NULL COMMENT 'e.g. 2024/2025',
  `created_by`   VARCHAR(36)  DEFAULT NULL,
  `created_at`   DATETIME     DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_result` (`student_id`, `subject`, `term`, `session_year`),
  KEY `idx_student` (`student_id`),
  FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ── Payments ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `payments` (
  `id`               INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `student_id`       VARCHAR(36)   NOT NULL,
  `reference`        VARCHAR(100)  NOT NULL,
  `amount`           DECIMAL(10,2) NOT NULL,
  `payment_method`   VARCHAR(50)   DEFAULT NULL,
  `status`           ENUM('success','failed','pending','abandoned') DEFAULT 'pending',
  `payment_date`     DATETIME      DEFAULT CURRENT_TIMESTAMP,
  `gateway_response` TEXT          DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_reference` (`reference`),
  KEY `idx_student_id` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Student Subscriptions ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS `student_subscriptions` (
  `id`                  INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `student_id`          VARCHAR(36)  NOT NULL,
  `current_period_end`  DATETIME     NOT NULL,
  `status`              ENUM('active','expired','cancelled') DEFAULT 'expired',
  `created_at`          DATETIME     DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_student` (`student_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Teacher Payout Requests ───────────────────────────────────
CREATE TABLE IF NOT EXISTS `teacher_payout_requests` (
  `id`             INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `teacher_id`     VARCHAR(36)   NOT NULL,
  `bank_name`      VARCHAR(100)  NOT NULL,
  `account_number` VARCHAR(20)   NOT NULL,
  `account_name`   VARCHAR(100)  NOT NULL,
  `amount`         DECIMAL(10,2) NOT NULL,
  `notes`          TEXT          DEFAULT NULL,
  `status`         ENUM('pending','processed','rejected') DEFAULT 'pending',
  `created_at`     DATETIME      DEFAULT CURRENT_TIMESTAMP,
  `processed_at`   DATETIME      DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_teacher`  (`teacher_id`),
  KEY `idx_status`   (`status`),
  FOREIGN KEY (`teacher_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Announcements ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `announcements` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title`       VARCHAR(200) NOT NULL,
  `body`        TEXT         NOT NULL,
  `target_role` ENUM('all','student','teacher','admin') DEFAULT 'all',
  `created_by`  VARCHAR(36)  DEFAULT NULL,
  `created_at`  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_role` (`target_role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Seed: default admin account ───────────────────────────────
-- Password: adminpass  (bcrypt hash below)
INSERT IGNORE INTO `users`
  (`id`, `role`, `full_name`, `identifier`, `email`, `password_hash`, `status`, `avatar_initials`)
VALUES
  ('admin-001', 'admin', 'Super Administrator', 'ADMIN123',
   'admin@geoacademy.edu',
   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- "adminpass"
   'approved', 'SA'),
  ('teacher-001', 'teacher', 'Dr. Sarah Johnson', 'sarah.johnson@geoacademy.edu',
   'sarah.johnson@geoacademy.edu',
   '$2y$10$TKh8H1.PfuA2iofrf9.1De7DGQr6CG3b2fEkw0Sh5IWxgFYAbkS2', -- "teacher123"
   'approved', 'SJ'),
  ('student-001', 'student', 'Michael Adeyemi', 'GEO/2024/001',
   'm.adeyemi@geoacademy.edu',
   '$2y$10$2eUaTljMoa/jX4xn5vwCLunU4Fd/X4sMbUnEiCdv2JT5ib8fvyXdG', -- "student123"
   'approved', 'MA'),
  ('student-002', 'student', 'Amara Okafor', 'GEO/2024/002',
   'a.okafor@geoacademy.edu',
   '$2y$10$N3jl7bIhQD0A3SwBTv11H.9iRV8Wr6qCQn1e6bY4mBdU7YhFcJcZi', -- "student456"
   'pending', 'AO');

-- ── Seed: sample results for student-001 ─────────────────────
INSERT IGNORE INTO `results`
  (`student_id`, `subject`, `score`, `grade`, `term`, `session_year`, `created_by`)
VALUES
  ('student-001', 'Mathematics',       92, 'A1', '1st Term', '2024/2025', 'teacher-001'),
  ('student-001', 'English Language',  78, 'B2', '1st Term', '2024/2025', 'teacher-001'),
  ('student-001', 'Physics',           85, 'B1', '1st Term', '2024/2025', 'teacher-001'),
  ('student-001', 'Chemistry',         70, 'B3', '1st Term', '2024/2025', 'teacher-001'),
  ('student-001', 'Biology',           88, 'A2', '1st Term', '2024/2025', 'teacher-001');
