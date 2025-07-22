const { createLogger, format, transports } = require('winston');

const customLevels = {
  levels: {
    auth: 0,
  },
};

const authLogger = createLogger({
  levels: customLevels.levels,
  transports: [
    new transports.File({
      filename: './logs/auth.log',
      maxsize: '5m',
      maxFiles: 3,
      level: 'auth',
    }),
  ],
});

module.exports = authLogger;