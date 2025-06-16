<?php
require_once 'config.php';

header('Content-Type: application/json');

// Получить все товары
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM products");
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($products);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Добавить новый товар (админ)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    try {
        $stmt = $pdo->prepare("INSERT INTO products (name, description, price, stock, image_path) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$data['name'], $data['description'], $data['price'], $data['stock'], $data['image_path']]);
        echo json_encode(['message' => 'Товар добавлен', 'id' => $pdo->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>