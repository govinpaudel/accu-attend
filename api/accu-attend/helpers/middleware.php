<?php
function authRequired() {
    if (!isset($_SESSION['user'])) {
        response(401, "Unauthorized");
    }
}

function roleRequired($roles) {
    if (!in_array($_SESSION['user']['role'], $roles)) {
        response(403, "Forbidden");
    }
}
