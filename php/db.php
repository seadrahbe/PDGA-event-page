<?php
// connects mySQL database 

$host   = "localhost";      
$user   = "datastor_pdgauser";   
$pass   = "datastoryrocks";    
$dbname = "datastor_pdga_data";    

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}
?>
