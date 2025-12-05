<?php
require 'db.php';

// Helper
function h($v) {
    return htmlspecialchars($v ?? '', ENT_QUOTES, 'UTF-8');
}

// search term from AJAX
$search = trim($_GET['q'] ?? '');

// Build SQL (same as landing.php)
$sql = "
    SELECT
        continual.id AS continual_id,
        continual.name AS series_name,
        MIN(YEAR(events.start_date)) AS first_year,
        MAX(YEAR(events.start_date)) AS last_year
    FROM continual
    LEFT JOIN continual_events
        ON continual.id = continual_events.continual_id
    LEFT JOIN events
        ON continual_events.pdga_event_id = events.pdga_event_id
";

if ($search !== '') {
    $safe = $conn->real_escape_string($search);
    $sql .= " WHERE continual.name LIKE '%$safe%' ";
}

$sql .= "
    GROUP BY continual.id, continual.name
    ORDER BY continual.name
    LIMIT 15
";

$result = $conn->query($sql);
if (!$result) {
    http_response_code(500);
    echo json_encode(["error" => $conn->error]);
    exit;
}

// Build JSON response
$output = [];
while ($row = $result->fetch_assoc()) {
    $output[] = [
        "continual_id" => (int)$row["continual_id"],
        "series_name" => $row["series_name"],
        "first_year" => (int)$row["first_year"],
        "last_year" => (int)$row["last_year"]
    ];
}

header("Content-Type: application/json");
echo json_encode($output);
?>
