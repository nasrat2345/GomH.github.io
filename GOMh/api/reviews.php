<?php
require_once 'config.php';

header('Content-Type: application/json');

// Получить отзывы для конкретной сущности (услуги/товара)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $entityType = $_GET['entity_type'] ?? '';
    $entityId = $_GET['entity_id'] ?? 0;
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM reviews WHERE entity_type = ? AND entity_id = ? AND is_approved = TRUE");
        $stmt->execute([$entityType, $entityId]);
        $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($reviews);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Добавить новый отзыв
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    try {
        $stmt = $pdo->prepare("INSERT INTO reviews (user_name, email, content, rating, entity_type, entity_id) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['user_name'],
            $data['email'],
            $data['content'],
            $data['rating'],
            $data['entity_type'],
            $data['entity_id']
        ]);
        echo json_encode(['message' => 'Отзыв отправлен на модерацию']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Админ: одобрить отзыв
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    parse_str(file_get_contents("php://input"), $_PUT);
    $id = $_PUT['id'] ?? 0;
    
    try {
        $stmt = $pdo->prepare("UPDATE reviews SET is_approved = TRUE WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['message' => 'Отзыв одобрен']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>