const console = document.getElementById("console");
const accountBalance = document.getElementById("account-balance");
const cashBalance = document.getElementById("cash-balance");
const actionBalance = document.getElementById("action-balance");
const convertBtn = document.getElementById("convert-btn");
const inputBalance = document.getElementById("input-balance");
const outputBalance = document.getElementById("output-balance");
const currencySelect = document.getElementById("input-currency").value.toUpperCase();
const CACHE_KEY = "currencyRates";
const CACHE_TIME_KEY = "currencyRatesTimestamp";
const CACHE_DURATION = 3 * 24 * 60 * 60 * 1000;
//little bit of tomfoolery never hurt anyone right
let lineNumber = 1

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function logToConsole(message) {
    console.value += `${lineNumber} ${message}\n`;
    console.scrollTop = console.scrollHeight;
    lineNumber += 1
}

async function clearConsole() {
    console.value = "";
    lineNumber = 1
}


async function fetchAndCacheRates() {
    const now = Date.now();
    const cachedRates = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
    const cachedTime = parseInt(localStorage.getItem(CACHE_TIME_KEY) || "0");

    if (cachedRates["USD"] && now - cachedTime < CACHE_DURATION) {
        return cachedRates;
    }

    const currencies = ["USD", "EUR", "JPY" , "THB"];
    const rates = {};
// todo -> fix the api redundence
    for (let cur of currencies) {
        try {
            const response = await fetch(`https://open.er-api.com/v6/latest/${cur}`);
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            const data = await response.json();
            if (data.result !== "success" || !data.rates.THB) throw new Error("Rate not found");
            rates[cur] = data.rates.THB;
        } catch (error) {
            console.error(`Error fetching ${cur}:`, error);
            if (cachedRates[cur]) rates[cur] = cachedRates[cur];
            else rates[cur] = 1;
        }
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(rates));
    localStorage.setItem(CACHE_TIME_KEY, now.toString());
    return rates;
}

document.addEventListener("DOMContentLoaded", () => {
    clearConsole();
    logToConsole("System initialized.");
});

convertBtn.addEventListener("click", async () => {
    const amount = parseFloat(document.getElementById("input-balance").value) || 0;
    const currency = document.getElementById("input-currency").value.toUpperCase();
    const rates = await fetchAndCacheRates();
    const rate = rates[currency] || 1;
    const result = (amount * rate).toFixed(2);
    document.getElementById("output-balance").value = result;
    logToConsole(`Converted ${amount} ${currency} → ${result} THB (Rate: ${rate})`);
});

function changeBalance(){
    const acc = parseFloat(accountBalance.value).toFixed(2) || 1000;
    const cash = parseFloat(cashBalance.value).toFixed(2) || 1000;
    logToConsole(`Current account balance: ${acc}, Current cash balance: ${cash}`);
}
document.getElementById("change-btn").addEventListener("click", () =>{
    changeBalance();
})

document.getElementById("actions-proceed").addEventListener("click", () =>{
    const actInput = document.getElementById("actions-balance");
    const act = parseFloat(actInput.value) || 1;
    const actions = document.getElementById("actions").value;

    const accInput = document.getElementById("account-balance");
    let acc = parseFloat(accInput.value) || 0;
    if (actions === "deposit") {
        acc += act;
    } else {
        acc -= act;
    }
    accInput.value = acc;
    logToConsole(`${actions.toUpperCase()} of ${act} -> New balance: ${acc}`);
});