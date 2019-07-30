const env = require('dotenv');
env.config()

'use strict';
const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.label({ label: path.basename(process.mainModule.filename) }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(
          info =>
            `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
        )
      )
    }),
    new transports.DailyRotateFile({
      name: 'uaa.log',
      filename: path.join(__dirname, 'logs', 'uaa.log'),
      format: format.combine(
        format.printf(
          info =>
            `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
        )
      )
    })
  ]
});

module.exports = logger;