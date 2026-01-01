<?php
require_once __DIR__ . '/db.php';

try {

    /* ============================
       ORGANIZATIONS
    ============================ */
    $db->exec("
        CREATE TABLE IF NOT EXISTS organizations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(150) NOT NULL,
            license_expiry_date DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");

    /* ============================
       USERS
    ============================ */
    $db->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            org_id INT NULL,
            username VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('super_admin','admin','user') NOT NULL,
            is_active TINYINT DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (org_id) REFERENCES organizations(id)
                ON DELETE SET NULL
        )
    ");

    /* ============================
       STORES
    ============================ */
    $db->exec("
        CREATE TABLE IF NOT EXISTS stores (
            id INT AUTO_INCREMENT PRIMARY KEY,
            org_id INT NOT NULL,
            name VARCHAR(150) NOT NULL,
            latitude DECIMAL(10,7) NOT NULL,
            longitude DECIMAL(10,7) NOT NULL,
            radius INT DEFAULT 20,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (org_id) REFERENCES organizations(id)
                ON DELETE CASCADE
        )
    ");

    /* ============================
       SHIFTS
    ============================ */
    $db->exec("
        CREATE TABLE IF NOT EXISTS shifts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            org_id INT NOT NULL,
            name VARCHAR(100),
            start_time TIME NOT NULL,
            end_time TIME NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (org_id) REFERENCES organizations(id)
                ON DELETE CASCADE
        )
    ");

    /* ============================
       ROSTERS
    ============================ */
    $db->exec("
        CREATE TABLE IF NOT EXISTS rosters (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            store_id INT NOT NULL,
            shift_id INT NOT NULL,
            duty_date DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
            FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE CASCADE
        )
    ");

    /* ============================
       ATTENDANCE
    ============================ */
    $db->exec("
        CREATE TABLE IF NOT EXISTS attendance (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            store_id INT NOT NULL,
            type ENUM('IN','OUT','OT_IN','OT_OUT') NOT NULL,
            latitude DECIMAL(10,7) NOT NULL,
            longitude DECIMAL(10,7) NOT NULL,
            photo_path VARCHAR(255),
            device_id VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (store_id) REFERENCES stores(id)
        )
    ");

    /* ============================
       DEFAULT ORGANIZATION
    ============================ */
    $stmt = $db->prepare(
        "SELECT id FROM organizations WHERE name = ?"
    );
    $stmt->execute(['DEFAULT_ORG']);

    if (!$stmt->fetch()) {
        $db->prepare("
            INSERT INTO organizations (name, license_expiry_date)
            VALUES (?, ?)
        ")->execute([
            'DEFAULT_ORG',
            date('Y-m-d', strtotime('+5 years'))
        ]);
    }

    $orgId = $db->query(
        "SELECT id FROM organizations WHERE name='DEFAULT_ORG'"
    )->fetchColumn();

    /* ============================
       SUPER ADMIN
    ============================ */
    $username = 'super_admin';
    $password = 'SuperAdmin@1234$';

    $stmt = $db->prepare(
        "SELECT id FROM users WHERE username = ?"
    );
    $stmt->execute([$username]);

    if (!$stmt->fetch()) {
        $hash = password_hash($password, PASSWORD_BCRYPT);

        $db->prepare("
            INSERT INTO users (username, password, role, org_id)
            VALUES (?, ?, 'super_admin', ?)
        ")->execute([$username, $hash, $orgId]);
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Database initialized successfully'
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
