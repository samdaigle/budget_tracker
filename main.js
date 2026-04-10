const transactions = pullLocalStorage();
const categories = [
  "paycheck",
  "rent",
  "utilities",
  "insurance",
  "gas",
  "transportation",
  "groceries",
  "dining out",
  "haircut",
  "clothing",
  "entertainment",
];

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
const description = document.querySelector("#description");
const submitBtn = document.querySelector("#submit-btn");
const cancelBtn = document.querySelector(".btn--cancel");
const transactionsDisplay = document.querySelector(".transactions");
const form = document.querySelector(".form");
const amountError = document.querySelector(".amount-error");

categories.forEach((e) => {
  const option = document.createElement("option");
  option.setAttribute("value", e);
  option.textContent = e;
  category.appendChild(option);
});

function addTransactionElement(content, className) {
  const transactionElement = document.createElement("span");
  transactionElement.textContent = content;
  transactionElement.classList.add("transaction__item", className);
  return transactionElement;
}

function createTransactionElement(object) {
  const amount = object.amount;
  const category = object.category;
  const id = object.id;
  const name = object.name;

  const newTransaction = document.createElement("div");
  newTransaction.classList.add("transaction");

  const transactionName = addTransactionElement(name, "transaction__name");
  newTransaction.appendChild(transactionName);

  const transactionAmount = addTransactionElement(
    `$${amount.toFixed(2)}`,
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
  newTransaction.appendChild(deleteBtn);
  newTransaction.setAttribute("id", id);

  return newTransaction;
}

transactionsDisplay.addEventListener("click", (e) => {
  if (e.target.className === "transaction__delete") {
    const target = e.target.parentNode;
    const index = transactions.findIndex((value) => value.id === target.id);
    transactions.splice(index, 1);
    updateLocalStorage();
    renderDisplay();
  }
});

function clearForm() {
  incomeBtn.checked = false;
  expenseBtn.checked = false;
  amount.value = "";
  description.value = "";
  category.selectedIndex = 0;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  clearErrors();
  const inputs = {
    type: getTransactionType(),
    name: description.value,
    amount: Number(amount.value),
    category: category.options[category.selectedIndex].value,
  };
  const [isInputValid, errors] = validateForm(inputs);
  if (!isInputValid) {
    displayErrors(errors);
    return;
  }

  const newTransaction = {
    id: crypto.randomUUID(),
    name: inputs.name,
    amount: inputs.amount,
    type: inputs.type,
    category: inputs.category,
  };
  transactions.push(newTransaction);
  updateLocalStorage();
  clearForm();
  form.classList.add("form__hidden");
  renderDisplay();
});

cancelBtn.addEventListener("click", () => {
  clearForm();
  form.classList.add("form__hidden");
});

addTransactionBtn.addEventListener("click", () => {
  form.classList.remove("form__hidden");
});

function buildSummaryObject() {
  const summaryValues = transactions.reduce(
    (a, b) => {
      if (b.type === "income") {
        a.income += b.amount;
      } else if (b.type === "expense") {
        a.expenses += b.amount;
      }
      return a;
    },
    {
      income: 0,
      expenses: 0,
      balance: 0,
    },
  );
  summaryValues.balance = summaryValues.income - summaryValues.expenses;
  return summaryValues;
}

function updateSummaryDisplay() {
  const values = buildSummaryObject();
  income.textContent = `$${values.income.toFixed(2)}`;
  expenses.textContent = `$${values.expenses.toFixed(2)}`;
  balance.textContent = `$${values.balance.toFixed(2)}`;
}

function checkTypeValidity(type) {
  return type === "income" || type === "expense";
}

function checkNumberValidity(value) {
  return !isNaN(value) && value > 0;
}

function checkNameValidity(value) {
  return value.trim() !== "";
}

function checkCategoryValidity(value) {
  return value !== "";
}

function validateForm(object) {
  const errors = [];
  let isFormValid = true;

  if (!checkTypeValidity(object.type)) {
    isFormValid = false;
    errors.push({ field: "type", message: "Pick a type" });
  }
  if (!checkNumberValidity(object.amount)) {
    isFormValid = false;
    errors.push({ field: "amount", message: "Enter a positive number" });
  }
  if (!checkNameValidity(object.name)) {
    isFormValid = false;
    errors.push({ field: "name", message: "Enter a name" });
  }
  if (!checkCategoryValidity(object.category)) {
    isFormValid = false;
    errors.push({ field: "category", message: "Pick a category" });
  }
  return [isFormValid, errors];
}

function displayErrors(array) {
  if (array.length === 0) {
    return;
  }

  array.forEach((e) => {
    const errorClass = `.${e.field}-error`;
    const errorDisplay = document.querySelector(errorClass);
    errorDisplay.textContent = e.message;
  });
}

function clearErrors() {
  const errorDisplays = document.querySelectorAll(".error");
  errorDisplays.forEach((e) => {
    e.textContent = "";
  });
}

function getTransactionType() {
  if (incomeBtn.checked) {
    return "income";
  } else if (expenseBtn.checked) {
    return "expense";
  }
}

function displayNoTransactions() {
  const noTransactions = document.createElement("span");
  noTransactions.textContent = "No Recent Transactions";
  noTransactions.classList = "transaction__none";
  transactionsDisplay.appendChild(noTransactions);
}

function renderDisplay() {
  updateSummaryDisplay();
  transactionsDisplay.innerHTML = "";
  if (transactions.length === 0) {
    displayNoTransactions();
    return;
  }
  transactions.forEach((e) => {
    const transaction = createTransactionElement(e);
    transactionsDisplay.appendChild(transaction);
  });
}

function pullLocalStorage() {
  const items = [];
  const storedItems = localStorage.getItem("transactions");
  if (!storedItems) {
    return items;
  }
  const convertedItems = JSON.parse(storedItems);
  return convertedItems;
}

function updateLocalStorage() {
  localStorage.removeItem("transactions");
  const dataForStorage = JSON.stringify(transactions);
  window.localStorage.setItem("transactions", dataForStorage);
}

renderDisplay();
