const transactions = [];

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
const transactionsDisplay = document.querySelector(".transactions");
const form = document.querySelector(".form");

function addTransactionElement(content, className) {
  const transactionElement = document.createElement("span");
  transactionElement.textContent = content;
  transactionElement.classList.add("transaction__item", className);
  return transactionElement;
}

function addNewTransaction(name, amount, category, id) {
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
  newTransaction.setAttribute("id", `${id}`);

  transactionsDisplay.appendChild(newTransaction);
}

function clearForm() {
  incomeBtn.checked = false;
  expenseBtn.checked = false;
  amount.value = "";
  designation.value = "";
  category.selectedIndex = 0;
}

submitBtn.addEventListener("click", () => {
  if (
    !checkAmountValidity(amount.value) ||
    !checkTypeValidity() ||
    !checkCategoryValidity(category) ||
    !checkNameValidity(designation.value)
  ) {
    return;
  }
  const amountValue = +amount.value;
  const newTransaction = {
    id: crypto.randomUUID(),
    name: designation.value,
    amount: amountValue,
    type: getTransactionType(),
    category: category.options[category.selectedIndex].text,
  };
  transactions.push(newTransaction);
  addNewTransaction(
    newTransaction.name,
    `$${newTransaction.amount.toFixed(2)}`,
    newTransaction.category,
    newTransaction.id,
  );
  const summaryValues = updateSummaryValues();
  updateSummaryDisplay(summaryValues);
  clearForm();
  form.classList.add("form__hidden");
});

addTransactionBtn.addEventListener("click", () => {
  form.classList.remove("form__hidden");
});

function accumulateSummary(a, b) {
  if (b.type == "income") {
    a.income += b.amount;
  } else if (b.type == "expense") {
    a.expenses += b.amount;
  }
  return a;
}

function updateSummaryValues() {
  const summaryValues = transactions.reduce((a, b) => accumulateSummary(a, b), {
    income: 0,
    expenses: 0,
    balance: 0,
  });
  summaryValues.balance = summaryValues.income - summaryValues.expenses;
  return summaryValues;
}

function updateSummaryDisplay(values) {
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
    alert("Please enter a valid amount.");
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
