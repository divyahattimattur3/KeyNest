<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
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
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (isset($data['action'])) {
            switch ($data['action']) {
                case 'login':
                    login($conn, $data);
                    break;
                case 'verify_otp':
                    verifyOTP($conn, $data);
                    break;
                case 'forgot_password':
                    forgotPassword($conn, $data);
                    break;
                case 'reset_password':
                    resetPassword($conn, $data);
                    break;
            }
        }
        break;
}

function login($conn, $data) {
    $username = $data['username'];
    $password = $data['password'];
    $userType = $data['userType'];
    
    $sql = "SELECT id, mobile FROM users WHERE username = ? AND password = ? AND user_type = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $username, $password, $userType);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        // Generate OTP (mock)
        $otp = rand(100000, 999999);
        // Store OTP in session or database (mock implementation)
        session_start();
        $_SESSION['otp'] = $otp;
        $_SESSION['user_id'] = $user['id'];
        
        echo json_encode(["success" => true, "message" => "OTP sent to " . $user['mobile'], "otp" => $otp]); // Remove otp in production
    } else {
        echo json_encode(["error" => "Invalid credentials"]);
    }
    
    $stmt->close();
}

function verifyOTP($conn, $data) {
    session_start();
    if (isset($_SESSION['otp']) && $data['otp'] == $_SESSION['otp']) {
        echo json_encode(["success" => true, "message" => "Login successful"]);
        unset($_SESSION['otp']);
    } else {
        echo json_encode(["error" => "Invalid OTP"]);
    }
}

function forgotPassword($conn, $data) {
    $mobile = $data['mobile'];
    
    $sql = "SELECT id FROM users WHERE mobile = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $mobile);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        // Generate reset OTP
        $otp = rand(100000, 999999);
        session_start();
        $_SESSION['reset_otp'] = $otp;
        $_SESSION['reset_mobile'] = $mobile;
        
        echo json_encode(["success" => true, "message" => "OTP sent for password reset", "otp" => $otp]); // Remove otp in production
    } else {
        echo json_encode(["error" => "Mobile number not found"]);
    }
    
    $stmt->close();
}

function resetPassword($conn, $data) {
    session_start();
    if (isset($_SESSION['reset_otp']) && $data['otp'] == $_SESSION['reset_otp']) {
        $newPassword = $data['newPassword'];
        $mobile = $_SESSION['reset_mobile'];
        
        $sql = "UPDATE users SET password = ? WHERE mobile = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $newPassword, $mobile);
        
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Password reset successful"]);
            unset($_SESSION['reset_otp']);
            unset($_SESSION['reset_mobile']);
        } else {
            echo json_encode(["error" => "Failed to reset password"]);
        }
        
        $stmt->close();
    } else {
        echo json_encode(["error" => "Invalid OTP"]);
    }
}

$conn->close();
?>
