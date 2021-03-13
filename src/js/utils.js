export default function convertToMoney(amount) {
  return amount.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
  });
}
