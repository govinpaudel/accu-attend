<?php
date_default_timezone_set("Asia/Kathmandu");
if (!headers_sent()) {
    header("Content-Type: application/json; charset=UTF-8");
    // header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
}

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "db_accuattend.php";
require_once "jwt_helper.php";

// -----------------------------
// Parse the request
// -----------------------------
$basePath = "/api/accuattend"; 
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = preg_replace("#^$basePath#", "", $path);
$path = rtrim($path, "/");
$path = ltrim(strtolower($path), "/");  
$pathParts = $path === "" ? [] : explode("/", $path);
$method = $_SERVER['REQUEST_METHOD'];

// -----------------------------
// Routing
// -----------------------------
if ($method === "GET") {
    switch ($pathParts[0] ?? "") {
        default:
            notFound();
    } 
}
elseif ($method === "POST") {
    switch ($pathParts[0] ?? "") {
    case "signup":
        signup();
        break;
    case "login":
        login();
        break;
    default:
        notFound();
    }
}
else {
    methodNotAllowed();
}

function login() {
    $pdo = getPDO();
    if (!$pdo) dbUnavailable("Main");

    $input = json_decode(file_get_contents("php://input"), true);

    $username = $input['username'] ?? null;
    $password = $input['password'] ?? null;

    if (!$username) invalidInput("username");
    if (!$password) invalidInput("password");

    try {
        $sql = "SELECT a.*,b.name,b.license_expiry_date                      
                FROM users a
                INNER JOIN organizations b ON a.org_id = b.id                
                WHERE a.username = :username";

        $stmt = $pdo->prepare($sql);
        $stmt->execute(["username" => $username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // -----------------------------
        // No user found
        // -----------------------------
        if (!$user) {
            http_response_code(401);
            echo json_encode([
                "status" => false,
                "message" => "प्रयोगकर्ता वा पासवर्ड मिलेन ।"
            ]);
            exit();
        }

        // -----------------------------
        // User inactive
        // -----------------------------
        if ($user["is_active"] == 0) {
            http_response_code(401);
            echo json_encode([
                "status" => false,
                "message" => "प्रयोगकर्ता सक्रिय गरिएको छैन । कृपया व्यवस्थापकलाई सम्पर्क गर्नुहोला ।"
            ]);
            exit();
        }

        // -----------------------------
        // Password mismatch
        // -----------------------------
        if (!password_verify($password, $user['password'])) {
            http_response_code(401);
            echo json_encode([
                "status" => false,
                "message" => "प्रयोगकर्ता वा पासवर्ड मिलेन ।"
            ]);
            exit();
        }

        // Remove hashed password
        unset($user['password']);

        // -----------------------------
        // Simple plain PHP token generator
        // -----------------------------
        function generateToken($uid) {
            return bin2hex(random_bytes(24)) . "_" . $uid;
        }

        $accessToken  = generateToken($user['id']);
        $refreshToken = generateToken($user['id']);

        // -----------------------------
        // Success Response
        // -----------------------------
        echo json_encode([
            "status" => true,
            "access_token" => $accessToken,
            "refresh_token" => $refreshToken,
            "data" => $user,
            "message" => "सफलतापूर्वक लगईन भयो ।"
        ]);
        exit();

    } catch (Exception $e) {
        respondDbError($e);
    }
}

function notFound() { http_response_code(404); echo json_encode(["status"=>false,"message"=>"Not Found"]); exit(); }
function methodNotAllowed() { http_response_code(405); echo json_encode(["status"=>false,"message"=>"Method Not Allowed"]); exit(); }
function respondDbError($e) { http_response_code(500); echo json_encode(["status"=>false,"message"=>"Database Error","error"=>$e->getMessage()]); exit(); }
function dbUnavailable($type) { http_response_code(500); echo json_encode(["status"=>false,"message"=>"$type database not available"]); exit(); }
function invalidInput($field) { http_response_code(400); echo json_encode(["status"=>false,"message"=>"Invalid input: $field"]); exit(); }
?>
