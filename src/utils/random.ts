const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomFloat = (lower: number, upper: number) => Math.random() * (upper - lower) + lower;

const getRandomFloatFixed = (lower: number, upper: number, digits = 1) => Number((getRandomFloat(lower, upper) + 1 / Math.pow(10, digits + 1)).toFixed(digits));

const getRandomItemsInArray = <T>(items: T[]): T[] => {
  const start = getRandomInteger(0, items.length - 1);
  const end = start + getRandomInteger(start, items.length);
  return items.slice(start, end);
};

const getRandomItemInArray = <T>(items: T[]): T =>
  items[getRandomInteger(0, items.length - 1)];

export { getRandomInteger, getRandomItemsInArray, getRandomItemInArray, getRandomFloatFixed };
