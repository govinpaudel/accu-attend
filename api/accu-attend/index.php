<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once __DIR__ . "/config/db.php";
require_once __DIR__ . "/config/auth.php";
require_once __DIR__ . "/helpers/response.php";
require_once __DIR__ . "/helpers/middleware.php";
require_once __DIR__ . '/helper/jwt_helper.php';

/* Controllers */
require_once __DIR__ . "/controllers/AuthController.php";
require_once __DIR__ . "/controllers/AttendanceController.php";
require_once __DIR__ . "/controllers/StoreController.php";
require_once __DIR__ . "/controllers/ShiftController.php";
require_once __DIR__ . "/controllers/RosterController.php";

/* ROUTER */
$method = $_SERVER['REQUEST_METHOD'];
$path   = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path   = str_replace("/api", "", $path); // adjust if needed

try {

    /* ---------- AUTH ---------- */
    if ($path === "/login" && $method === "POST") {
        AuthController::login();
    }

    /* ---------- ATTENDANCE ---------- */
    elseif ($path === "/attendance" && $method === "POST") {
        authRequired();
        AttendanceController::mark();
    }

    /* ---------- STORES ---------- */
    elseif ($path === "/stores" && $method === "GET") {
        authRequired();
        StoreController::list();
    }

    /* ---------- SHIFTS ---------- */
    elseif ($path === "/shifts" && $method === "GET") {
        authRequired();
        ShiftController::list();
    }

    /* ---------- DUTY ROSTER ---------- */
    elseif ($path === "/roster" && $method === "POST") {
        authRequired();
        roleRequired(['ADMIN']);
        RosterController::assign();
    }

    /* ---------- DEFAULT ---------- */
    else {
        response(404, "Route not found");
    }

} catch (Exception $e) {
    response(500, $e->getMessage());
}
