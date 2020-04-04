const visualRecognitionService = require('../services/visual-recognition-service');

let serviceLimit = parseInt(process.env.IBM_VISUAL_RECOGNITION_LIMIT, 10) || Infinity;

global.bot.on('message', async (msg) => {
  if (!msg.photo) { return; }

  if (serviceLimit <= 0) {
    global.bot.sendMessage(
      msg.chat.id,
      'Sorry this bot reach the limit, try maybe in another day',
    );
    return;
  }

  const file = msg.photo[msg.photo.length - 1];

  const photo = global.bot.getFileStream(file.file_id);

  const classes = await visualRecognitionService(photo);

  const formattedClasses = classes.map((c) => `<b>${c.class}</b>(${parseInt(c.score * 100, 10)}%)`).join('\n');

  serviceLimit -= 1;

  global.bot.sendMessage(
    msg.chat.id,
    `This image problably have:\n${formattedClasses}`,
    { parse_mode: 'HTML' },
  );
});
