const wordsToMessage = data =>
  data
    .map(
      w =>
        `*${w.word}* — ${w[w.hasOwnProperty('translates') ? 'translates' : 'words']
          .map(t => t.word)
          .join(', ')}`,
    )
    .join('\n');

module.exports = wordsToMessage;
