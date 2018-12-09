"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log4js_1 = require("log4js");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const logger = log4js_1.getLogger('secrets');
logger.level = 'info';
if (fs_1.default.existsSync(".env")) {
    logger.debug("Using .env file to supply config environment variables");
    dotenv_1.default.config({ path: ".env" });
}
else {
    logger.debug("Using .env.example file to supply config environment variables");
    dotenv_1.default.config({ path: ".env.example" });
}
exports.ENVIRONMENT = process.env.NODE_ENV;
const prod = exports.ENVIRONMENT === "production"; // Anything else is treated as 'dev'
exports.SESSION_SECRET = process.env["SESSION_SECRET"];
exports.MONGODB_URI = prod ? process.env["MONGODB_URI"] : process.env["MONGODB_URI_DEV"];
if (!exports.SESSION_SECRET) {
    logger.error("No client secret. Set SESSION_SECRET environment variable.");
    process.exit(1);
}
if (!exports.MONGODB_URI) {
    logger.error("No mongo connection string. Set MONGODB_URI environment variable.");
    process.exit(1);
}
//# sourceMappingURL=secrets.js.map