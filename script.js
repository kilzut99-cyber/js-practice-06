// =============================================
// Практическая работа №6 — Работа с DOM
// =============================================

// --- ШАГ 1: НАХОДИМ ЭЛЕМЕНТЫ В DOM ---
// ПОЧЕМУ: Кэшируем ссылки один раз, чтобы избежать лишних операций поиска при взаимодействии.
const serviceNameInput = document.querySelector('#service-name');
const categorySelect = document.querySelector('#service-category');
const addBtn = document.querySelector('#add-btn');
const clearFormBtn = document.querySelector('#clear-form-btn');
const validationMsg = document.querySelector('#validation-msg');
const servicesContainer = document.querySelector('#services-container');
const totalCount = document.querySelector('#total-count');
const emptyMsg = document.querySelector('#empty-msg');
const toggleThemeBtn = document.querySelector('#toggle-theme-btn');
const highlightDevBtn = document.querySelector('#highlight-dev-btn');
const showFavoritesBtn = document.querySelector('#show-favorites-btn');
const showAllBtn = document.querySelector('#show-all-btn');
const demoFillBtn = document.querySelector('#demo-fill-btn');

// --- ШАГ 2: ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---

// Функция обновления счетчика и видимости сообщения "Пусто"
function updateUI() {
    // ПОЧЕМУ: querySelectorAll находит актуальное число всех созданных элементов .service-card.
    const count = servicesContainer.querySelectorAll('.service-card').length; 
    totalCount.textContent = count; // ПОЧЕМУ: textContent используется для безопасного вывода данных.
    emptyMsg.style.display = count === 0 ? 'block' : 'none'; 
}

// Функция создания узла карточки
function createCard(title, category) {
    // ПОЧЕМУ: createElement создает узел в памяти. Это быстрее и безопаснее манипуляций со строками.
    const card = document.createElement('div'); 
    card.classList.add('service-card'); 
    card.dataset.category = category; // ПОЧЕМУ: dataset сохраняет категорию для работы фильтров и подсветки.

    const h3 = document.createElement('h3'); 
    h3.textContent = title; // ПОЧЕМУ: Защита от XSS (вредоносных скриптов).

    const badge = document.createElement('span'); // Метка категории
    badge.textContent = category === 'dev' ? 'Разработка' : (category === 'design' ? 'Дизайн' : 'Маркетинг'); 

    const actions = document.createElement('div'); // Контейнер для кнопок
    actions.classList.add('card-actions');

    // --- КНОПКА "ИЗБРАННОЕ" (ЛОГИКА ИЗМЕНЕНИЯ ТЕКСТА) ---
    const favBtn = document.createElement('button'); 
    favBtn.classList.add('btn-secondary', 'fav-btn'); 
    favBtn.textContent = '☆ В избранное'; // ПОЧЕМУ: Начальное состояние согласно вашему уточнению.

    favBtn.addEventListener('click', () => { 
        // ПОЧЕМУ: toggle переключает класс активности, который делает текст белым в CSS.
        favBtn.classList.toggle('is-active'); 
        
        if (favBtn.classList.contains('is-active')) {
            // ПОЧЕМУ: При активации меняем звезду на заполненную и текст на "Избранное".
            favBtn.textContent = '★ Избранное'; 
        } else {
            // ПОЧЕМУ: При деактивации возвращаем "В избранное" и пустую звезду.
            favBtn.textContent = '☆ В избранное'; 
        }
    });

    const delBtn = document.createElement('button'); 
    delBtn.classList.add('btn-danger'); 
    delBtn.textContent = 'Удалить'; 
    delBtn.addEventListener('click', () => { 
        // ПОЧЕМУ: confirm() предотвращает случайную потерю данных.
        if (confirm('Вы действительно хотите удалить эту услугу?')) {
            card.remove(); // ПОЧЕМУ: remove() полностью извлекает узел из DOM.
            updateUI(); 
        }
    });

    actions.append(favBtn, delBtn); // ПОЧЕМУ: append вставляет несколько узлов сразу.
    card.append(h3, badge, actions); // Сборка карточки: заголовок, категория, кнопки.
    return card; 
}

// --- ШАГ 3: ОБРАБОТЧИКИ СОБЫТИЙ ---

// Добавление новой услуги
addBtn.addEventListener('click', () => {
    const title = serviceNameInput.value.trim(); // Удаляем лишние пробелы.
    const category = categorySelect.value; 

    if (title.length < 3) { // ПОЧЕМУ: Валидация согласно требованиям ТЗ.
        validationMsg.textContent = 'Ошибка: Минимум 3 символа!'; 
        return; 
    }
    validationMsg.textContent = ''; // Сброс ошибки.
    servicesContainer.append(createCard(title, category)); // Вставка в каталог.
    serviceNameInput.value = ''; // Очистка инпута.
    updateUI(); // Обновление UI.
});

// Очистка формы
clearFormBtn.addEventListener('click', () => {
    serviceNameInput.value = ''; 
    validationMsg.textContent = ''; 
    categorySelect.selectedIndex = 0; 
});

// Переключение темы (Задание 2)
toggleThemeBtn.addEventListener('click', () => {
    // ПОЧЕМУ: Переключение класса на body меняет стили всей страницы через CSS.
    document.body.classList.toggle('dark-mode'); 
});

// Подсветка категории "Разработка" (Задание 2)
highlightDevBtn.addEventListener('click', () => {
    // ПОЧЕМУ: querySelectorAll находит все карточки, а forEach обрабатывает их в цикле.
    document.querySelectorAll('.service-card').forEach(card => {
        if (card.dataset.category === 'dev') { // ПОЧЕМУ: Проверка категории через атрибут данных.
            card.classList.toggle('highlight'); // ПОЧЕМУ: Включает оранжевый контур только для dev-услуг.
        }
    });
});

// Фильтр: Показать избранные
showFavoritesBtn.addEventListener('click', () => {
    document.querySelectorAll('.service-card').forEach(card => {
        // ПОЧЕМУ: Теперь проверяем статус избранного по наличию класса у КНОПКИ внутри карточки.
        const btn = card.querySelector('.fav-btn');
        const isNotFav = !btn.classList.contains('is-active'); 
        card.classList.toggle('hidden', isNotFav); // Скрываем те, что не отмечены звездой.
    });
});

// Показать все (сброс фильтров)
showAllBtn.addEventListener('click', () => {
    document.querySelectorAll('.service-card').forEach(card => card.classList.remove('hidden')); 
});

// --- ШАГ 4: PRO-УРОВЕНЬ ---
demoFillBtn.addEventListener('click', () => {
    // ПОЧЕМУ: DocumentFragment — это контейнер в памяти. Вставка 50 карт за один раз ускоряет работу DOM.
    const fragment = document.createDocumentFragment(); 
    for (let i = 1; i <= 50; i++) {
        fragment.append(createCard(`Демо-услуга №${i}`, i % 2 === 0 ? 'dev' : 'design')); 
    }
    servicesContainer.append(fragment); // ПОЧЕМУ: Одна операция вставки в реальный DOM вместо 50.
    updateUI(); 
    demoFillBtn.disabled = true; // Блокировка кнопки.
    demoFillBtn.style.opacity = '0.5'; 
});

// --- ШАГ 5: ИНИЦИАЛИЗАЦИЯ ---
function initApp() {
    updateUI(); // ПОЧЕМУ: Установка начальных значений счетчика и заглушки.
    console.log('Приложение инициализировано успешно.'); 
}
initApp();

//***В представленном коде класс .highlight используется в обработчике события для кнопки «Подсветить разработку» (highlight-dev-btn) .
//***Что делает этот класс в JS:
//***Логика активации: При нажатии на кнопку скрипт находит все карточки услуг с помощью querySelectorAll('.service-card') и через цикл forEach проверяет их категорию в dataset.category.
//***Переключение (Toggle): Если категория карточки совпадает со значением 'dev' (Разработка), метод classList.toggle('highlight') добавляет или удаляет этот класс.
//***Визуальный эффект (согласно CSS):
//***Когда класс .highlight активен, он визуально выделяет карточку среди остальных :
//***Устанавливает оранжевую рамку толщиной 2px (border-color: #f59e0b).
//***Меняет фон карточки на светло-желтый (background: #fffbeb).
//***Меняет цвет текста на темно-серый (color: #1a202c).


//***В контексте инструментов разработчика (DevTools) «измененный DOM» означает, что структура страницы, которую вы видите во вкладке Elements, больше не совпадает с исходным HTML-файлом.
//***Вот основные моменты, которые важно понимать:
//***Живое дерево, а не текст: В DevTools отображается текущее состояние страницы в оперативной памяти браузера. Если ваш скрипт из практической работы добавил 50 карточек через DocumentFragment, они появятся в DevTools, хотя в исходном .html файле их нет.
//***Цветовая индикация: Когда JavaScript меняет что-то в DOM (например, текст, атрибут или вкладывает новый узел), DevTools на мгновение подсвечивает измененный участок (обычно розовым или фиолетовым фоном). Это помогает отладить, сработал ли ваш addEventListener.
//***Динамические классы: Если вы нажали кнопку «Подсветить разработку», вы увидите в DevTools, как у соответствующих тегов <div> прямо на глазах появляется атрибут class="service-card highlight".
//***Коротко: DevTools показывает результат работы  кода «здесь и сейчас». Если вы обновите страницу (F5), все изменения в DOM исчезнут, и дерево снова построится из чистого HTML-файла.















