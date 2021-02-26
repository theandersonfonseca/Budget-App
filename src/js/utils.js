const utils = {
  convertToMoney(amount) {
    return amount.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL',
    });
  },
};

export const { convertToMoney } = utils;
