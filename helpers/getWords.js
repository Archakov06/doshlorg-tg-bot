const axios = require('axios');

const getWords = (word, lang) =>
  axios
    .get(
      `https://doshlorg.ru/api/words?search=${encodeURIComponent(word)}&limit=5&language=${lang}`,
    )
    .then(({ data }) => {
      return data.data;
    });

module.exports = getWords;
