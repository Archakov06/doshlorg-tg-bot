const wordsToMessage = require('./wordsToMessage');

const sendWords = async (data, ctx) => {
  if (data.length) {
    const words = wordsToMessage(data);
    await ctx.editMessageText(words, {
      parse_mode: 'Markdown',
    });
  } else {
    await ctx.editMessageText('Ничего не найдено 😞');
  }
};

module.exports = sendWords;
