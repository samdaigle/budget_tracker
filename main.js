let incomeValue = 0;
let expenseValue = 0;
let balanceValue = 0;

const income = document.querySelector(
  ".summary__item--income > .summary__value",
);
const expenses = document.querySelector(
  ".summary__item--expense > .summary__value",
);
const balance = document.querySelector(
  ".summary__item--balance > .summary__value",
);
const addTransactionBtn = document.querySelector(".btn--primary");
const incomeBtn = document.querySelector("#income-button");
const expenseBtn = document.querySelector("#expense-button");
const amount = document.querySelector("#amount");
const category = document.querySelector("#category-select");
const designation = document.querySelector("#designation");
const submitBtn = document.querySelector(".btn--form");
const transactions = document.querySelector(".transactions");

function addTransactionElement(content, className) {
  const transactionElement = document.createElement("span");
  transactionElement.textContent = content;
  transactionElement.classList.add("transaction__item", className);
  return transactionElement;
}

function addNewTransaction(name, amount, category) {
  const newTransaction = document.createElement("div");
  newTransaction.classList.add("transaction");

  const transactionName = addTransactionElement(name, "transaction__name");
  newTransaction.appendChild(transactionName);

  const transactionAmount = addTransactionElement(
    amount,
    "transaction__amount",
  );
  newTransaction.appendChild(transactionAmount);

  const transactionCategory = addTransactionElement(
    category,
    "transaction__category",
  );
  newTransaction.appendChild(transactionCategory);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("transaction__delete");
  deleteBtn.addEventListener("click", () => {
    newTransaction.remove();
  });
  newTransaction.appendChild(deleteBtn);

  transactions.appendChild(newTransaction);
}

function clearForm() {
  incomeBtn.checked = false;
  expenseBtn.checked = false;
  amount.value = "";
  designation.value = "";
  category.selectedIndex = 0;
}

submitBtn.addEventListener("click", () => {
  if (!checkAmountValidity(amount.value)) {
    return;
  }
  const amountValue = +amount.value;
  addNewTransaction(
    designation.value,
    `$${amountValue.toFixed(2)}`,
    category[category.selectedIndex].textContent,
  );
  getTransactionValues();
  updateSummary();
  clearForm();
});

function updateSummaryItem(value, element) {
  element.textContent = `$${value.toFixed(2)}`;
}

function updateSummary() {
  updateSummaryItem(balanceValue, balance);
  updateSummaryItem(incomeValue, income);
  updateSummaryItem(expenseValue, expenses);
}

function getTransactionValues() {
  if (incomeBtn.checked) {
    incomeValue += +amount.value;
  } else {
    expenseValue += +amount.value;
  }

  balanceValue = incomeValue - expenseValue;
}

function checkAmountValidity(value) {
  if (value.trim() === "" || isNaN(value)) {
    alert("Please enter a valid number");
    return false;
  } else {
    return true;
  }
}
