const { createLogger, format, transports } = require('winston');

const customLevels = {
  levels: {
    error: 0,
  },
};

const errorLogger = createLogger({
  levels: customLevels.levels,
  transports: [
    new transports.File({
      filename: './logs/errors.log',
      maxsize: '5m',
      maxFiles: 3,
      level: 'error',
    }),
  ],
});

module.exports = errorLogger;