"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const log4js_1 = require("log4js");
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const mongoose_1 = __importDefault(require("mongoose"));
const secrets_1 = require("./util/secrets");
const prediction_service_1 = require("./services/prediction-service/prediction-service");
const port = parseInt(process.env.PORT, 10) || 3030;
const logger = log4js_1.getLogger('main');
log4js_1.configure({
    appenders: {
        console: { type: 'console' },
    },
    categories: {
        default: { appenders: ['console'], level: 'info' }
    }
});
const MongoStore = connect_mongo_1.default(express_session_1.default);
const app = express_1.default();
// Connect to MongoDB
const mongoUrl = secrets_1.MONGODB_URI;
mongoose_1.default.connect(mongoUrl, {}).then(() => { }).catch(err => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    // process.exit();
});
app.use(log4js_1.connectLogger(logger, { level: 'info' }));
app.use(cors_1.default({
    credentials: true,
    origin: (origin, cb) => {
        cb(null, true);
    }
}));
app.use(body_parser_1.default.text());
app.use(compression_1.default());
app.use(express_session_1.default({
    resave: true,
    saveUninitialized: true,
    secret: secrets_1.SESSION_SECRET,
    store: new MongoStore({
        url: mongoUrl,
        autoReconnect: true
    })
}));
app.post('/next/:appId', (req, res) => __awaiter(this, void 0, void 0, function* () {
    logger.info(req.sessionID);
    let payloadStr = Buffer.from(req.body, 'base64').toString('ascii');
    let payload = JSON.parse(payloadStr);
    console.log(payload);
    let appId = req.params.appId;
    let nextActions = yield prediction_service_1.getNextActions(appId, req.sessionID, payload);
    if (nextActions.length) {
        return res.send({ nextActions });
    }
    res.send({ error: 'No Predictions yet.' });
}));
app.get('*', (req, res) => {
    res.send({ status: 'Not Implemented' });
});
logger.info(`Listening on PORT ${port}`);
app.listen(port);
//# sourceMappingURL=index.js.map