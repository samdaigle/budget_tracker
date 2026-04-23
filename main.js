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
const transactions = loadTransactions();

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
  newTransaction.setAttribute("id", id);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("transaction__delete");
  deleteBtn.dataset.id = id;
  newTransaction.appendChild(deleteBtn);

  return newTransaction;
}

transactionsDisplay.addEventListener("click", (e) => {
  if (e.target.classList.contains("transaction__delete")) {
    const targetId = e.target.dataset.id;
    removeFromTransactions(targetId);
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
  const transactionType = incomeBtn.checked
    ? "income"
    : expenseBtn.checked
      ? "expense"
      : null;
  const inputs = {
    type: transactionType,
    name: description.value,
    amount: Number(amount.value),
    category: category.options[category.selectedIndex].value,
  };
  const [isInputValid, errors] = validateForm(inputs);
  if (!isInputValid) {
    displayErrors(errors);
    return;
  }

  inputs.id = crypto.randomUUID();
  addToTransactions(inputs);
  clearForm();
  form.classList.add("form__hidden");
});

cancelBtn.addEventListener("click", () => {
  clearForm();
  form.classList.add("form__hidden");
});

addTransactionBtn.addEventListener("click", () => {
  form.classList.remove("form__hidden");
});

function buildSummaryObject(transactionData) {
  const summaryValues = transactionData.reduce(
    (a, b) => {
      if (b.type === "income") {
        a.income += b.amount;
      } else if (b.type === "expense") {
        a.expenses += b.amount;
      }
      a.balance = a.income - a.expenses;
      return a;
    },
    {
      income: 0,
      expenses: 0,
      balance: 0,
    },
  );
  return summaryValues;
}

function updateSummaryDisplay(values) {
  income.textContent = `$${values.income.toFixed(2)}`;
  expenses.textContent = `$${values.expenses.toFixed(2)}`;
  balance.textContent = `$${values.balance.toFixed(2)}`;
}

function handleSummaryUpdates(transactionData) {
  const summaryValues = buildSummaryObject(transactionData);
  updateSummaryDisplay(summaryValues);
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

function displayNoTransactions() {
  const noTransactions = document.createElement("span");
  noTransactions.textContent = "No Recent Transactions";
  noTransactions.classList = "transaction__none";
  transactionsDisplay.appendChild(noTransactions);
}

function renderDisplay(display) {
  transactionsDisplay.innerHTML = "";
  if (display.length === 0) {
    displayNoTransactions();
    return;
  }
  display.forEach((e) => {
    const transaction = createTransactionElement(e);
    transactionsDisplay.appendChild(transaction);
  });
}

function getStoredData() {
  const storedItems = localStorage.getItem("transactions");
  if (storedItems === null) {
    return [];
  }
  try {
    return JSON.parse(storedItems);
  } catch {
    return [];
  }
}

function validateId(id) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

function validateCategory(category) {
  return categories.includes(category);
}

function validateStoredData(data) {
  return (
    validateId(data.id) &&
    checkNumberValidity(data.amount) &&
    checkNameValidity(data.name) &&
    checkTypeValidity(data.type) &&
    validateCategory(data.category)
  );
}

function loadTransactions() {
  const storedTransactions = getStoredData();
  return storedTransactions.filter(validateStoredData);
}

function updateLocalStorage(transactionData) {
  const dataForStorage = JSON.stringify(transactionData);
  window.localStorage.setItem("transactions", dataForStorage);
}

function findIndexById(array, id) {
  return array.findIndex((value) => value.id === id);
}

function addToTransactions(inputs) {
  transactions.push(inputs);
  handleTransactionUpdates();
}

function removeFromTransactions(id) {
  const index = findIndexById(transactions, id);
  if (index === -1) {
    return;
  }
  transactions.splice(index, 1);
  handleTransactionUpdates();
}

function handleTransactionUpdates() {
  updateLocalStorage(transactions);
  handleSummaryUpdates(transactions);
  renderDisplay(transactions);
}

handleTransactionUpdates();
