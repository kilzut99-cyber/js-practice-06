// =============================================
// Практическая работа №6 — Работа с DOM
// Starter Kit: script.js
// Основная работа выполняется здесь!
// =============================================

// =============================================
// ШАБЛОН ОБЪЕКТА КАРТОЧКИ
// Каждая карточка — это объект с такой структурой:
// {
//   id: Date.now(),       — уникальный идентификатор
//   title: "...",         — название услуги
//   category: "..."       — категория (design / dev / marketing)
// }
// =============================================

// =============================================
// ШАГ 1: НАХОДИМ ЭЛЕМЕНТЫ В DOM
// ПОЧЕМУ: Кэшируем ссылки на элементы один раз при инициализации, чтобы избежать лишних операций поиска при взаимодействии.
// =============================================
const serviceNameInput = document.querySelector('#service-name'); // Находим текстовое поле для названия услуги
const categorySelect = document.querySelector('#service-category'); // Находим выпадающий список для выбора категории
const addBtn = document.querySelector('#add-btn'); // Находим кнопку "Добавить" для формы
const clearFormBtn = document.querySelector('#clear-form-btn'); // Находим кнопку для очистки полей формы
const validationMsg = document.querySelector('#validation-msg'); // Находим элемент для вывода текста ошибок
const servicesContainer = document.querySelector('#services-container'); // Находим контейнер, куда будем добавлять карточки
const totalCount = document.querySelector('#total-count'); // Находим элемент, отображающий общее количество услуг
const emptyMsg = document.querySelector('#empty-msg'); // Находим сообщение о пустом каталоге

const toggleThemeBtn = document.querySelector('#toggle-theme-btn'); // Находим кнопку переключения темы оформления
const highlightDevBtn = document.querySelector('#highlight-dev-btn'); // Находим кнопку подсветки категории "Разработка"
const showFavoritesBtn = document.querySelector('#show-favorites-btn'); // Находим кнопку для фильтрации избранных карточек
const showAllBtn = document.querySelector('#show-all-btn'); // Находим кнопку для отмены всех фильтров
const demoFillBtn = document.querySelector('#demo-fill-btn'); // Находим кнопку для массовой загрузки демо-данных

// =============================================
// ШАГ 2: ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// =============================================

// Функция обновления счётчика карточек на странице
function updateCounter() {
    // ПОЧЕМУ: querySelectorAll('.service-card').length возвращает актуальное число узлов, присутствующих в DOM на данный момент.
    const count = document.querySelectorAll('.service-card').length; // Находим все карточки и получаем их количество
    totalCount.textContent = count; // Обновляем текстовое значение счетчика в интерфейсе
    toggleEmptyMessage(); // Проверяем и обновляем видимость сообщения о пустом списке
}

// Показ/скрытие сообщения «список пуст»
function toggleEmptyMessage() {
    // ПОЧЕМУ: servicesContainer.children.length позволяет мгновенно проверить наличие дочерних элементов в контейнере.
    const hasCards = servicesContainer.children.length > 0; // Проверяем, есть ли хотя бы одна карточка в каталоге
    emptyMsg.style.display = hasCards ? 'none' : 'block'; // Скрываем заглушку, если карточки есть, и показываем, если их нет
}

// Валидация входных данных формы
function validateInput(title) {
    // ПОЧЕМУ: textContent используется для вставки текста ошибки, что исключает риск XSS-атак (исполнения скриптов).
    if (title.length < 3) { // Проверяем, чтобы название было не короче 3 символов
        validationMsg.textContent = 'Ошибка: Название должно быть не короче 3 символов!'; // Выводим предупреждение
        return false; // Прекращаем выполнение функции
    }
    validationMsg.textContent = ''; // Очищаем поле ошибок, если валидация прошла успешно
    return true; // Разрешаем добавление карточки
}

// =============================================
// ШАГ 3: СОЗДАНИЕ КАРТОЧКИ УСЛУГИ
// =============================================
function createCardElement(cardData) {
    // ПОЧЕМУ: createElement создает элементы в оперативной памяти. Это безопаснее и эффективнее работы с innerHTML.
    const card = document.createElement('div'); // Создаем основной контейнер карточки
    card.classList.add('service-card'); // Присваиваем класс для оформления
    card.dataset.category = cardData.category; // Сохраняем категорию в data-атрибут для последующей фильтрации

    const h3 = document.createElement('h3'); // Создаем заголовочный элемент
    h3.textContent = cardData.title; // ПОЧЕМУ: textContent гарантирует, что данные пользователя будут вставлены как текст, а не как HTML-теги.

    const span = document.createElement('span'); // Создаем элемент бейджа категории
    span.classList.add('category-badge'); // Присваиваем класс бейджа
    const labels = { design: 'Дизайн', dev: 'Разработка', marketing: 'Маркетинг' }; // Словарь для перевода значений
    span.textContent = labels[cardData.category]; // Устанавливаем понятное название категории

    const actions = document.createElement('div'); // Создаем контейнер для кнопок управления внутри карточки
    actions.classList.add('card-actions'); // Присваиваем класс кнопок

    const favBtn = document.createElement('button'); // Создаем кнопку добавления в избранное
    favBtn.classList.add('btn-secondary'); // Присваиваем второстепенный стиль кнопки
    favBtn.textContent = '⭐ В избранное'; // Устанавливаем текст и иконку
    favBtn.addEventListener('click', () => { // Навешиваем обработчик события клика
        // ПОЧЕМУ: classList.toggle лаконично включает или выключает подсветку без дополнительных логических проверок.
        card.classList.toggle('highlight'); // Переключаем класс подсветки
    });

    const delBtn = document.createElement('button'); // Создаем кнопку удаления карточки
    delBtn.classList.add('btn-danger'); // Присваиваем стиль красной (опасной) кнопки
    delBtn.textContent = 'Удалить'; // Устанавливаем текст
    delBtn.addEventListener('click', () => { // Навешиваем обработчик удаления
        if (confirm('Удалить эту услугу?')) { // Запрашиваем подтверждение у пользователя
            // ПОЧЕМУ: remove() удаляет элемент из DOM напрямую, что является современным и рекомендуемым способом.
            card.remove(); // Удаляем узел из дерева страницы
            updateCounter(); // Пересчитываем и обновляем итоговый счетчик
        }
    });

    // ПОЧЕМУ: append позволяет вставить сразу несколько созданных узлов в один родительский элемент за один вызов.
    actions.append(favBtn, delBtn); // Добавляем кнопки в блок действий
    card.append(h3, span, actions); // Формируем полную структуру карточки
    return card; // Возвращаем готовый элемент для вставки на страницу
}

// =============================================
// ШАГ 4-8: ОБРАБОТЧИКИ СОБЫТИЙ
// =============================================

// Обработчик добавления новой карточки из формы
addBtn.addEventListener('click', () => {
    const title = serviceNameInput.value.trim(); // Получаем значение названия и очищаем пробелы по краям
    const category = categorySelect.value; // Считываем текущую выбранную категорию из списка

    if (!validateInput(title)) return; // Если проверка названия не прошла — прерываем выполнение добавления

    const card = createCardElement({ title, category }); // Генерируем новый DOM-узел карточки
    servicesContainer.append(card); // ПОЧЕМУ: append вставляет узел в конец контейнера в активном дереве DOM.
    
    serviceNameInput.value = ''; // Очищаем поле ввода для следующего использования
    updateCounter(); // Обновляем цифровой счетчик и заглушку на странице
});

// Обработчик полной очистки формы ввода
clearFormBtn.addEventListener('click', () => {
    serviceNameInput.value = ''; // Очищаем поле названия
    validationMsg.textContent = ''; // Сбрасываем текст выведенных ранее ошибок
    categorySelect.selectedIndex = 0; // Сбрасываем выпадающий список на первую позицию по умолчанию
});

// Обработчик смены цветовой темы оформления
toggleThemeBtn.addEventListener('click', () => {
    // ПОЧЕМУ: Переключение класса на элементе body позволяет мгновенно поменять стили всей страницы через каскад CSS.
    document.body.classList.toggle('dark-mode'); // Переключаем класс темного режима
});

// Обработчик подсветки карточек определенной категории ("Разработка")
highlightDevBtn.addEventListener('click', () => {
    // ПОЧЕМУ: querySelectorAll создает NodeList всех карточек, что позволяет массово обрабатывать элементы через цикл forEach.
    document.querySelectorAll('.service-card').forEach(card => { // Перебираем все существующие карточки
        if (card.dataset.category === 'dev') { // Проверяем, совпадает ли категория с заданной ('dev')
            card.classList.toggle('highlight'); // Включаем или выключаем желтую рамку (подсветку)
        }
    });
});

// Обработчик фильтрации для показа только избранных карточек
showFavoritesBtn.addEventListener('click', () => {
    document.querySelectorAll('.service-card').forEach(card => { // Проходим по всем элементам в контейнере
        // ПОЧЕМУ: Использование класса .hidden для управления свойством display эффективнее прямого изменения style.
        const isNotFav = !card.classList.contains('highlight'); // Проверяем, отсутствует ли у карточки класс избранного
        card.classList.toggle('hidden', isNotFav); // Добавляем класс скрытия тем карточкам, которые не в избранном
    });
});

// Обработчик сброса фильтров и показа всех карточек
showAllBtn.addEventListener('click', () => {
    document.querySelectorAll('.service-card').forEach(card => { // Проходим циклом по всем услугам
        card.classList.remove('hidden'); // Убираем класс скрытия у всех элементов, возвращая их в каталог
    });
});

// =============================================
// 🔴 PRO: МАССОВОЕ ДОБАВЛЕНИЕ ЧЕРЕЗ DocumentFragment
// =============================================

demoFillBtn.addEventListener('click', () => {
    // ПОЧЕМУ: DocumentFragment — это "легкий" контейнер вне DOM. Вставка 50 карточек разом через него вызывает всего 1 перерисовку страницы (Reflow), что в 50 раз быстрее вставки по одной.
    const fragment = document.createDocumentFragment(); // Создаем виртуальный фрагмент в памяти
    
    // Подготовка 50 наборов данных для карточек
    const baseNames = ['Аналитика', 'SEO-курс', 'Лендинг', 'Чат-бот', 'Дизайн лого', 'SMM'];
    const cats = ['dev', 'design', 'marketing'];

    for (let i = 1; i <= 50; i++) { // Запускаем цикл для генерации 50 элементов
        const data = {
            title: baseNames[i % baseNames.length] + ' #' + i, // Формируем уникальное имя для карточки
            category: cats[i % cats.length] // Чередуем категории по остатку от деления
        };
        fragment.append(createCardElement(data)); // Добавляем созданную карточку в "черновик" фрагмента
    }

    servicesContainer.append(fragment); // ПОЧЕМУ: Один вызов метода append вставляет все накопленные во фрагменте узлы в реальный DOM одновременно.
    updateCounter(); // Актуализируем общее количество услуг в каталоге
    demoFillBtn.disabled = true; // Отключаем кнопку загрузки, чтобы избежать повторного дублирования данных
    demoFillBtn.style.opacity = '0.5'; // Визуально затеняем неактивную кнопку
});

// =============================================
// ИНИЦИАЛИЗАЦИЯ
// =============================================
function init() { // Функция, запускающая первичную проверку интерфейса
    updateCounter(); // Устанавливаем начальное значение счетчика (0) и отображаем заглушку "Список пуст"
}
init(); // Запуск скрипта сразу после загрузки страницы