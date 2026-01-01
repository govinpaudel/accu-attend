<?php
require_once __DIR__ . "/../helpers/geo.php";

class AttendanceController {
    public static function mark() {
        global $conn;
        $user = $_SESSION['user'];

        $lat = $_POST['lat'];
        $lng = $_POST['lng'];

        $store = getAssignedStore($user['id']);
        $distance = distance(
            $lat, $lng,
            $store['latitude'], $store['longitude']
        );

        if ($distance > $store['radius']) {
            response(403, "Outside store location");
        }

        $photoName = time()."_".$_FILES['photo']['name'];
        move_uploaded_file(
            $_FILES['photo']['tmp_name'],
            "uploads/".$photoName
        );

        $stmt = $conn->prepare(
            "INSERT INTO attendance
            (org_id, store_id, user_id, type, latitude, longitude, photo, datetime)
            VALUES (?,?,?,?,?,?,?,NOW())"
        );

        $stmt->bind_param(
            "iiissss",
            $user['org_id'],
            $store['id'],
            $user['id'],
            $_POST['type'],
            $lat,
            $lng,
            $photoName
        );

        $stmt->execute();
        response(200, "Attendance marked");
    }
}
