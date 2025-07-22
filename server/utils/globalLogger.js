const { createLogger, format, transports } = require('winston');

const customLevels = {
  levels: {
    info: 0,
  },
};

const globalLogger = createLogger({
  levels: customLevels.levels,
  transports: [
    new transports.File({
      filename: './logs/globals.log',
      maxsize: '5m',
      maxFiles: 3,
      level: 'info',
    }),
  ],
});

module.exports = globalLogger;