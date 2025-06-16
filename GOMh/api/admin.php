<?php
require_once 'config.php';
header('Content-Type: application/json');

session_start();

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Доступ запрещен']);
    exit;
}

// Полная статистика для админки
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Количество новых заявок
        $newOrders = $pdo->query("SELECT COUNT(*) FROM orders WHERE status = 'new'")->fetchColumn();
        
        // Количество неподтвержденных отзывов
        $pendingReviews = $pdo->query("SELECT COUNT(*) FROM reviews WHERE is_approved = FALSE")->fetchColumn();
        
        // Последние 5 заявок
        $latestOrders = $pdo->query("
            SELECT o.*, p.name as product_name 
            FROM orders o
            JOIN products p ON o.product_id = p.id
            ORDER BY o.created_at DESC
            LIMIT 5
        ")->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'stats' => [
                'new_orders' => $newOrders,
                'pending_reviews' => $pendingReviews
            ],
            'latest_orders' => $latestOrders
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>