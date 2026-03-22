// =============================================
// Практическая работа №6 — Работа с DOM
// Финальная версия: script.js
// =============================================

// --- ШАГ 1: НАХОДИМ ЭЛЕМЕНТЫ В DOM ---
// ПОЧЕМУ: Кэшируем ссылки на элементы один раз при инициализации, чтобы избежать лишних операций поиска при взаимодействии.
const serviceNameInput = document.querySelector('#service-name'); // Поле названия
const categorySelect = document.querySelector('#service-category'); // Выбор категории
const addBtn = document.querySelector('#add-btn'); // Кнопка "Добавить"
const clearFormBtn = document.querySelector('#clear-form-btn'); // Кнопка "Очистить"
const validationMsg = document.querySelector('#validation-msg'); // Ошибки валидации
const servicesContainer = document.querySelector('#services-container'); // Контейнер карточек
const totalCount = document.querySelector('#total-count'); // Счетчик количества
const emptyMsg = document.querySelector('#empty-msg'); // Заглушка каталога
const toggleThemeBtn = document.querySelector('#toggle-theme-btn'); // Смена темы
const highlightDevBtn = document.querySelector('#highlight-dev-btn'); // Кнопка подсветки dev
const showFavoritesBtn = document.querySelector('#show-favorites-btn'); // Фильтр избранного
const showAllBtn = document.querySelector('#show-all-btn'); // Сброс фильтров
const demoFillBtn = document.querySelector('#demo-fill-btn'); // Массовая загрузка

// --- ШАГ 2: ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
function updateUI() {
    // ПОЧЕМУ: querySelectorAll находит актуальное число всех созданных элементов .service-card в DOM дереве.
    const count = document.querySelectorAll('.service-card').length; 
    totalCount.textContent = count; // ПОЧЕМУ: textContent используется для безопасного вывода цифр без риска XSS атак.
    emptyMsg.style.display = count === 0 ? 'block' : 'none'; // Показываем или скрываем текст о пустом списке.
}

function createCard(title, category) {
    // ПОЧЕМУ: createElement создает узел в оперативной памяти. Это быстрее и безопаснее манипуляций со строками.
    const card = document.createElement('div'); 
    card.classList.add('service-card'); // ПОЧЕМУ: classList.add используется для назначения CSS класса из файла стилей.
    card.dataset.category = category; // ПОЧЕМУ: dataset сохраняет категорию в атрибут данных для удобной фильтрации.

    const h3 = document.createElement('h3'); // Заголовок
    h3.textContent = title; // ПОЧЕМУ: textContent вставляет данные только как текст, нейтрализуя вредоносные скрипты.

    const badge = document.createElement('span'); // Метка категории
    // Сопоставление ключей value из HTML с читаемыми названиями
    badge.textContent = category === 'dev' ? 'Разработка' : (category === 'design' ? 'Дизайн' : 'Маркетинг'); 

    const actions = document.createElement('div'); // Контейнер кнопок
    actions.classList.add('card-actions');

    // КНОПКА "ИЗБРАННОЕ" С ТЗ: ИЗМЕНЕНИЕ ЗВЕЗДЫ И ЦВЕТА
    const favBtn = document.createElement('button'); 
    favBtn.classList.add('btn-secondary', 'fav-btn'); // ПОЧЕМУ: Назначение стилей из CSS.
    favBtn.textContent = '☆ Избранное'; // Начальное состояние — пустая звезда.

    favBtn.addEventListener('click', () => { 
        // ПОЧЕМУ: Переключаем класс .is-active только на кнопке для изменения цвета текста/звезды на белый в CSS.
        favBtn.classList.toggle('is-active'); 
        
        if (favBtn.classList.contains('is-active')) { // Проверяем активность
            favBtn.textContent = '★ Избранное'; // Меняем символ на заполненный по ТЗ.
        } else {
            favBtn.textContent = '☆ Избранное'; // Возврат к исходному виду.
        }
    });

    const delBtn = document.createElement('button'); // Кнопка удаления
    delBtn.classList.add('btn-danger'); 
    delBtn.textContent = 'Удалить'; 
    delBtn.addEventListener('click', () => { 
        // ПОЧЕМУ: confirm() запрашивает подтверждение, предотвращая случайную потерю данных пользователем.
        if (confirm('Вы действительно хотите навсегда удалить эту услугу?')) {
            card.remove(); // ПОЧЕМУ: Метод remove() полностью извлекает текущий DOM узел из дерева документа.
            updateUI(); // Обновляем UI после удаления.
        }
    });

    actions.append(favBtn, delBtn); // ПОЧЕМУ: append позволяет вставить сразу несколько узлов одним вызовом.
    card.append(h3, badge, actions); // Сборка карточки.
    return card; // Возврат готового узла.
}

// --- ШАГ 3: ОБРАБОТЧИКИ СОБЫТИЙ ---
addBtn.addEventListener('click', () => {
    const title = serviceNameInput.value.trim(); // Считывание и очистка пробелов.
    const category = categorySelect.value; // Получение категории.

    if (title.length < 3) { // ПОЧЕМУ: Валидация согласно требованиям ТЗ.
        validationMsg.textContent = 'Ошибка: Название слишком короткое (минимум 3 символа)!'; 
        return; 
    }
    validationMsg.textContent = ''; // Сброс ошибки.
    servicesContainer.append(createCard(title, category)); // Вставка в DOM.
    serviceNameInput.value = ''; // Очистка инпута.
    updateUI(); // Обновление счетчика.
});

clearFormBtn.addEventListener('click', () => {
    serviceNameInput.value = ''; // Обнуление инпута.
    validationMsg.textContent = ''; // Очистка ошибок.
    categorySelect.selectedIndex = 0; // Сброс селекта.
});

toggleThemeBtn.addEventListener('click', () => {
    // ПОЧЕМУ: Переключение класса на body мгновенно меняет оформление всей страницы через CSS правила.
    document.body.classList.toggle('dark-mode'); 
});

highlightDevBtn.addEventListener('click', () => {
    // ПОЧЕМУ: querySelectorAll находит все карточки, а forEach позволяет обработать их в цикле.
    document.querySelectorAll('.service-card').forEach(card => {
        if (card.dataset.category === 'dev') { // ПОЧЕМУ: Только для карточек "Разработка".
            card.classList.toggle('highlight'); // ПОЧЕМУ: Только здесь включается желтая подсветка контура.
        }
    });
});

showFavoritesBtn.addEventListener('click', () => {
    document.querySelectorAll('.service-card').forEach(card => {
        // ПОЧЕМУ: Теперь проверяем состояние по классу .is-active у кнопки внутри карточки.
        const btn = card.querySelector('.fav-btn');
        const isNotFav = !btn.classList.contains('is-active'); 
        card.classList.toggle('hidden', isNotFav); // ПОЧЕМУ: Свойство display: none убирает элемент из потока.
    });
});

showAllBtn.addEventListener('click', () => {
    document.querySelectorAll('.service-card').forEach(card => card.classList.remove('hidden')); // Сброс скрытия.
});

// --- ШАГ 4: PRO-УРОВЕНЬ ---
demoFillBtn.addEventListener('click', () => {
    // ПОЧЕМУ: DocumentFragment — это легковесный контейнер. Вставка 50 карт за один вызов ускоряет работу DOM.
    const fragment = document.createDocumentFragment(); 
    for (let i = 1; i <= 50; i++) {
        fragment.append(createCard(`Демо-услуга №${i}`, i % 2 === 0 ? 'dev' : 'design')); 
    }
    servicesContainer.append(fragment); // ПОЧЕМУ: Единственная операция вставки в реальное дерево DOM для всех 50 карточек.
    updateUI(); 
    demoFillBtn.disabled = true; // Отключаем повторную загрузку.
    demoFillBtn.style.opacity = '0.5'; // Визуально затеняем кнопку.
});

// --- ШАГ 5: ИНИЦИАЛИЗАЦИЯ ---
function initApp() {
    updateUI(); // ПОЧЕМУ: Устанавливаем начальное состояние счетчика и заглушки.
    console.log('Приложение инициализировано успешно.'); // ПОЧЕМУ: Лог помогает убедиться в запуске скрипта.
}
initApp();