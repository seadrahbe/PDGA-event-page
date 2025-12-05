<?php
// INSERT DATA INTO DATABASE
require 'db.php';

// Collect form data
$continual_id = (int)$_POST['continual_id'];
$title_input = mysqli_real_escape_string($conn, $_POST['event_title_input'] ?? '');
$courseMap = mysqli_real_escape_string($conn, $_POST['course_map_input'] ?? '');

echo $courseMap;

// Handle logo (keep existing if no new upload)
$logo_input = '';
$logoQuery = "SELECT logo FROM event_webpage WHERE continual_id = $continual_id";
$logoResult = $conn->query($logoQuery);
if ($logoResult && $row = $logoResult->fetch_assoc()) {
    $logo_input = $row['logo'];
}

if ($logoResult == "") {
    $logoResult = null;
}

// Decode featured events JSON
$featuredEventsJson = $_POST['featured_events_input'] ?? '[]';
$featuredEvents = json_decode($featuredEventsJson, true);

// Start transaction
$conn->begin_transaction();

try {
    // 1. Update or Insert event_webpage
    $checkSql = "SELECT continual_id FROM event_webpage WHERE continual_id = $continual_id";
    $checkResult = $conn->query($checkSql);
    
    if ($checkResult && $checkResult->num_rows > 0) {
        $sqlUpdate = "UPDATE event_webpage SET logo = '$logo_input', title = '$title_input', course_map = '$courseMap' WHERE continual_id = $continual_id";
        if (!$conn->query($sqlUpdate)) {
            throw new Exception("Error updating: " . $conn->error);
        }
    } else {
        $sqlInsert = "INSERT INTO event_webpage (continual_id, logo, title, course_map) VALUES ($continual_id, '$logo_input', '$title_input', '$courseMap')";
        if (!$conn->query($sqlInsert)) {
            throw new Exception("Error inserting: " . $conn->error);
        }
    }
    
    // 2. Clear old featured events
    $sqlClear = "DELETE FROM featured_webpage WHERE event_id = $continual_id";
    if (!$conn->query($sqlClear)) {
        throw new Exception("Error clearing featured: " . $conn->error);
    }
    
    // 3. Insert new featured events
    if (!empty($featuredEvents) && is_array($featuredEvents)) {
        $stmt = $conn->prepare("INSERT INTO featured_webpage (event_id, featured_event_id) VALUES (?, ?)");
        
        foreach ($featuredEvents as $event) {
            $featured_id = is_array($event) ? (int)$event['id'] : (int)$event;
            $stmt->bind_param("ii", $continual_id, $featured_id);
            
            if (!$stmt->execute()) {
                throw new Exception("Error inserting featured event: " . $stmt->error);
            }
        }
        $stmt->close();
    }
    
    $conn->commit();
    header("Location: series.php?continual_id=$continual_id&success=1");
    exit;
    
} catch (Exception $e) {
    $conn->rollback();
    echo "Error: " . $e->getMessage();
    echo "<br><a href='series.php?continual_id=$continual_id'>Go back</a>";
}

$conn->close();
?>