const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');

require('dotenv').config();

const { getWords, sendWords, wordsToMessage } = require('./helpers');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(ctx =>
  ctx.replyWithMarkdown(
    `
✋ Ассаламу Алейкум, *${ctx.message.from.first_name}*! 

📚 Добро пожаловать в ингушский онлайн-словарь — Doshlorg.ru

Пришли мне любое слово и я постараюсь найти перевод в словаре.

❓ Подробнее о всех возможностях бота, жми сюда 👉 /help
`,
  ),
);

bot.help(ctx =>
  ctx.replyWithMarkdown(`
💡 Бот поддерживает следующие команды:

1️⃣ *инг кошка* — перевести на ингушской слово «кошка».
2️⃣ *рус циск* — перевести на русский слово «циск».

💬 Например, отправив команду «*инг родина*» (*без кавычек*) — бот найдет все слова / фразы, в определении которых содержится слово "родина".

📚 Бот создан специально для сайта Ингушского онлайн-словаря — Doshlorg.ru.
👨‍💻 Разработчик бота и сайта: *Арчаков Хаваж (@archakov06)*
`),
);

let words = {
  rus: [],
  ing: [],
};

bot.hears(/(инг|рус)\s(.+)/, async ctx => {
  const key = ctx.match[1] === 'инг' ? 'rus' : 'ing';
  const word = ctx.match[2];
  await getWords(word, key).then(data => {
    words[key] = data;
  });
  ctx.reply(wordsToMessage(words[key]), {
    parse_mode: 'Markdown',
  });
});

bot.hears(/.+/, async ctx => {
  const word = ctx.message.text;
  const langs = ['ing', 'rus'];
  let founded = false;

  for (let i = 0; i < langs.length; i++) {
    await getWords(word, langs[i]).then(data => {
      if (data.length) {
        ctx.reply(wordsToMessage(data), {
          parse_mode: 'Markdown',
        });
        founded = true;
      }
    });
  }

  if (!founded) {
    ctx.reply('Ничего не найдено 😞');
  }
  // ctx.reply(
  //   `Перевести «${word}»`,
  //   Markup.inlineKeyboard([
  //     Markup.callbackButton('На ингушский', `rus/${word}`),
  //     Markup.callbackButton('На русский', `ing/${word}`),
  //   ]).extra(),
  // );
  // Object.keys(words).forEach(key => words[key].length && ctx.reply(wordsToMessage(words[key])));
});

bot.action(/(ing|rus)\/(.+)/, async ctx => {
  sendWords(words[ctx.match[1]], ctx);
  ['ing', 'rus'].forEach(key => (words[key] = []));
});

bot.startPolling();
