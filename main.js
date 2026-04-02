const transactions = [];
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
  const target = e.target.parentNode;
  const index = transactions.findIndex((value) => value.id === target.id);
  transactions.splice(index, 1);
  renderDisplay();
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
  if (
    !checkAmountValidity(amount.value) ||
    !checkTypeValidity() ||
    !checkCategoryValidity(category) ||
    !checkNameValidity(description.value)
  ) {
    return;
  }
  const amountValue = +amount.value;
  const newTransaction = {
    id: crypto.randomUUID(),
    name: description.value,
    amount: amountValue,
    type: getTransactionType(),
    category: category.options[category.selectedIndex].text,
  };
  transactions.push(newTransaction);
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

function checkTypeValidity() {
  if (!incomeBtn.checked && !expenseBtn.checked) {
    alert("Please choose income or expense.");
    return false;
  } else {
    return true;
  }
}

function checkAmountValidity(value) {
  if (value.trim() === "" || isNaN(value)) {
    amountError.textContent = "Please enter a valid amount.";
    return false;
  } else {
    return true;
  }
}

function checkNameValidity(value) {
  if (value.trim() === "") {
    alert("Please enter a valid name.");
    return false;
  } else {
    return true;
  }
}

function checkCategoryValidity(value) {
  if (value.selectedIndex === 0) {
    alert("Please choose a category");
    return false;
  } else {
    return true;
  }
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

renderDisplay();
