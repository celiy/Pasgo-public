const { createLogger, format, transports } = require('winston');

const customLevels = {
  levels: {
    time: 0,
  },
};

const timeLogger = createLogger({
  levels: customLevels.levels,
  transports: [
    new transports.File({
      filename: './logs/response-times.log',
      maxsize: '5m',
      maxFiles: 3,
      level: 'time',
    }),
  ],
});

module.exports = timeLogger;