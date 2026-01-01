<?php
require_once __DIR__ . '/../helpers/jwt_helper.php'; // ✅ FIXED

function getBearerToken() {
    $headers = getallheaders();
    if (!empty($headers['Authorization'])) {
        if (preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
            return $matches[1];
        }
    }
    return null;
}

function authRequired($roles = []) {
    try {
        $token = getBearerToken();
        if (!$token) {
            http_response_code(401);
            echo json_encode(['error' => 'Token missing']);
            exit;
        }

        $user = jwtDecode($token);

        if (!empty($roles) && !in_array($user['role'], $roles)) {
            http_response_code(403);
            echo json_encode(['error' => 'Access denied']);
            exit;
        }

        return $user;

    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['error' => $e->getMessage()]);
        exit;
    }
}
