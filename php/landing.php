<?php

// Connect to the database
require 'db.php';

// Helper function
function h($value) {
    return htmlspecialchars($value ?? '', ENT_QUOTES, 'UTF-8');
}

// Read search term from URL if it exists
$search = '';
if (isset($_GET['q'])) {
    $search = trim($_GET['q']);
}

// Build SQL query
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

// Add search filter if typed
if ($search !== '') {
    $safe = $conn->real_escape_string($search);
    $sql .= "
        WHERE continual.name LIKE '%$safe%'
    ";
}

// Group + sort
$sql .= "
    GROUP BY continual.id, continual.name
    ORDER BY continual.name
";

// 7. Run the query
$result = $conn->query($sql);
if (!$result) {
    die('Database error: ' . $conn->error);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
     <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../CSS/style.css">
    <link rel="stylesheet" href="../CSS/usdgc.css">
    <link rel="stylesheet" href="../CSS/edit.css">
    <link rel="stylesheet" href="../CSS/landing.css">
    <title>Continual Event Series</title>
   
</head>
<body>
    <header>
        <nav class="topbar">
            <a class="brand" href="/">
                <img id='logo' src="https://www.pdga.com/sites/all/themes/pdga/logo.png" alt="pdga logo" />
            </a>
            <ul class="mainnav">
                <li><a class="btn" href="https://www.pdga.com/" target="_blank">Home</a></li>
                <li><a class="btn" href="https://www.pdga.com/membership" target="_blank">Membership</a></li>
                <li><a class="btn" href="https://www.pdga.com/tour/events" target="_blank">Events</a></li>
                <li><a class="btn" href="https://discgolfunited.com/usdgc" target="_blank">Shop</a></li>
                <li><a class="btn" href="https://www.pdga.com/user/login?destination=course-directory">Login</a>
                </li>
            </ul>
            <div class="actions">
                <button class="icon-btn" id="searchToggle" aria-label="Search">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        aria-hidden="true">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </button>
                <div class="search-box" id="searchBox">
                    <form action="https://www.pdga.com/search" method="get" target="_blank">
                        <input type="search" id="searchInput" name="keywords" placeholder="Search PDGA…" />
                    </form>
                </div>
            </div>
            <div class="menu-wrapper">
                <button class="icon-btn menu-toggle" aria-label="Menu" aria-expanded="false">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        aria-hidden="true">
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
                <div class="menu-dropdown" role="menu">
                    <a href="https://www.pdga.com/introduction" role="menuitem">About</a>
                    <a href="https://www.pdga.com/rules" role="menuitem">Rules</a>
                    <a href="https://www.pdga.com/international" role="menuitem">International</a>
                    <a href="https://www.pdga.com/course-directory" role="menuitem">Courses</a>
                </div>
            </div>
        </nav>
    </header>
        <section id='content'>
            <div id='panel'>
                <div class="series-toolbar-outer">
              <div class="series-toolbar landing-toolbar">

<h1 class="series-main-title">Continual Disc Golf Series</h1>


<form class="series-search-form"  method="get" action="landing.php">
    <input
        type="text"
        name="q"
        placeholder="Search by series name (USDGC, MVP, etc.)..."
        value="<?php echo h($search); ?>"
    >
    <button type="submit">Search</button>
</form>
</div>
</div>

<?php if ($result->num_rows > 0): ?>
    <table>
        <thead>
        <tr>
         <th>Series</th>
        <th>Years</th>
        <th>View</th>
        </tr>
        </thead>
        <tbody>
        <?php while ($row = $result->fetch_assoc()): ?>

            <?php
                // Build year text like "1999 - 2024"
                $firstYear = $row['first_year'];
                $lastYear  = $row['last_year'];
                $yearText  = '';
                if ($firstYear && $lastYear) {
                    if ($firstYear == $lastYear) {
                        $yearText = $firstYear;
                    } else {
                        $yearText = $firstYear . ' - ' . $lastYear;
                    }
                }

                // Link to the series page 
                $seriesUrl = 'series.php?continual_id=' . (int)$row['continual_id'];
            ?>

            <tr>
                <td><?php echo h($row['series_name']); ?></td>
                <td><?php echo h($yearText); ?></td>
                <td><a href="<?php echo h($seriesUrl); ?>">View Series</a></td>
            </tr>

        <?php endwhile; ?>
        </tbody>
    </table>
<?php else: ?>
    <p class="no-results">
        No series found.
        <?php if ($search !== ''): ?>Try a different search term.<?php endif; ?>
    </p>
<?php endif; ?>
    </div>
        </section>
          

  <footer>
            <div class="pane-content">
                <img class="pdga-icon"
                    src="https://www.pdga.com/live/assets/pdga-favicon-green-white-transparent-7j3InFjR.svg"
                    alt="pdga logo">
                <p>Copyright © 1998-2025. Professional Disc Golf Association. All
                    Reserved.</p>
                <p>3828 Dogwood Lane, Appling, GA, USA 30802-3012 &mdash;
                    Phone:&nbsp;+1-706-261-6342</p>
                <ul class="footermedia">
                    <li><a class="btn" href="https://www.instagram.com/pdga/?hl=en" target="_blank">Instagram</a></li>
                    <li><a class="btn" href="https://www.facebook.com/pdga/" target="_blank">Facebook</a></li>
                    <li><a class="btn" href="https://x.com/pdga" target="_blank">X</a></li>
                    <li><a class="btn" href="https://www.linkedin.com/groups?gid=31030" target="_blank">LinkedIn</a>
                    </li>
                </ul>
            </div>
        </footer>
       
</body>
</html>
