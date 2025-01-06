let totalAmount = document.getElementById("total-amount");
let userAmount = document.getElementById("user-amount");
const checkAmountButton = document.getElementById("check-amount");
const totalAmountButton = document.getElementById("total-amount-button");
const productTitle = document.getElementById("product-title");
const errorMessage = document.getElementById("budget-error");
const productTitleError = document.getElementById("product-title-error");
const amount = document.getElementById("amount");
const expenditureValue = document.getElementById("expenditure-value");
const balanceValue = document.getElementById("balance-amount");
const list = document.getElementById("list");

// Load saved data on page load
window.addEventListener("DOMContentLoaded", () => {
    const budget = localStorage.getItem("budget");
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    if (budget) {
        amount.innerHTML = budget;
        balanceValue.innerText = budget - parseInt(expenditureValue.innerText);
    }

    expenses.forEach(item => listCreator(item.expenseName, item.expenseValue, item.dateTime));

    const totalExpenditure = expenses.reduce((sum, item) => sum + parseInt(item.expenseValue), 0);
    expenditureValue.innerText = totalExpenditure;
    balanceValue.innerText = budget - totalExpenditure;
});

// Save budget to localStorage
totalAmountButton.addEventListener("click", () => {
    let tempAmount = totalAmount.value;
    if (tempAmount <= 0) {
        errorMessage.innerText = "Value cannot be empty or negative.";
        errorMessage.style.color = "red";
        errorMessage.classList.remove("hide");
    } else {
        errorMessage.classList.add("hide");
        amount.innerHTML = tempAmount;
        balanceValue.innerText = tempAmount - parseInt(expenditureValue.innerText);
        localStorage.setItem("budget", tempAmount);
        totalAmount.value = "";
    }
});

// Save expenses to localStorage
checkAmountButton.addEventListener("click", () => {
    if (!userAmount.value || !productTitle.value) {
        productTitleError.innerText = "Values cannot be empty.";
        productTitleError.style.color = "red";
        return false;
    }

    let expenseName = productTitle.value;
    let expenseValue = userAmount.value;
    let now = new Date();
    let dateTime = `${now.toLocaleDateString()}, ${now.toLocaleTimeString()}`;
    
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.push({ expenseName, expenseValue, dateTime });
    localStorage.setItem("expenses", JSON.stringify(expenses));

    // Update expenditure and balance
    let newExpenditure = parseInt(expenditureValue.innerText) + parseInt(expenseValue);
    expenditureValue.innerText = newExpenditure;
    balanceValue.innerText = parseInt(amount.innerHTML) - newExpenditure;

    listCreator(expenseName, expenseValue, dateTime);
    productTitle.value = "";
    userAmount.value = "";
});

// Create list item
function listCreator(expenseName, expenseValue, dateTime) {
    let sublistContent = document.createElement("div");
    sublistContent.classList.add("sublist-content", "flex-space");
    list.appendChild(sublistContent);

    sublistContent.innerHTML = `
        <p class="product">${expenseName}</p>
        <p class="amount">${expenseValue}</p>
        <p class="date-time">${dateTime}</p>
    `;

    let editButton = document.createElement("button");
    editButton.classList.add("fa-solid", "fa-pen-to-square", "edit");
    editButton.style.fontSize = "1.2em";
    editButton.addEventListener("click", () => modifyElement(editButton, true));

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("fa-solid", "fa-trash-can", "delete");
    deleteButton.style.fontSize = "1.2em";
    deleteButton.addEventListener("click", () => modifyElement(deleteButton));

    sublistContent.appendChild(editButton);
    sublistContent.appendChild(deleteButton);
}

// Function to modify list item
function modifyElement(element, edit = false) {
    let parentDiv = element.parentElement;
    let parentAmount = parentDiv.querySelector(".amount").innerText;
    let parentProduct = parentDiv.querySelector(".product").innerText;

    // Handle Edit Action
    if (edit) {
        productTitle.value = parentProduct;
        userAmount.value = parentAmount;
    }

    // Remove the expense from the list
    parentDiv.remove();

    // Update expenditure and balance
    updateExpenditureAndBalance(parentAmount);

    // Remove the expense from localStorage
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses = expenses.filter(expense => expense.expenseName !== parentProduct || expense.expenseValue !== parentAmount);
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Update expenditure and balance after removing or editing an expense
function updateExpenditureAndBalance(amount) {
    let newExpenditure = parseInt(expenditureValue.innerText) - parseInt(amount);
    expenditureValue.innerText = newExpenditure;
    balanceValue.innerText = parseInt(amount.innerHTML) - newExpenditure;
}
