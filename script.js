const themeToggle = document.getElementById("theme-toggle");
const historyList = document.getElementById("history-list");
const display = document.getElementById("display");
const clearHistoryBtn = document.getElementById("clear-history");

let history = [];

/* ========================
   HISTORIAL
======================== */

clearHistoryBtn.addEventListener("click", () => {
    history = [];
    updateHistoryUI();
    localStorage.removeItem("calculatorHistory");
});

function updateHistoryUI() {
    historyList.innerHTML = "";

    history.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;

        li.addEventListener("click", () => {
            const expression = item.split(" = ")[0];
            display.value = expression;
        });

        historyList.appendChild(li);
    });
}

function saveHistory() {
    localStorage.setItem("calculatorHistory", JSON.stringify(history));
}

function loadHistory() {
    const stored = localStorage.getItem("calculatorHistory");
    if (stored) {
        history = JSON.parse(stored);
        updateHistoryUI();
    }
}

/* ========================
   THEME
======================== */

function loadTheme() {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        themeToggle.textContent = "☀️";
    } else {
        themeToggle.textContent = "🌙";
    }
}

function toggleTheme() {
    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "☀️";
    } else {
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "🌙";
    }
}

themeToggle.addEventListener("click", toggleTheme);

/* ========================
   CALCULADORA
======================== */

function appendValue(value) {
    display.value += value;
}

function clearDisplay() {
    display.value = "";
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

function calculate() {
    try {
        const expression = display.value.trim();
        if (expression === "") return;

        if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
            display.value = "Error";
            return;
        }

        const result = new Function("return " + expression)();
        const operation = `${expression} = ${result}`;

        history.unshift(operation);
        saveHistory();
        updateHistoryUI();

        display.value = result;

    } catch {
        display.value = "Error";
    }
}

/* ========================
   EVENTOS
======================== */

document.querySelectorAll(".buttons button").forEach(button => {
    button.addEventListener("click", () => {

        const value = button.dataset.value;
        const action = button.dataset.action;

        if (value) appendValue(value);
        if (action === "clear") clearDisplay();
        if (action === "delete") deleteLast();
        if (action === "calculate") calculate();

    });
});

document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (key === "Enter") {
        event.preventDefault();
        calculate();
        return;
    }

    if (key === "Backspace") {
        event.preventDefault();
        deleteLast();
        return;
    }

    if (key === "Escape") {
        clearDisplay();
        return;
    }

    if (!isNaN(key)) appendValue(key);

    if (["+", "-", "*", "/", "."].includes(key)) {
        appendValue(key);
    }
});

/* ========================
   INIT
======================== */

loadHistory();
loadTheme();
