<?php
require_once 'config.php';
header('Content-Type: application/json');

// Получить все новости (публичный доступ)
if ($_SERVER['REQUEST_METHOD'] === 'GET' && !isset($_GET['admin'])) {
    try {
        $stmt = $pdo->query("
            SELECT n.*, u.username as author_name 
            FROM news n
            JOIN users u ON n.author_id = u.id
            ORDER BY n.created_at DESC
        ");
        $news = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($news);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Админ: добавить новость
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_SESSION['user_id'])) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    try {
        $stmt = $pdo->prepare("INSERT INTO news (title, content, image_path, author_id) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $data['title'],
            $data['content'],
            $data['image_path'],
            $_SESSION['user_id']
        ]);
        echo json_encode(['status' => 'success', 'id' => $pdo->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Админ: удалить новость
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'];
    
    try {
        $stmt = $pdo->prepare("DELETE FROM news WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['status' => 'success']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>