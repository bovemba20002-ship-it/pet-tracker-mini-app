// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

// Инициализация данных
let pets = JSON.parse(localStorage.getItem('pets')) || [];

const container = document.querySelector('.container');
const petsListEl = document.getElementById('pets-list');
const petDetailsEl = document.getElementById('pet-details');
const petNameEl = document.getElementById('pet-name');
const proceduresListEl = document.getElementById('procedures-list');

function saveData() {
    localStorage.setItem('pets', JSON.stringify(pets));
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

function showPets() {
    console.log("showPets вызван");
    container.style.display = 'block';
    petDetailsEl.classList.add('hidden');

    petsListEl.innerHTML = '';

    pets.forEach((pet, index) => {
        const li = document.createElement('li');
        li.textContent = pet.name;
        li.onclick = () => showPetDetails(index);
        petsListEl.appendChild(li);
    });
}

function showPetDetails(index) {
    console.log("showPetDetails вызван для индекса:", index);
    
    const pet = pets[index];
    petNameEl.textContent = pet.name;

    // Прячем основной контейнер
    container.style.display = 'none';

    // Показываем карточку животного
    petDetailsEl.classList.remove('hidden');

    // Принудительно устанавливаем display: block, чтобы убедиться, что div виден
    petDetailsEl.style.display = 'block';

    proceduresListEl.innerHTML = '';

    // Сортировка процедур по дате (от ближайшей)
    const sortedProcs = [...pet.procedures].sort((a, b) => new Date(a.date) - new Date(b.date));

    sortedProcs.forEach(proc => {
        const li = document.createElement('li');
        const dateFormatted = formatDate(proc.date);
        const status = new Date(proc.date) <= new Date() ? 'Прошла' : 'Предстоит';
        li.textContent = `${proc.name} — ${dateFormatted} (${status}, напоминание: ${proc.reminder} дней)`;
        proceduresListEl.appendChild(li);
    });

    // Находим кнопку "Назад" и "Добавить процедуру"
    const backBtn = document.getElementById('back-btn');
    const addProcBtn = document.getElementById('add-procedure-btn');

    if (backBtn) {
        backBtn.onclick = showPets;
        console.log("Кнопка 'Назад' найдена и привязана");
    } else {
        console.error("Кнопка 'Назад' не найдена!");
    }

    if (addProcBtn) {
        addProcBtn.onclick = () => addProcedure(index);
        addProcBtn.style.display = 'block'; // Принудительно показываем кнопку
        console.log("Кнопка 'Добавить процедуру' найдена и привязана");
    } else {
        console.error("Кнопка 'Добавить процедуру' не найдена в DOM!");
    }
}

function addProcedure(index) {
    console.log("addProcedure вызван для индекса:", index);
    const formHtml = `
        <form id="add-proc-form">
            <input type="text" id="proc-name-input" placeholder="Название процедуры" required />
            <label>Дата процедуры:</label>
            <input type="date" id="proc-date-input" required />
            <input type="number" id="proc-reminder-input" placeholder="Напоминать за N дней" required min="1"/>
            <button type="submit">Добавить процедуру</button>
            <button type="button" id="cancel-add-proc">Отмена</button>
        </form>
    `;
    proceduresListEl.innerHTML = formHtml;

    document.getElementById('add-proc-form').onsubmit = function(e) {
        e.preventDefault();
        const name = document.getElementById('proc-name-input').value.trim();
        const date = document.getElementById('proc-date-input').value;
        const reminder = parseInt(document.getElementById('proc-reminder-input').value);

        if (name && date && reminder) {
            const procedure = { name, date, reminder };
            pets[index].procedures.push(procedure);
            saveData();
            showPetDetails(index);
        }
    };

    document.getElementById('cancel-add-proc').onclick = () => showPetDetails(index);
}

function addPet() {
    const formHtml = `
        <form id="add-pet-form">
            <input type="text" id="pet-name-input" placeholder="Имя животного" required />
            <button type="submit">Добавить</button>
            <button type="button" id="cancel-add-pet">Отмена</button>
        </form>
    `;
    petsListEl.innerHTML = formHtml;

    document.getElementById('add-pet-form').onsubmit = function(e) {
        e.preventDefault();
        const name = document.getElementById('pet-name-input').value.trim();
        if (name) {
            pets.push({ name, procedures: [] });
            saveData();
            showPets();
        }
    };

    document.getElementById('cancel-add-pet').onclick = showPets;
}

document.getElementById('add-pet-btn').onclick = addPet;

showPets();
