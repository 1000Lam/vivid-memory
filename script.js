const console = document.getElementById("console");
const accountBalance = document.getElementById("account-balance");
const cashBalance = document.getElementById("cash-balance");
const actionBalance = document.getElementById("action-balance")

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

document.addEventListener("DOMContentLoaded", () => {
    clearConsole()
    logToConsole("System initialized.");
});

document.getElementById("convert-btn").addEventListener("click", () => {
    const amount = parseFloat(document.getElementById("input-balance").value);
    const currency = document.getElementById("input-currency").value;
    let rate = 1;
    switch (currency) {
        case "usd": rate = 36.7; break;
        case "eur": rate = 39.5; break;
        case "jpy": rate = 0.25; break;
    }
    const result = (amount * rate).toFixed(2);
    document.getElementById("output-balance").value = (amount * rate).toFixed(2);
    logToConsole(`Converted ${amount} ${currency.toUpperCase()} -> ${result} THB`)
});

function changeBalance(){
    const acc = parseFloat(accountBalance.value).toFixed(2) || 1000;
    const cash = parseFloat(cashBalance.value).toFixed(2) || 1000;
    logToConsole(`Current account balance: ${acc}, Current cash balance: ${cash}`);
}
document.getElementById("change-btn").addEventListener("click", () =>{
    changeBalance()
})

document.getElementById("actions-proceed").addEventListener("click", () =>{
    const act = parseFloat(actionBalance.value) || 1;
    const actions = document.getElementById("actions").value;
    if(actions == "deposit"){
        accountBalance += act
    } else{
        accountBalance -= act
    }
    document.getElementById("account-balance").value = accountBalance
    changeBalance()
})