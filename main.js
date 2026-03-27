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
const submitBtn = document.querySelector(".btn--form");
const transactions = document.querySelector(".transactions");

function addTransactionElement(content, className) {
  const transactionElement = document.createElement("span");
  transactionElement.textContent = content;
  transactionElement.classList.add(className);
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
  newTransaction.appendChild(deleteBtn);

  transactions.appendChild(newTransaction);
}

addNewTransaction("Starbucks", "5.67", "Coffee");

incomeBtn.addEventListener("click", () => {
  expenseBtn.checked = false;
});

expenseBtn.addEventListener("click", () => {
  incomeBtn.checked = false;
});

function clearForm() {
  incomeBtn.checked = false;
  expenseBtn.checked = false;
  amount.value = "";
  category.selectedIndex = 0;
}

submitBtn.addEventListener("click", () => {
  clearForm();
});
