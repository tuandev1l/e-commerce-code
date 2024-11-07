export const priceSplit = (price: number) => {
  let priceStr = price.toString();
  const length = priceStr.length - 1;

  for (let i = length - 1; i >= 0; i--) {
    if ((length - i) % 3 === 0) {
      priceStr = priceStr.slice(0, i + 1) + '.' + priceStr.slice(i + 1);
    }
  }
  return priceStr;
};
