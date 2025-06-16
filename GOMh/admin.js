const API_BASE_URL = 'http://localhost/GOMh/api';

// Проверка авторизации
async function checkAuth() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth.php?check_auth=1`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      window.location.href = 'login.html';
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    window.location.href = 'login.html';
  }
}

// Загрузка заявок
async function loadOrders() {
  try {
    const response = await fetch(`${API_BASE_URL}/orders.php`);
    const orders = await response.json();
    
    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = '';
    
    orders.forEach(order => {
      const orderElement = document.createElement('div');
      orderElement.className = 'order-item';
      orderElement.innerHTML = `
        <p><strong>Товар:</strong> ${order.product_name}</p>
        <p><strong>Клиент:</strong> ${order.customer_name}</p>
        <p><strong>Телефон:</strong> ${order.phone}</p>
        <p><strong>Статус:</strong> 
          <select onchange="updateOrderStatus(${order.id}, this.value)">
            <option value="new" ${order.status === 'new' ? 'selected' : ''}>Новый</option>
            <option value="processed" ${order.status === 'processed' ? 'selected' : ''}>В обработке</option>
            <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Завершен</option>
          </select>
        </p>
      `;
      ordersList.appendChild(orderElement);
    });
  } catch (error) {
    console.error('Ошибка загрузки заявок:', error);
  }
}

// Обновление статуса заявки
async function updateOrderStatus(orderId, status) {
  try {
    await fetch(`${API_BASE_URL}/orders.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: orderId, status })
    });
  } catch (error) {
    console.error('Ошибка обновления статуса:', error);
  }
}

// Добавление товара
document.getElementById('addProductForm').onsubmit = async function(e) {
  e.preventDefault();
  
  const formData = new FormData();
  formData.append('name', document.getElementById('productName').value);
  formData.append('description', document.getElementById('productDescription').value);
  formData.append('price', document.getElementById('productPrice').value);
  formData.append('stock', document.getElementById('productStock').value);
  formData.append('image', document.getElementById('productImage').files[0]);
  
  try {
    const response = await fetch(`${API_BASE_URL}/products.php`, {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    alert('Товар успешно добавлен!');
    this.reset();
  } catch (error) {
    console.error('Ошибка добавления товара:', error);
    alert('Ошибка при добавлении товара');
  }
};

// Инициализация
checkAuth();
loadOrders();