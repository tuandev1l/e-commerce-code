const { readFileSync, writeFileSync } = require('fs');

function toCamelCase(snakeStr) {
  return snakeStr.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

function convertKeysToCamelCase(obj) {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToCamelCase(item));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const newKey = toCamelCase(key);
      result[newKey] = convertKeysToCamelCase(obj[key]);
      return result;
    }, {});
  }
  return obj; // Return the value if it's neither an object nor an array
}

const data = JSON.parse(
  readFileSync('/home/tuantm/schooling/ending_project/crawl/products.json', {
    encoding: 'utf-8',
  })
);

const camelCaseData = convertKeysToCamelCase(data);
writeFileSync('./data.json', JSON.stringify(camelCaseData));
