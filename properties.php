<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "keynest";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getProperties($conn);
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['action'])) {
            switch ($data['action']) {
                case 'add_property':
                    addProperty($conn, $data);
                    break;
                case 'update_property':
                    updateProperty($conn, $data);
                    break;
                case 'delete_property':
                    deleteProperty($conn, $data);
                    break;
            }
        }
        break;
}

function getProperties($conn) {
    $sql = "SELECT p.*, u.name as seller_name, u.mobile as seller_mobile, u.email as seller_email 
            FROM properties p 
            JOIN users u ON p.seller_id = u.id";
    $result = $conn->query($sql);
    
    $properties = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $properties[] = $row;
        }
    }
    
    echo json_encode($properties);
}

function addProperty($conn, $data) {
    $title = $data['title'];
    $price = $data['price'];
    $location = $data['location'];
    $beds = $data['beds'];
    $baths = $data['baths'];
    $area = $data['area'];
    $description = $data['description'];
    $seller_id = $data['seller_id'];
    $images = json_encode($data['images']);
    
    $sql = "INSERT INTO properties (title, price, location, beds, baths, area, description, seller_id, images) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sdsiissss", $title, $price, $location, $beds, $baths, $area, $description, $seller_id, $images);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Property added successfully", "id" => $stmt->insert_id]);
    } else {
        echo json_encode(["error" => "Failed to add property"]);
    }
    
    $stmt->close();
}

function updateProperty($conn, $data) {
    $id = $data['id'];
    $title = $data['title'];
    $price = $data['price'];
    $location = $data['location'];
    $beds = $data['beds'];
    $baths = $data['baths'];
    $area = $data['area'];
    $description = $data['description'];
    
    $sql = "UPDATE properties SET title = ?, price = ?, location = ?, beds = ?, baths = ?, area = ?, description = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sdsiissi", $title, $price, $location, $beds, $baths, $area, $description, $id);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Property updated successfully"]);
    } else {
        echo json_encode(["error" => "Failed to update property"]);
    }
    
    $stmt->close();
}

function deleteProperty($conn, $data) {
    $id = $data['id'];
    
    $sql = "DELETE FROM properties WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Property deleted successfully"]);
    } else {
        echo json_encode(["error" => "Failed to delete property"]);
    }
    
    $stmt->close();
}

$conn->close();
?>
