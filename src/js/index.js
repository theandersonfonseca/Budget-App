const budget = () => {
  const inputNameIncome = document.querySelector('[data-inputNameIncome]');
  const inputTransactionIncome = document.querySelector(
    '[data-inputTransactionIncome]'
  );
  const inputNameExpense = document.querySelector('[data-inputNameExpense]');
  const inputTransactionExpense = document.querySelector(
    '[data-inputTransactionExpense]'
  );
  const submitInputsBtn = document.querySelectorAll('[data-btn]');

  const incomeAmountDisplay = document.querySelector(
    '[data-incomeAmountDisplay]'
  );
  const expenseAmountDisplay = document.querySelector(
    '[data-expenseAmountDisplay]'
  );

  const incomeHistoryDisplay = document.querySelector('[data-pushIncome]');
  const expenseHistoryDisplay = document.querySelector('[data-pushExpenses]');

  let incomeAmountTotal = 0;
  let expenseAmountTotal = 0;
  let balanceAmount = 0;

  const calculatePercentageToGraphic = () => {
    let percentage;

    balanceAmount <= 0
      ? (percentage =
          100 -
          (incomeAmountTotal / (expenseAmountTotal + incomeAmountTotal)) * 100)
      : (percentage =
          (expenseAmountTotal / (expenseAmountTotal + incomeAmountTotal)) *
          100);

    return Math.ceil(percentage);
  };

  const formatToMoney = (amount) => {
    const moneyAmount = amount.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL',
    });

    return moneyAmount;
  };

  const saveDataInLocalStorage = () => {
    const incomeHistory = document.querySelectorAll('[data-income]');
    const expenseHistory = document.querySelectorAll('[data-expense]');

    const incomeHistoryArr = [...incomeHistory].map((el) => el.innerHTML);
    const expenseHistoryArr = [...expenseHistory].map((el) => el.innerHTML);

    localStorage.setItem('incomeHistoryArr', JSON.stringify(incomeHistoryArr));

    localStorage.setItem(
      'expenseHistoryArr',
      JSON.stringify(expenseHistoryArr)
    );

    localStorage.setItem('incomeAmountTotal', incomeAmountTotal);
    localStorage.setItem('expenseAmountTotal', expenseAmountTotal);
    localStorage.setItem('balanceAmount', balanceAmount);
  };

  const updateAmountsInDisplay = (incomeOrExpenseDisplay, incomeOrExpense) => {
    const balanceDisplay = document.querySelector('[data-balance]');
    const graphic = document.querySelector('[data-graphic]');

    incomeOrExpenseDisplay.innerHTML =
      incomeOrExpense === 'income'
        ? formatToMoney(incomeAmountTotal)
        : formatToMoney(expenseAmountTotal);

    balanceDisplay.innerHTML = formatToMoney(balanceAmount);

    graphic.classList.remove([...graphic.classList][1]);
    graphic.classList.add(
      `balance__graphic--${calculatePercentageToGraphic()}`
    );

    calculatePercentageToGraphic();
    saveDataInLocalStorage();
  };

  const updateAmounts = (incomeOrExpense) => {
    if (incomeOrExpense === 'income') {
      incomeAmountTotal += +inputTransactionIncome.value || 0;
      balanceAmount = incomeAmountTotal - expenseAmountTotal;

      updateAmountsInDisplay(incomeAmountDisplay, 'income');
    } else {
      expenseAmountTotal += +inputTransactionExpense.value || 0;
      balanceAmount = incomeAmountTotal - expenseAmountTotal;

      updateAmountsInDisplay(expenseAmountDisplay, 'expenses');
    }
  };

  const removeTransaction = () => {
    const removeBtns = document.querySelectorAll('[data-remove]');

    const removeAmounts = (amount, incomeOrExpense) => {
      incomeOrExpense === 'income'
        ? (incomeAmountTotal -= amount)
        : (expenseAmountTotal -= amount);

      updateAmounts(incomeOrExpense);
    };

    const handleBtn = (e) => {
      saveDataInLocalStorage();
      e.stopImmediatePropagation();

      const transactionDisplay = e.target.parentNode;
      const incomeOrExpense = e.target.dataset.remove;

      const amount = +transactionDisplay.querySelector('[data-amount]').dataset
        .amount;

      transactionDisplay.remove();
      removeAmounts(amount, incomeOrExpense);
    };

    removeBtns.forEach((btn) => btn.addEventListener('click', handleBtn));
  };

  const createElement = (incomeOrExpense, name, amount) => {
    const el = document.createElement('div');
    el.classList.add('history__push-container');
    el.setAttribute(`data-${incomeOrExpense}`, '');

    el.innerHTML = `<div class="history__push-descriptions history__push-descriptions--${incomeOrExpense}">
                      <span class="history__push-text">${name}</span>
                      <span class="history__push-amount" data-amount="${amount}">
                        ${formatToMoney(amount)}
                      </span>
                    </div>

                    <i class="fas fa-trash history__remove-icon" data-remove="${incomeOrExpense}"></i>
                    `;

    return el;
  };

  const addToHistoryDisplay = (
    incomeOrExpense,
    name,
    amount,
    historyDisplay
  ) => {
    historyDisplay.appendChild(createElement(incomeOrExpense, name, amount));
    updateAmounts(incomeOrExpense);
    removeTransaction();
  };

  const cleanInputs = () => {
    [
      inputNameIncome,
      inputTransactionIncome,
      inputNameExpense,
      inputTransactionExpense,
    ].forEach((input) => (input.value = ''));
  };

  const handleIncomeOrExpense = (incomeOrExpense) => {
    incomeOrExpense === 'income'
      ? addToHistoryDisplay(
          incomeOrExpense,
          inputNameIncome.value,
          +inputTransactionIncome.value,
          incomeHistoryDisplay
        )
      : addToHistoryDisplay(
          incomeOrExpense,
          inputNameExpense.value,
          +inputTransactionExpense.value,
          expenseHistoryDisplay
        );
  };

  const handleInputs = (incomeOrExpense) => {
    const isIncomeInputsEmpty =
      !inputNameIncome.value.trim() || !inputTransactionIncome.value.trim();
    const isExpenseInputsEmpty =
      !inputNameExpense.value.trim() || !inputTransactionExpense.value.trim();

    if (incomeOrExpense === 'income') {
      if (isIncomeInputsEmpty) return;
    } else {
      if (isExpenseInputsEmpty) return;
    }

    return true;
  };

  const updatePageData = (incomeHistoryArr, expenseHistoryArr) => {
    incomeHistoryArr.forEach((income) => {
      const el = document.createElement('div');
      el.classList.add('history__push-container');
      el.setAttribute('data-income', '');

      el.innerHTML = income;

      incomeHistoryDisplay.appendChild(el);
    });

    expenseHistoryArr.forEach((expense) => {
      const el = document.createElement('div');
      el.classList.add('history__push-container');
      el.setAttribute('data-expense', '');

      el.innerHTML = expense;

      expenseHistoryDisplay.appendChild(el);
    });

    updateAmounts('income');
    updateAmounts('expenses');
  };

  const getDataFromLocalStorage = () => {
    if (localStorage.incomeHistoryArr || localStorage.expenseHistoryArr) {
      incomeAmountTotal = +localStorage.incomeAmountTotal;
      expenseAmountTotal = +localStorage.expenseAmountTotal;

      const incomeHistoryArr = JSON.parse(localStorage.incomeHistoryArr);
      const expenseHistoryArr = JSON.parse(localStorage.expenseHistoryArr);

      updatePageData(incomeHistoryArr, expenseHistoryArr);

      removeTransaction();
    }
  };

  getDataFromLocalStorage();

  const init = () => {
    submitInputsBtn.forEach((btn) =>
      btn.addEventListener('click', (e) => {
        e.preventDefault();

        const incomeOrExpense = e.target.dataset.btn;

        if (!handleInputs(incomeOrExpense)) return;

        handleIncomeOrExpense(incomeOrExpense);
        cleanInputs();
      })
    );
  };

  init();
};

window.addEventListener('DOMContentLoaded', budget);
