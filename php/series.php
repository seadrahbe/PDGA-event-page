<?php

// ------------------------------------- //

// this connects this php page to mysql database
require 'db.php';

//function for safely printing data into html
function h($value) {
    return htmlspecialchars($value ?? '', ENT_QUOTES, 'UTF-8');
}

// function to replace null w/ n/a
function displayOrNA($value) {
    return ($value === null || $value === '' || $value === '0')
        ? 'N/A'
        : $value;
}

// Read continual_id from URL
if (!isset($_GET['continual_id'])) {
    die('No series selected.');
}

$continualId = (int)$_GET['continual_id'];

//Look up the series info
$seriesSql = "
    SELECT id, name, code, alt_name
    FROM continual
    WHERE id = $continualId
    LIMIT 1
";
$seriesResult = $conn->query($seriesSql);

if (!$seriesResult || $seriesResult->num_rows === 0) {
    die('Series not found.');
}

$series = $seriesResult->fetch_assoc();

$eventsSql = "
    SELECT
        events.pdga_event_id,
        events.event_name,
        events.start_date,
        events.end_date, 
        events.city,
        events.state,
        events.country,
        events.tier,
        events.website_url,
        events.tournament_director,
        SUM(event_results.cash) AS purse
    FROM events
    INNER JOIN continual_events
        ON events.pdga_event_id = continual_events.pdga_event_id
    LEFT JOIN event_results
        ON event_results.pdga_event_id = events.pdga_event_id
    WHERE continual_events.continual_id = $continualId
    GROUP BY
        events.pdga_event_id,
        events.event_name,
        events.start_date,
        events.end_date, 
        events.city,
        events.state,
        events.country,
        events.tier,
        events.website_url,
        events.tournament_director
    ORDER BY events.start_date DESC
";


$eventsResult = $conn->query($eventsSql);
if (!$eventsResult) {
    die('Database error: ' . $conn->error);
}
//---------------------------------------
// CHAMPIONS / players
$champsSql = "
    SELECT
        events.start_date,
        players.first_name,
        players.last_name,
        event_results.pdga_number,
        event_results.total_score,
        event_results.cash,
        events.pdga_event_id,
        events.website_url
    FROM event_results
    JOIN events
        ON events.pdga_event_id = event_results.pdga_event_id
    JOIN continual_events
        ON continual_events.pdga_event_id = events.pdga_event_id
    LEFT JOIN players
        ON players.pdga_number = event_results.pdga_number
    WHERE continual_events.continual_id = $continualId
      AND (event_results.place = '1' OR event_results.place = '1st')
      AND (event_results.division IS NULL OR event_results.division = 'MPO')
    ORDER BY events.start_date DESC
";

$champsResult = $conn->query($champsSql);
if (!$champsResult) {
    die('Champions query error: ' . $conn->error);
}

//---------------- DIVISION DASHBOARD ----------------//

$selectedDivision = isset($_GET['division']) ? trim($_GET['division']) : null;


$divisionsSql = "
    SELECT DISTINCT event_results.division
    FROM event_results
    JOIN continual_events
        ON event_results.pdga_event_id = continual_events.pdga_event_id
    WHERE continual_events.continual_id = $continualId
      AND event_results.division IS NOT NULL
      AND event_results.division <> ''
    ORDER BY event_results.division
";

$divisionsResult = $conn->query($divisionsSql);
if (!$divisionsResult) {
    die('Divisions query error: ' . $conn->error);
}

$divisions = [];
while ($row = $divisionsResult->fetch_assoc()) {
    $divisions[] = $row['division'];
}


if ($selectedDivision === null && !empty($divisions)) {
    $selectedDivision = $divisions[0];
}

if ($selectedDivision !== null && !in_array($selectedDivision, $divisions)) {
    $selectedDivision = null;
}

$divisionResults = null;

if ($selectedDivision !== null) {
    $safeDivision = $conn->real_escape_string($selectedDivision);

 $divisionResultsSql = "
    SELECT
        events.start_date,
        events.event_name,
        event_results.place,
        event_results.pdga_number,
        event_results.total_score,
        event_results.cash,
        event_results.division,
        events.pdga_event_id,
        events.website_url,
        players.first_name,
        players.last_name
    FROM event_results
    JOIN continual_events
        ON event_results.pdga_event_id = continual_events.pdga_event_id
    JOIN events
        ON events.pdga_event_id = event_results.pdga_event_id
    LEFT JOIN players
        ON players.pdga_number = event_results.pdga_number
    WHERE continual_events.continual_id = $continualId
      AND event_results.division = '$safeDivision'
      AND event_results.place = 1            
    ORDER BY events.start_date DESC
";

    $divisionResults = $conn->query($divisionResultsSql);
    if (!$divisionResults) {
        die('Division results error: ' . $conn->error);
    }
}


//--------------------------------------//

// Count total events & total purse
// Need to add total purse and total players to this sql query or make new one
$countSql = "
    SELECT COUNT(*) AS event_count
    FROM events
    INNER JOIN continual_events
        ON events.pdga_event_id = continual_events.pdga_event_id
    WHERE continual_events.continual_id = $continualId
";

$totalPurseSql = "
    SELECT total_purse
    FROM event_webpage
    WHERE event_webpage.continual_id = $continualId
";

$countResult = $conn->query($countSql);
if (!$countResult) {
    die('Count query error: ' . $conn->error);
}

$totalPurseResult = $conn->query($totalPurseSql);
if (!$totalPurseResult) {
    die('Total purse error: ' . $conn->error);
}

$eventStats = $countResult->fetch_assoc();
$eventCount = (int)($eventStats['event_count'] ?? 0);

// Added total purse result - Seadrah 11/21/25
$eventStat2 = $totalPurseResult->fetch_assoc();
$totalPurse = (int)($eventStat2['total_purse'] ?? 0);

// Add formatting
$totalPurse = "$".number_format($totalPurse);

// LOGO - Seadrah 11/21/25

$logoSql = "
    SELECT logo
    FROM event_webpage
    WHERE event_webpage.continual_id = $continualId
";

$logoResult = $conn->query($logoSql);
if (!$logoResult) {
    die('Logo error: ' . $conn->error);
}

$logoFetch = $logoResult->fetch_assoc();
$logo = ($logoFetch['logo'] ?? '../image/placeholder_logo.png');


// PLAYERS - Seadrah 11/21/25
// note - total players is the individual count of all participants in this event over time


$playersSql = "
    SELECT COUNT(DISTINCT event_results.pdga_number) AS player_total
    FROM event_results
    JOIN continual_events 
    ON continual_events.pdga_event_id = event_results.pdga_event_id
    JOIN continual 
    ON continual.id = continual_events.continual_id
    WHERE continual.id = $continualId;
";

$playersResult = $conn->query($playersSql);
if (!$playersResult) {
    die('Players error: ' . $conn->error);
}

$playersFetch = $playersResult->fetch_assoc();
$totalPlayers = ($playersFetch['player_total'] ?? 0);

// COURSE MAP - Seadrah 11/22/25

$mapSql = "
    SELECT course_map
    FROM event_webpage
    WHERE continual_id = $continualId;
";

$mapResult = $conn->query($mapSql);
if (!$mapResult) {
    die('Course map error: ' . $conn->error);
}

$mapFetch = $mapResult->fetch_assoc();
$map = ($mapFetch['course_map'] ?? 'https://operaparallele.org/wp-content/uploads/2023/09/Placeholder_Image.png');


// FEATURED EVENTS - Seadrah 11/22/25

$featuredSql = "
    SELECT ew.*, 
           MIN(YEAR(events.start_date)) AS first_year, 
           MAX(YEAR(events.start_date)) AS last_year
    FROM featured_webpage
    JOIN event_webpage ew ON ew.continual_id = featured_webpage.featured_event_id
    JOIN continual_events ON continual_events.continual_id = ew.continual_id
    JOIN events ON events.pdga_event_id = continual_events.pdga_event_id
    WHERE featured_webpage.event_id = $continualId
    GROUP BY ew.continual_id
";


$featuredResult = $conn->query($featuredSql);
if (!$featuredResult) {
    die('Featured events query error: ' . $conn->error);
}

$featuredEvents = [];
while ($row = $featuredResult->fetch_assoc()) {
    $featuredEvents[] = $row;
}


// EDIT MODAL SEARCH SECTION

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
    
    <!-- added JS links - Seadrah 11/21/25 -->
    <script src="../JS/sprint.js" defer></script>
    <script src="../JS/editv2.js" defer></script>
    
    <title><?php echo h($series['name']); ?> – Years</title>

</head>
<body>
    <!-- header -->
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
<!------------------------------------------->

 <!-- the start of the tool bar banner -->
<div class="series-toolbar-outer">
  <div class="series-toolbar">

    <!-- back to all events button-->
    <a id="back" href="landing.php">&larr; Back to all series</a>

    <!-- Search Bar-->
    <form class="series-search-form" method="get" action="landing.php">
      <div id="seriesSearchBar">
        <input
          id="seriesSearchInput"
          type="text"
          name="q"
          placeholder="Search by series name..."
          value="<?php echo h($search); ?>"
        >
        <button id="seriesSearchButton" type="submit">Search</button>
      </div>
    </form>

    <!-- Edit Button -->
    <button id="editButton" data-event-title="USDGC">Edit</button>
  </div>
</div>

<!-- this panel and content stop the boxes from going across the page -->
  <section id="content">
            <div id="panel">

                <!-- header for event name/ white box-->
                    <div id='top'>
                        <!-- Adding back logo placeholder - Seadrah 11/21/25 -->
                     <img id='event_logo' width=100px
                        src=
                        
                        "<?php echo $logo; ?>"
                        
                        />
                        <div id='event_header'>
                          
                            <h1 id='event_title'><?php echo h($series['name']); ?> </h1>
                        </div>
                     </div>
                    </div>
                    
                  
      <!-- EVENT SNAPSHOT -->
                     <section class="usdgc-intro">
                        <ul id="eventSnapshot">
                           <li class="stat">
                            <strong>Iterations Counted:</strong>
                            <span class="value">
                              <?php echo $eventCount; ?>
                            </span>
                           </li>
                           <li class="stat">
                              <strong>Total Purse:</strong>
                              <span class="value">
                                  <!-- call totalPurse variable -->
                                  <?php echo $totalPurse; ?></span>
                            </li>
                            <li class="stat">
                              <strong>Total Players:</strong>
                              <span class="value">
                                  <!-- call totalPlayer variable -->
                                  <?php echo $totalPlayers; ?></span>
                            </li>
                        </ul>
                    </section>
           <!--Adding this section back in -- will eventually default to "hidden" if no upcoming event info available, I also need to connect to the SQL table - Seadrah 11/21/25-->


           <h5 class = 'section_title'>Upcoming Event</h5>
           
            <div id="upcoming">
              <!--<h5 class = 'section_title'>Upcoming Event</h5>-->
              <div id="up_events">
             <!--   <table id="upcoming_table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Date</th>
                      <th>Pro Purse</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                        <!-- removed usdgc  changed to TBD and left date as 2026
                      <td>TBD</td>
                      <td>2026</td>
                      <td>TBD</td>
                    </tr>
                  </tbody>
                </table> -->
              </div>
            </div>



<!-- table html for past events -->
                <section class="cardWinner">
                    <h5 class = 'section_title'>Past Events</h5>

                    <div class="table-wrapper">
                        <table id="events">
                            <thead>
                                <tr>
                                    <th>Year</th>
                                    <th>Event</th>
                                    <th>Dates</th>
                                    <th>Total Purse</th>
                                    <th>Tournament Director</th>
                                    <th>Location</th>
                                </tr>
                            </thead>
                            <tbody>
    <?php while ($row = $eventsResult->fetch_assoc()): ?>
        <?php
            // Year from start_date
            $year = '';
            if (!empty($row['start_date'])) {
                $year = substr($row['start_date'], 0, 4);
            }

            // Date range text
            $datesText = '';
            if (!empty($row['start_date']) && !empty($row['end_date'])) {
                $datesText = $row['start_date'] . ' – ' . $row['end_date'];
            } elseif (!empty($row['start_date'])) {
                $datesText = $row['start_date'];
            }

            // Total purse formatting
            $purseText = '—';
            if (isset($row['purse']) && $row['purse'] != 0) {
                $purseText = '$' . number_format((float)$row['purse'], 0);
            }

            // PDGA URL (used for clickable event name)
            $pdgaUrl = $row['website_url'];
            if ($pdgaUrl === null || $pdgaUrl === '') {
                if (!empty($row['pdga_event_id'])) {
                    $pdgaUrl = 'https://www.pdga.com/tour/event/' . (int)$row['pdga_event_id'];
                } else {
                    $pdgaUrl = '';
                }
            }

            // Tournament Director
            $tdName = trim($row['tournament_director']);
            // n/a for null results
            if ($tdName === '' || $tdName === '0' || $tdName === null) {
            $tdName = 'N/A';
            }

            // Location: City, State, Country (skip empties nicely)
            $parts = [];
            if (!empty($row['city']))    { $parts[] = $row['city']; }
            if (!empty($row['state']))   { $parts[] = $row['state']; }
            if (!empty($row['country'])) { $parts[] = $row['country']; }
            $locationText = !empty($parts) ? implode(', ', $parts) : '—';
        ?>
        <tr>
            <td><?php echo h($year); ?></td>

            <!-- Event name is clickable -->
            <td>
                <?php if ($pdgaUrl): ?>
                    <a href="<?php echo h($pdgaUrl); ?>" target="_blank">
                        <?php echo h($row['event_name']); ?>
                    </a>
                <?php else: ?>
                    <?php echo h($row['event_name']); ?>
                <?php endif; ?>
            </td>

            <td><?php echo h($datesText); ?></td>
            <td><?php echo h($purseText); ?></td>
            <td><?php echo h($tdName); ?></td>
            <td><?php echo h($locationText); ?></td>
        </tr>
    <?php endwhile; ?>
</tbody>
 </table>
 </div>
 </section>
                

<!---------Winner's Table---------------->                
<section class="cardChampions">
    <h5 class = 'section_title'><?php echo h($series['name']); ?> Champions </h5>
    <div class="table-wrapper">
        <table id="series_champions">
            <thead>
                <tr>
                    <th>Year</th>
                    <th>Winner</th>
                    <th>PDGA #</th>
                    <th>Total</th>
                    <th>Cash</th>
                    <th>PDGA</th>
                </tr>
            </thead>
            <tbody>
                <?php while ($champ = $champsResult->fetch_assoc()): ?>
                    <?php
                        // Year from events.start_date
                        $year = '';
                        if (!empty($champ['start_date'])) {
                            $year = substr($champ['start_date'], 0, 4);
                        }

                        // Winner from players.first_name + players.last_name
                        $winner = trim(
                            ($champ['first_name'] ?? '') . ' ' . ($champ['last_name'] ?? '')
                        );
                        if ($winner === '') {
                            $winner = 'Unknown';
                        }

                        // PDGA # and total score directly from event_results
                        $pdgaNum = $champ['pdga_number'] ?? '';
                        $total   = $champ['total_score'] ?? '';

                        // Cash payout from event_results.cash
                        $cashNum = $champ['cash'] ?? null;
                        if ($cashNum === null || $cashNum === '' || $cashNum == 0) {
                            $cashText = '—';
                        } else {
                            $cashText = '$' . number_format((float)$cashNum, 0);
                        }

                        // PDGA URL: use events.website_url, or build from pdga_event_id
                        $pdgaUrl = $champ['website_url'];
                        if ($pdgaUrl === null || $pdgaUrl === '') {
                            if (!empty($champ['pdga_event_id'])) {
                                $pdgaUrl = 'https://www.pdga.com/tour/event/' . (int)$champ['pdga_event_id'];
                            } else {
                                $pdgaUrl = '';
                            }
                        }
                    ?>
                    <tr>
                        <td><?php echo h($year); ?></td>
                        <td><?php echo h($winner); ?></td>
                        <td><?php echo h($pdgaNum); ?></td>
                        <td><?php echo h($total); ?></td>
                        <td><?php echo h($cashText); ?></td>
                        <td>
                            <?php if ($pdgaUrl): ?>
                                <a href="<?php echo h($pdgaUrl); ?>" target="_blank">Link</a>
                            <?php else: ?>
                                —
                            <?php endif; ?>
                        </td>
                    </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    </div>
</section>

   
               
                
                <!-- Added this back in for graphs -- this would be Asma's workspace for improving the graphs with JavaScript or php as preferred! - Seadrah 11/21/25 -->
                
                  <!-- graph section-->
                <section class="graphs">
                    <div class="graphcontainer">
                        <figure>
                            <h3>Total Prize Purse by Year</h3>
                            <!-- ECharts container -->
                            <div id="cashChart"></div>
                            <figcaption>Total prize purse by year</figcaption>
                        </figure>
                        <figure>
                            <h3>Average Total Score by Year</h3>
                            <!-- ECharts container -->
                            <div id="ratingChart"></div>
                            <figcaption>Average total score by year</figcaption>
                        </figure>
                         <!--new changes added -->
                            <figure>
                               <h3>Field Size (Players) by Year</h3>
                               <div id="playersChart"></div>
                               <figcaption>Number of unique players per year</figcaption>
                            </figure>
                                  <figure>
                                      <h3>Average Prize per Player by Year</h3>
                                      <div id="prizePerPlayerChart"></div>
                                      <figcaption>Average prize money per player by year</figcaption>
                                  </figure>
                                  <figure>
                                      <h3>Highest Round Rating by Year</h3>
                                      <div id="highestRoundRatingChart"></div>
                                      <figcaption>Highest round rating recorded per year</figcaption>
                                  </figure>
                            </div>
                            <!--new changes added -->
                            <style>
                                .graphcontainer #cashChart,
                                .graphcontainer #ratingChart,
                                .graphcontainer #playersChart,
                                .graphcontainer #prizePerPlayerChart,
                                .graphcontainer #highestRoundRatingChart { width:100%; height:320px; }
                            </style>
                </section>
                
                 <!-- PapaParse + ECharts -->
                <script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>
                 <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
                <!--end of graph section-->
                
             
                
              <!-- DIVISION DASHBOARD -->
<section class="division-dashboard" id="division-dashboard">
    <h5 class = 'section_title'>Division Results</h5>

    <!-- Division buttons -->
        <div class="division-buttons-scroller">
    <div class="division-buttons">
        <?php if (!empty($divisions)): ?>
            <?php foreach ($divisions as $div): ?>
                <?php $isActive = ($div === $selectedDivision); ?>
                <a
                    class="division-pill <?php echo $isActive ? 'active' : ''; ?>"
                    href="series.php?continual_id=<?php echo (int)$continualId; ?>&division=<?php echo urlencode($div); ?>#division-dashboard"
                >
                    <?php echo h($div); ?>
                </a>
            <?php endforeach; ?>
        <?php else: ?>
            <p class="no-divisions-note">No division results found for this series.</p>
        <?php endif; ?>
    </div>
    </div>

    <!-- Results table for selected division -->
    <?php if ($selectedDivision !== null && $divisionResults && $divisionResults->num_rows > 0): ?>
       <!-- <div class="table-wrapper">-->
            <table id="division_results">
                <thead>
                    <tr>
                        <th>Year</th>
                    
                        <th>Place</th>
                        <th>Player</th>
                        <th>PDGA #</th>
                        <th>Total</th>
                        <th>Cash</th>
                    </tr>
                </thead>
                <tbody>
    <?php while ($row = $divisionResults->fetch_assoc()): ?>
        <?php
        
            $na = function ($value) {
                return ($value === null || $value === '' ) ? 'N/A' : $value;
            };

            // Year from events.start_date
            if (!empty($row['start_date'])) {
                $year = substr($row['start_date'], 0, 4);
            } else {
                $year = 'N/A';
            }

            // Player name from players table
            $playerName = trim(
                ($row['first_name'] ?? '') . ' ' . ($row['last_name'] ?? '')
            );
            if ($playerName === '') {
                $playerName = 'N/A';
            }

            // Core fields with N/A fallback
            $pdgaNum = $na($row['pdga_number'] ?? null);
            $place   = $na($row['place'] ?? null);
            $total   = $na($row['total_score'] ?? null);

            // Cash formatting with N/A fallback
            $cashNum = $row['cash'] ?? null;
            if ($cashNum === null || $cashNum === '' || $cashNum == 0) {
                $cashText = 'N/A';
            } else {
                $cashText = '$' . number_format((float)$cashNum, 0);
            }

            // PDGA event URL (same logic you had)
            $pdgaUrl = $row['website_url'];
            if ($pdgaUrl === null || $pdgaUrl === '') {
                if (!empty($row['pdga_event_id'])) {
                    $pdgaUrl = 'https://www.pdga.com/tour/event/' . (int)$row['pdga_event_id'];
                } else {
                    $pdgaUrl = '';
                }
            }
        ?>
        <tr>
            <td><?php echo h($year); ?></td>
            <td><?php echo h($place); ?></td>
            <td><?php echo h($playerName); ?></td>
            <td><?php echo h($pdgaNum); ?></td>
            <td><?php echo h($total); ?></td>
            <td><?php echo h($cashText); ?></td>
        </tr>
    <?php endwhile; ?>
</tbody>
            </table>
       <!-- </div>-->
    <?php elseif (!empty($divisions)): ?>
        <p class="no-results-note">
            No results found for division <?php echo h($selectedDivision); ?>.
        </p>
    <?php endif; ?>
</section>
<!-- END DIVISION DASHBOARD -->

          
                
                <!-- Added back where to watch section + course map section. Will connect course map to SQL src image, make editable upload - Seadrah 11/21/25 -->
                <section class="watch">
                <h5>Where To Watch </h5>
                <ul id="broadcasting">
                    <li>
                        <a class="has-icon" href="https://www.youtube.com/discgolfprotour">
                          <img class="brand-icon" src="https://cdn-icons-png.flaticon.com/128/1384/1384060.png" alt="" aria-hidden="true">
                          YouTube
                        </a>
                      </li>
                      <li>
                        <a class="has-icon" href="https://www.discgolfnetwork.com/">
                          <img class="brand-icon" src="https://upload.wikimedia.org/wikipedia/en/thumb/f/fa/Disc_Golf_Pro_Tour_Logo.svg/1200px-Disc_Golf_Pro_Tour_Logo.svg.png" alt="" aria-hidden="true">
                          Disc Golf Network
                        </a>
                      </li>
                    </ul>
                 </section>
                 <!-- end of where to watch section -->
                 
                <!--course map inspo from f1-->
                <!-- Note to self - make scalable, add field to SQL table for course map-->
                <section class="map">
                   <h5>Course Map</h5>
                    <img class="course" src=
                    <?php echo $map; ?>
                    alt="course map">
                </section>
                <!--end of course map section -->
                
        <!-- Added back featured events area -- will make scalable using php & SQL, will also default to hidden if no events featured - Seadrah -->
        
        <!-- FEATURED EVENTS AREA (Seadrah)-->
        
   


        <!-- On main page (BEFORE edit form) -->
        <section id="featured_events">
            <h2>Featured Events</h2>
            <div class = "featured-scroll-container">
                <?php foreach ($featuredEvents as $event): ?>
                    <div class="featured-tile" data-continual-id="<?php echo $event['continual_id']; ?>">
                        <h3><?= h($event['title']) ?></h3>
                        <div><?= h($event['first_year']) ?> - <?= h($event['last_year']) ?></div>
                        <div><?= h("$". number_format($event['total_purse'])) ?></div>
                    </div>
                <?php endforeach; ?>
            </div>
            <div class="featured-empty">
            </div>
        </section>



<!-- footer -->
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
    </div>
    

    <div id="modalOverlay" class="modal-overlay">
        <div class="modal-container">
            <div class="modal-header">
                <h2>Edit Event</h2>
                <button class="modal-close" aria-label="Close modal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="event_form" name="event_form" action="insert.php" method="POST">
                    <!-- hidden continual id input -->
                    <input type="hidden" name="continual_id" value="<?php echo $continualId; ?>">
                    <div id="logo_upload_wrapper">
                        <div id="img_wrap">
                            <img id="event_logo_input" src="<?php echo $logo; ?>" alt="Event Logo" />
                        </div>
                        <input type="file" id="logo_upload_input" name="logo_upload_input" accept="image/*" style="display: none;">
                        <button id = "logo_upload_button" class = 'btn-primary'>Upload Logo</button>
                    </div>
                    
                    <div class="mb-5 row">
                        <div class="col">
                            <label>Title</label>
                            <input type="text" maxlength="50" class="form-control" id="event_title_input" name="event_title_input">
                        </div>
                    </div>
                    
                    <h2>Course Map Upload</h2>
                    <div id="map_upload_wrapper">
                        <div id="map_wrap">
                            <img id="course_map_input" src="<?php echo $map; ?>" alt="Event Map" />
                        </div>
                        <input type="file" id="map_upload_input" name="map_upload_input" accept="image/*" style="display: none;">
                        <button id = "map_upload_button" class = 'btn-primary'>Upload Map</button>
                    </div>
    
                    <h2 id="featured_events_edit">Featured Events</h2>
                    <div class="dbwinnertable_edit">
                        <section class="cardWinner_edit" id="featured_events_input_section">
                            <h3 id='featured-edit-add-h3' style="text-align: left; margin-bottom: 0.5rem;">Add Featured Events</h3>
                            <p style="color: #666; font-size: 0.9rem; margin-bottom: 1.5rem; text-align: left;">
                                Search for events to feature on the main page
                            </p>
                          <div style="margin-bottom: 1.5rem;">
                            <div id="featured_suggestions_container" style="position: relative; margin-bottom: 1rem;">
                                <input
                                    type="text"
                                    id="featured_search_input"
                                    name="q"
                                    placeholder="Search by series name (USDGC, MVP, etc.)..."
                                    value="<?php echo h($search); ?>"
                                >
                                <div id="featured_suggestions"></div>
                                <button id="seriesSearchButton" type="button">Search</button>
                            </div>
                            
                            <input type="hidden" id="featured_events_input" name="featured_events_input" value="[]">
                            
                            <button type="button" id="add_featured_btn"
                                style="padding: 8px 15px; background: #142b42; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 0.9rem; display: block; width: 100%; max-width: 200px;">
                                + Add to Featured
                            </button>
                        </div>
                            <div id="current_featured_list" style="margin-top: 2rem; padding: 1rem; background: #f9f9f9; border-radius: 4px;">
                                <h4 style="margin-bottom: 1rem; text-align: left;">Currently Featured:</h4>
                                <ul id="featured_list_items" style="list-style: none; padding: 0; margin: 0;"></ul>
                            </div>
                        </section>
                    </div>
    
                    <button type="submit" class="btn btn-primary px-4 btn-lg">Submit</button>
                </form>
            </div>
        </div>
    </div>


</body>
</html>
