const visualRecognitionService = require('../services/visual-recognition-service');
const ServiceReachLimit = require('../errors/service-reach-limit');

let serviceLimit = parseInt(process.env.IBM_VISUAL_RECOGNITION_LIMIT, 10) || Infinity;

module.exports = async function visualRecognition(telegramParams) {
  if (serviceLimit <= 0) { throw new ServiceReachLimit('visual recognition service'); }

  const file = telegramParams.photo[telegramParams.photo.length - 1];

  const photo = global.bot.getFileStream(file.file_id);

  const classes = await visualRecognitionService(photo);

  const formattedClasses = classes.map((c) => `<b>${c.class}</b> (${parseInt(c.score * 100, 10)}%)`).join('\n');

  serviceLimit -= 1;

  await global.bot.sendMessage(
    telegramParams.chat.id,
    `This image problably have:\n${formattedClasses}`,
    { parse_mode: 'HTML' },
  );
};
