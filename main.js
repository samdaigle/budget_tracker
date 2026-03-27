const income = document.querySelector(
  ".summary__item--balance > .summary__value",
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
const submitForm = document.querySelector(".btn--form");
const transactions = document.querySelector(".transactions");

function addNewTransaction(name, amount, category) {
  const newTransaction = document.createElement("div");
  newTransaction.classList.add("transaction");

  const transactionName = document.createElement("span");
  transactionName.textContent = name;
  transactionName.classList.add("transaction__name");
  newTransaction.appendChild(transactionName);

  const transactionAmount = document.createElement("span");
  transactionAmount.textContent = amount;
  transactionAmount.classList.add("transaction__amount");
  newTransaction.appendChild(transactionAmount);

  const transactionCategory = document.createElement("span");
  transactionCategory.textContent = category;
  transactionCategory.classList.add("transaction__category");
  newTransaction.appendChild(transactionCategory);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("transaction__delete");
  newTransaction.appendChild(deleteBtn);

  transactions.appendChild(newTransaction);
}

addNewTransaction("test", "test", "test");
