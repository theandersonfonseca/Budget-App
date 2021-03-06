import { convertToMoney } from './utils.js';

export class Budget {
  constructor(
    incomeDisplay,
    expenseDisplay,
    balanceDisplay,
    incomeHistoryDisplay,
    expenseHistoryDisplay,
    graphic
  ) {
    this._incomeAmount = 0;
    this._expenseAmount = 0;
    this._balanceAmount = 0;
    this._incomeHistory = [];
    this._expenseHistory = [];

    this._incomeDisplay = incomeDisplay;
    this._expenseDisplay = expenseDisplay;
    this._balanceDisplay = balanceDisplay;
    this._incomeHistoryDisplay = incomeHistoryDisplay;
    this._expenseHistoryDisplay = expenseHistoryDisplay;
    this._graphic = graphic;
  }

  updateDataFromLocalStorage() {
    if (localStorage.getItem('incomeHistory') === null) return;

    this._incomeHistory = JSON.parse(localStorage.getItem('incomeHistory'));
    this._expenseHistory = JSON.parse(localStorage.getItem('expenseHistory'));

    this._updateAmountsTotal('income');
    this._updateAmountsTotal('expense');
  }

  setIncomeOrExpense(incomeOrExpense, name, amount) {
    incomeOrExpense === 'income'
      ? this._incomeHistory.push({ name, amount })
      : this._expenseHistory.push({ name, amount });

    this._updateAmountsTotal(incomeOrExpense);
  }

  _updateAmountsTotal(incomeOrExpense) {
    this._incomeAmount = this._incomeHistory.reduce((a, b) => a + b.amount, 0);
    this._expenseAmount = this._expenseHistory.reduce(
      (a, b) => a + b.amount,
      0
    );
    this._balanceAmount = this._incomeAmount - this._expenseAmount;

    this._addElementsToDom(
      incomeOrExpense === 'income' ? this._incomeAmount : this._expenseAmount,
      incomeOrExpense === 'income' ? this._incomeDisplay : this._expenseDisplay,
      incomeOrExpense === 'income' ? this._incomeHistory : this._expenseHistory,
      incomeOrExpense === 'income'
        ? this._incomeHistoryDisplay
        : this._expenseHistoryDisplay,

      incomeOrExpense
    );

    this._saveDataToLocalStorage();
  }

  _saveDataToLocalStorage() {
    localStorage.setItem('incomeHistory', JSON.stringify(this._incomeHistory));
    localStorage.setItem(
      'expenseHistory',
      JSON.stringify(this._expenseHistory)
    );
  }

  _addElementsToDom(amount, display, history, historyDisplay, incomeOrExpense) {
    historyDisplay.innerHTML = '';

    display.innerHTML = convertToMoney(amount);

    history.forEach((el) => {
      historyDisplay.appendChild(
        this._createElements(incomeOrExpense, el.name, el.amount)
      );
    });

    this._balanceDisplay.innerHTML = convertToMoney(this._balanceAmount);

    this._graphic.classList.remove([...this._graphic.classList][1]);
    this._graphic.classList.add(
      `balance__graphic--${this._calculateIncomeAndExpenseRatio()}`
    );

    this._addClickEventOnRemoveButtons();
  }

  _createElements(incomeOrExpense, name, amount) {
    const div = document.createElement('div');
    div.classList.add('history__push-container');
    div.setAttribute(`data-${incomeOrExpense}`, '');

    div.innerHTML = `<div class="history__push-descriptions history__push-descriptions--${incomeOrExpense}">
                        <span class="history__push-text">${name}</span>
                        <span class="history__push-amount" data-amount="${amount}">
                          ${convertToMoney(amount)}
                        </span>
                      </div>
  
                      <i class="fas fa-trash history__remove-icon" data-remove="${incomeOrExpense}"></i>
                      `;

    return div;
  }

  _addClickEventOnRemoveButtons() {
    const removeBtns = document.querySelectorAll('[data-remove]');

    removeBtns.forEach((btn) =>
      btn.addEventListener('click', (e) => {
        const transactionName =
          e.target.previousElementSibling.children[0].innerHTML;

        e.target.dataset.remove === 'income'
          ? this._removeIncomeOrExpense('income', transactionName)
          : this._removeIncomeOrExpense('expense', transactionName);
      })
    );
  }

  _removeIncomeOrExpense(incomeOrExpense, name) {
    incomeOrExpense === 'income'
      ? (this._incomeHistory = this._incomeHistory.filter(
          (el) => el.name !== name
        ))
      : (this._expenseHistory = this._expenseHistory.filter(
          (el) => el.name !== name
        ));

    this._updateAmountsTotal(incomeOrExpense);
  }

  _calculateIncomeAndExpenseRatio() {
    const percentage =
      this._balanceAmount <= 0
        ? 100 -
          (this._incomeAmount / (this._expenseAmount + this._incomeAmount)) *
            100
        : (this._expenseAmount / (this._expenseAmount + this._incomeAmount)) *
          100;

    return Math.ceil(percentage);
  }

  checkIfNameAlreadyExists(incomeOrExpense, name) {
    if (incomeOrExpense === 'income') {
      return this._incomeHistory.some((el) => el.name === name);
    } else {
      return this._expenseHistory.some((el) => el.name === name);
    }
  }
}
