const VisualRecognitionService = require('../services/visual-recognition-service');

let serviceLimit = parseInt(process.env.IBM_VISUAL_RECOGNITION_LIMIT, 10) || Infinity;

module.exports = (bot) => {
  bot.on('message', async (msg) => {
    if (!msg.photo) { return undefined; }

    if (serviceLimit <= 0) {
      return bot.sendMessage(
        msg.chat.id,
        'Sorry this bot reach the limit, try maybe in another day',
      );
    }

    const file = msg.photo[msg.photo.length - 1];

    const photo = bot.getFileStream(file.file_id);

    const classes = await new VisualRecognitionService(photo).call();

    const formattedClasses = classes.map((c) => `<b>${c.class}</b>(${parseInt(c.score * 100, 10)}%)`).join('\n');

    serviceLimit -= 1;

    return bot.sendMessage(
      msg.chat.id,
      `This image problably have:\n${formattedClasses}`,
      { parse_mode: 'HTML' },
    );
  });
};
