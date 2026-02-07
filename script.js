// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;

tg.ready();

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

function showPets() {
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
    const pet = pets[index];
    petNameEl.textContent = pet.name;
    container.style.display = 'none';
    petDetailsEl.classList.remove('hidden');

    proceduresListEl.innerHTML = '';
    pet.procedures.forEach(proc => {
        const li = document.createElement('li');
        li.textContent = `${proc.name} — ${proc.date} (${proc.reminder} дней до напоминания)`;
        proceduresListEl.appendChild(li);
    });

    document.getElementById('back-btn').onclick = showPets;
    document.getElementById('add-procedure-btn').onclick = () => addProcedure(index);
}

function addPet() {
    // Показываем форму для ввода имени животного
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

function addProcedure(index) {
    const formHtml = `
        <form id="add-proc-form">
            <input type="text" id="proc-name-input" placeholder="Название процедуры" required />
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

document.getElementById('add-pet-btn').onclick = addPet;

showPets();
