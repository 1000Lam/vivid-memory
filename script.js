const amongus = document.getElementById("amongus")
const console = document.getElementById('console');

function add(){
    amongus.value = Number(amongus.value) + 25
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function logToConsole(message) {
    const time = new Date().toLocaleTimeString();
    console.value += `[${time}] ${message}\n`;
    console.scrollTop = console.scrollHeight;
}



async function clearConsole() {
    console.value = "";
    logToConsole("Console cleared.");
    await delay(1000);
    console.value = "";
}

// test
document.addEventListener('DOMContentLoaded', () => {
    logToConsole('System initialized.');
    setTimeout(() => logToConsole('Connected to bank server.'), 1000);
    setTimeout(() => logToConsole('User John deposited $500.'), 2000);
    setTimeout(() => logToConsole('Balance updated: $1500.'), 3000);
    setTimeout(() => clearConsole(), 4000);
});

document.getElementById('convert-btn').addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('input-balance').value);
    const currency = document.getElementById('input-currency').value;
    let rate = 1;
    switch (currency) {
        case 'usd': rate = 36.7; break;
        case 'eur': rate = 39.5; break;
        case 'jpy': rate = 0.25; break;
    }
    document.getElementById('output-balance').value = (amount * rate).toFixed(2);
});