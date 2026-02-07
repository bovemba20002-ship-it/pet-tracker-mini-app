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
    const name = prompt("Введите имя животного:");
    if (name) {
        pets.push({ name, procedures: [] });
        saveData();
        showPets();
    }
}

function addProcedure(index) {
    const procName = prompt("Название процедуры:");
    const dateStr = prompt("Дата процедуры (ГГГГ-ММ-ДД):");
    const reminder = prompt("Напоминать за сколько дней?");

    if (procName && dateStr && reminder) {
        const procedure = {
            name: procName,
            date: dateStr,
            reminder: parseInt(reminder)
        };
        pets[index].procedures.push(procedure);
        saveData();
        showPetDetails(index);
    }
}

document.getElementById('add-pet-btn').onclick = addPet;

showPets();