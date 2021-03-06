import { Budget } from './budget-class.js';
import { el } from './dom-elements.js';

const newBudget = new Budget(
  el.incomeDisplay,
  el.expenseDisplay,
  el.balanceDisplay,
  el.incomeHistoryDisplay,
  el.expenseHistoryDisplay,
  el.graphic
);

const isInputValid = (incomeOrExpense) => {
  const isIncomeInputsEmpty =
    !el.inputNameIncome.value.trim() || !el.inputTransactionIncome.value.trim();
  const isExpenseInputsEmpty =
    !el.inputNameExpense.value.trim() ||
    !el.inputTransactionExpense.value.trim();

  const nameAlreadyExistsMsg = 'Esse nome já existe, escolha outra!';
  const emptyInputMsg = 'Preencha todos os campos adequadamente!';

  if (incomeOrExpense === 'income' && isIncomeInputsEmpty) {
    window.alert(emptyInputMsg);
    return;
  }

  if (incomeOrExpense === 'expense' && isExpenseInputsEmpty) {
    window.alert(emptyInputMsg);
    return;
  }

  if (
    newBudget.checkIfNameAlreadyExists('income', el.inputNameIncome.value) ||
    newBudget.checkIfNameAlreadyExists('expense', el.inputNameExpense.value)
  ) {
    window.alert(nameAlreadyExistsMsg);
    return;
  }

  return true;
};

const cleanInputs = () => {
  [
    el.inputNameIncome,
    el.inputTransactionIncome,
    el.inputNameExpense,
    el.inputTransactionExpense,
  ].forEach((input) => (input.value = ''));
};

const handleIncomeOrExpense = (incomeOrExpense) => {
  newBudget.setIncomeOrExpense(
    incomeOrExpense,
    incomeOrExpense === 'income'
      ? el.inputNameIncome.value
      : el.inputNameExpense.value,
    incomeOrExpense === 'income'
      ? +el.inputTransactionIncome.value
      : +el.inputTransactionExpense.value
  );
};

el.submitInputsBtn.forEach((btn) =>
  btn.addEventListener('click', (e) => {
    const incomeOrExpense = e.target.dataset.btn;
    e.preventDefault();
    if (!isInputValid(incomeOrExpense)) return;
    handleIncomeOrExpense(incomeOrExpense);
    cleanInputs();
  })
);

newBudget.updateDataFromLocalStorage();
