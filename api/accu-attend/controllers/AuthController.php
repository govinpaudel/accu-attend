<?php
class AuthController {
    public static function login() {
        global $conn;

        $data = json_decode(file_get_contents("php://input"), true);

        $stmt = $conn->prepare(
            "SELECT * FROM users WHERE username=? AND is_active=1"
        );
        $stmt->bind_param("s", $data['username']);
        $stmt->execute();
        $user = $stmt->get_result()->fetch_assoc();

        if (!$user || !password_verify($data['password'], $user['password'])) {
            response(401, "Invalid credentials");
        }

        $_SESSION['user'] = $user;

        response(200, "Login successful", [
            "id" => $user['id'],
            "role" => $user['role'],
            "org_id" => $user['org_id']
        ]);
    }
}
