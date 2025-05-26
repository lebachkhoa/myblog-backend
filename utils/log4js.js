const path = require("path");

const {configure, getLogger} = require("log4js");

configure({
    appenders : {
        console: {type: "console"},     // ghi log ra terminal
        logFile: {
            type: "file",
            filename: path.join(__dirname, "../logs/log.txt"),
            maxLogSize: 10485760,                           // 10 Mb
            backups: 3,
            compress: true
        } 
    },
    categories: {
        default: {
            appenders: ["console", "logFile"],
            level: "info"                  // ghi log tu info tro len (info, warn, error, fatal)
        }
    }
});

const logger = getLogger();
module.exports = logger;