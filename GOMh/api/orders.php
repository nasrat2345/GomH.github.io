<?php
require_once 'config.php';
header('Content-Type: application/json');

// Оставить заявку (публичный доступ)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    try {
        $stmt = $pdo->prepare("INSERT INTO orders (product_id, customer_name, phone, email) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $data['product_id'],
            $data['customer_name'],
            $data['phone'],
            $data['email']
        ]);
        
        // Можно добавить отправку email уведомления
        mail('admin@example.com', 'Новая заявка', "Поступила новая заявка на товар ID: {$data['product_id']}");
        
        echo json_encode(['status' => 'success', 'message' => 'Заявка успешно отправлена']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Получить заявки (только для админа)
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_SESSION['user_id'])) {
    try {
        $stmt = $pdo->query("
            SELECT o.*, p.name as product_name 
            FROM orders o
            JOIN products p ON o.product_id = p.id
            ORDER BY o.created_at DESC
        ");
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($orders);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Обновить статус заявки (админ)
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    parse_str(file_get_contents("php://input"), $_PUT);
    
    try {
        $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
        $stmt->execute([$_PUT['status'], $_PUT['id']]);
        echo json_encode(['status' => 'success']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>