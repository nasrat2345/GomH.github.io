document.addEventListener('DOMContentLoaded', function() {
    // Элементы страницы
    const mainContent = document.getElementById('main-content');
    const catalogPage = document.getElementById('catalog');
    const servicesPage = document.getElementById('services-page');
    const contactPage = document.getElementById('contact-page');
    const backBtn = document.getElementById('back-to-main');
    const backBtnServices = document.getElementById('back-to-main-services');
    const backBtnContacts = document.getElementById('back-to-main-contacts');
    const catalogBtn = document.getElementById('catalog-btn');
    const catalogBtn2 = document.getElementById('catalog-btn-2');
    const servicesBtn = document.getElementById('services-btn');
    const servicesBtn2 = document.getElementById('services-btn-2');
    const contactBtn = document.getElementById('contact-btn');
    const newsBtn = document.getElementById('news-btn');
    const closeNews = document.getElementById('close-news');
    const newsModal = document.getElementById('news-modal');
    const gameBtn = document.getElementById('game-btn');
    const closeGame = document.getElementById('close-game');
    const closeGameBtn = document.getElementById('close-game-btn');
    const restartGame = document.getElementById('restart-game');
    const gameModal = document.getElementById('game-modal');
    const gameArea = document.getElementById('game-area');
    const scoreElement = document.getElementById('score');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const catalogLinks = document.querySelectorAll('.catalog-link');
    const serviceLinks = document.querySelectorAll('.service-link');
    const navLinks = document.querySelectorAll('.catalog-nav-link');
    const productGrids = {
        chemical: document.getElementById('chemical-products'),
        fertilizers: document.getElementById('fertilizers-products'),
        materials: document.getElementById('materials-products')
    };
    
    // Переменные для игры
    let selectedElements = [];
    let score = 0;
    
    // Показать каталог
    function showCatalog(category = 'chemical') {
        mainContent.style.display = 'none';
        catalogPage.style.display = 'block';
        servicesPage.style.display = 'none';
        contactPage.style.display = 'none';
        newsModal.style.display = 'none';
        gameModal.style.display = 'none';
        
        // Скрыть все продукты и показать только выбранные
        for (const key in productGrids) {
            productGrids[key].style.display = 'none';
        }
        productGrids[category].style.display = 'grid';
        
        // Обновить активную ссылку в навигации
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.category === category) {
                link.classList.add('active');
            }
        });
        
        // Прокрутить к каталогу
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Показать страницу услуг
    function showServicesPage(service = null) {
        mainContent.style.display = 'none';
        catalogPage.style.display = 'none';
        servicesPage.style.display = 'block';
        contactPage.style.display = 'none';
        newsModal.style.display = 'none';
        gameModal.style.display = 'none';
        
        // Если указана конкретная услуга, прокрутить к ней
        if (service) {
            const serviceSection = document.querySelector(`.service-section`);
            window.scrollTo({
                top: serviceSection.offsetTop - 100,
                behavior: 'smooth'
            });
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Показать страницу контактов
    function showContactPage() {
        mainContent.style.display = 'none';
        catalogPage.style.display = 'none';
        servicesPage.style.display = 'none';
        contactPage.style.display = 'block';
        newsModal.style.display = 'none';
        gameModal.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Показать новости
    function showNews() {
        newsModal.style.display = 'flex';
    }
    
    // Скрыть новости
    function hideNews() {
        newsModal.style.display = 'none';
    }
    
    // Показать игру
    function showGame() {
        gameModal.style.display = 'flex';
    }
    
    // Скрыть игру
    function hideGame() {
        gameModal.style.display = 'none';
    }
    
    // Вернуться на главную
    function showMain() {
        mainContent.style.display = 'block';
        catalogPage.style.display = 'none';
        servicesPage.style.display = 'none';
        contactPage.style.display = 'none';
        newsModal.style.display = 'none';
        gameModal.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Инициализация игры
    function initGame() {
        // Очищаем выбранные элементы
        selectedElements = [];
        
        // Удаляем все обработчики событий
        const elements = document.querySelectorAll('.chemical-item');
        elements.forEach(el => {
            el.replaceWith(el.cloneNode(true));
        });
        
        // Добавляем новые обработчики
        document.querySelectorAll('.chemical-item').forEach(item => {
            item.addEventListener('click', function() {
                const element = this.getAttribute('data-element');
                selectedElements.push(element);
                this.style.backgroundColor = '#4b8e8d';
                this.style.transform = 'scale(0.95)';
                
                // Проверяем, есть ли 3 одинаковых элемента
                const count = selectedElements.filter(el => el === element).length;
                if (count === 3) {
                    // Реакция произошла
                    score++;
                    scoreElement.textContent = score;
                    
                    // Сбрасываем выбранные элементы
                    selectedElements = [];
                    
                    // Восстанавливаем все элементы
                    document.querySelectorAll('.chemical-item').forEach(el => {
                        el.style.backgroundColor = '';
                        el.style.transform = '';
                    });
                    
                    // Перемешиваем элементы
                    shuffleElements();
                }
            });
        });
    }
    
    // Перемешивание элементов в игре
    function shuffleElements() {
        const gameArea = document.getElementById('game-area');
        const elements = Array.from(gameArea.children);
        
        // Перемешиваем массив
        for (let i = elements.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [elements[i], elements[j]] = [elements[j], elements[i]];
        }
        
        // Очищаем игровое поле и добавляем перемешанные элементы
        gameArea.innerHTML = '';
        elements.forEach(el => gameArea.appendChild(el));
    }
    
    // Поиск продукции
    function searchProducts() {
        const query = searchInput.value.toLowerCase();
        if (query.trim() === '') return;
        
        showCatalog();
        
        // Показываем все продукты и затем скрываем несоответствующие
        for (const key in productGrids) {
            const products = productGrids[key].querySelectorAll('.product-card');
            products.forEach(product => {
                const title = product.querySelector('h3').textContent.toLowerCase();
                const description = product.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(query) || description.includes(query)) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        }
    }
    
    // Обработчики событий
    catalogBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showCatalog();
    });
    
    catalogBtn2.addEventListener('click', function(e) {
        e.preventDefault();
        showCatalog();
    });
    
    servicesBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showServicesPage();
    });
    
    servicesBtn2.addEventListener('click', function(e) {
        e.preventDefault();
        showServicesPage();
    });
    
    contactBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showContactPage();
    });
    
    backBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showMain();
    });
    
    backBtnServices.addEventListener('click', function(e) {
        e.preventDefault();
        showMain();
    });
    
    backBtnContacts.addEventListener('click', function(e) {
        e.preventDefault();
        showMain();
    });
    
    newsBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showNews();
    });
    
    closeNews.addEventListener('click', function(e) {
        e.preventDefault();
        hideNews();
    });
    
    gameBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showGame();
        initGame();
    });
    
    closeGame.addEventListener('click', function(e) {
        e.preventDefault();
        hideGame();
    });
    
    closeGameBtn.addEventListener('click', function(e) {
        e.preventDefault();
        hideGame();
    });
    
    restartGame.addEventListener('click', function(e) {
        e.preventDefault();
        score = 0;
        scoreElement.textContent = score;
        initGame();
    });
    
    searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        searchProducts();
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchProducts();
        }
    });
    
    catalogLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            showCatalog(category);
        });
    });
    
    serviceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const service = this.dataset.service;
            showServicesPage(service);
        });
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            
            // Обновить активную ссылку
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Показать соответствующие продукты
            for (const key in productGrids) {
                productGrids[key].style.display = key === category ? 'grid' : 'none';
            }
        });
    });
    
    // Обработка кликов вне модальных окон
    window.addEventListener('click', function(e) {
        if (e.target === newsModal) {
            hideNews();
        }
        if (e.target === gameModal) {
            hideGame();
        }
    });
    
    // Обработка хэша URL при загрузке страницы
    if (window.location.hash === '#catalog') {
        showCatalog();
    } else if (window.location.hash === '#services-page') {
        showServicesPage();
    } else if (window.location.hash === '#contact-page') {
        showContactPage();
    } else if (window.location.hash === '#chemical' || 
              window.location.hash === '#fertilizers' || 
              window.location.hash === '#materials') {
        const category = window.location.hash.substring(1);
        showCatalog(category);
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем новые переменные
    const authBtn = document.getElementById('auth-btn');
    const authModal = document.getElementById('auth-modal');
    const closeAuth = document.getElementById('close-auth');
    const authTabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const switchToLogin = document.getElementById('switch-to-login');
    const forgotPassword = document.getElementById('forgot-password');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');
    
    // Показать модальное окно авторизации
    authBtn.addEventListener('click', function(e) {
        e.preventDefault();
        authModal.style.display = 'flex';
        // По умолчанию показываем форму входа
        switchTab('login');
    });
    
    // Скрыть модальное окно авторизации
    closeAuth.addEventListener('click', function(e) {
        e.preventDefault();
        authModal.style.display = 'none';
    });
    
    // Переключение между вкладками
    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            switchTab(tabName);
        });
    });
    
    // Функция переключения вкладок
    function switchTab(tabName) {
        authTabs.forEach(tab => {
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        if (tabName === 'login') {
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        } else {
            loginForm.classList.remove('active');
            registerForm.classList.add('active');
        }
    }
    
    // Переключение на форму входа
    switchToLogin.addEventListener('click', function(e) {
        e.preventDefault();
        switchTab('login');
    });
    
    // Обработка восстановления пароля
    forgotPassword.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Функция восстановления пароля временно недоступна. Пожалуйста, свяжитесь с администратором.');
    });
    
    // Обработка формы входа
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Здесь должна быть проверка данных на сервере
        // Для демонстрации просто проверяем непустые поля
        if (email && password) {
            // Успешный вход (в реальном приложении здесь будет запрос к серверу)
            alert('Добро пожаловать!');
            authModal.style.display = 'none';
            // Можно изменить кнопку на "Выйти" или показать имя пользователя
            authBtn.innerHTML = '<i class="fas fa-user"></i> ' + email;
            loginError.style.display = 'none';
        } else {
            loginError.style.display = 'block';
        }
    });
    const API_BASE_URL = 'http://ваш_сайт/backend/api';

// Открытие модального окна заявки
function openOrderModal(productId) {
  document.getElementById('productId').value = productId;
  document.getElementById('orderModal').style.display = 'block';
}

// Закрытие модального окна
document.querySelectorAll('.close').forEach(btn => {
  btn.onclick = function() {
    this.closest('.modal').style.display = 'none';
  }
});

// Обработка формы заявки
document.getElementById('orderForm').onsubmit = async function(e) {
  e.preventDefault();
  
  const orderData = {
    product_id: document.getElementById('productId').value,
    customer_name: document.getElementById('customerName').value,
    phone: document.getElementById('customerPhone').value,
    email: document.getElementById('customerEmail').value
  };

  try {
    const response = await fetch(`${API_BASE_URL}/orders.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    
    const result = await response.json();
    alert(result.message || 'Заявка отправлена!');
    document.getElementById('orderModal').style.display = 'none';
  } catch (error) {
    console.error('Ошибка:', error);
    alert('Произошла ошибка при отправке');
  }
};

// Загрузка товаров при загрузке страницы
window.onload = async function() {
  try {
    const response = await fetch(`${API_BASE_URL}/products.php`);
    const products = await response.json();
    
    const productsContainer = document.getElementById('products');
    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
        <img src="${product.image_path}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.price} руб.</p>
        <button onclick="openOrderModal(${product.id})">Оставить заявку</button>
        <button onclick="openReviewModal('product', ${product.id})">Оставить отзыв</button>
      `;
      productsContainer.appendChild(productCard);
    });
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error);
  }
};
    
    // Обработка формы регистрации
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;
        
        // Простая валидация
        if (password.length < 6) {
            registerError.textContent = 'Пароль должен содержать минимум 6 символов';
            registerError.style.display = 'block';
            return;
        }
        
        if (password !== confirm) {
            registerError.textContent = 'Пароли не совпадают';
            registerError.style.display = 'block';
            return;
        }
        
        // Если все ок - регистрируем (в реальном приложении здесь будет запрос к серверу)
        alert('Регистрация прошла успешно! Теперь вы можете войти.');
        switchTab('login');
        registerError.style.display = 'none';
    });
    
    // Обработка кликов вне модального окна
    window.addEventListener('click', function(e) {
        if (e.target === authModal) {
            authModal.style.display = 'none';
        }
  
    });
    
   // Открытие модального окна отзыва
function openReviewModal(entityType, entityId) {
    document.getElementById('reviewEntityType').value = entityType;
    document.getElementById('reviewEntityId').value = entityId;
    document.getElementById('reviewModal').style.display = 'block';
    
    // Сброс рейтинга
    document.querySelectorAll('.star').forEach(star => {
      star.classList.remove('active');
    });
  }
  
  // Обработка кликов по звездам
  document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', function() {
      const value = this.getAttribute('data-value');
      const stars = document.querySelectorAll('.star');
      
      stars.forEach((s, index) => {
        s.classList.toggle('active', index < value);
      });
      
      document.getElementById('reviewRating').value = value;
    });
  });
  
  // Отправка отзыва
  document.getElementById('reviewForm').onsubmit = async function(e) {
    e.preventDefault();
    
    const stars = document.querySelectorAll('.star.active');
    if (stars.length === 0) {
      alert('Пожалуйста, поставьте оценку');
      return;
    }
  
    const reviewData = {
      entity_type: document.getElementById('reviewEntityType').value,
      entity_id: document.getElementById('reviewEntityId').value,
      user_name: document.getElementById('reviewUserName').value,
      email: document.getElementById('reviewUserEmail').value,
      content: document.getElementById('reviewContent').value,
      rating: stars.length
    };
  
    try {
      const response = await fetch(`${API_BASE_URL}/reviews.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
      });
      
      const result = await response.json();
      alert(result.message || 'Спасибо за ваш отзыв!');
      document.getElementById('reviewModal').style.display = 'none';
      this.reset();
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Произошла ошибка при отправке отзыва');
    }
    
  };
  
});