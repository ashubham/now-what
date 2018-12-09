import express from 'express';
import session from "express-session";
import { getLogger, configure, connectLogger } from 'log4js';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import mongo from "connect-mongo";
import mongoose from "mongoose";
import { MONGODB_URI, SESSION_SECRET, ENVIRONMENT } from "./util/secrets";
import { getNextActions } from './services/prediction-service/prediction-service';

const port: Number = parseInt(<string>process.env.PORT, 10) || 3030;
const logger = getLogger('main');
configure({
    appenders: {
      console: { type: 'console' },
    },
    categories: {
      default: { appenders: ['console'], level: 'info' }
    }
});

const MongoStore = mongo(session);

const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.connect(mongoUrl, {}).then(
    () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
  ).catch(err => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    // process.exit();
  });

app.use(connectLogger(logger, { level: 'info' }));
app.use(cors({
    credentials: true,
    origin: (origin, cb) => {
        cb(null, true);
    }
}));
app.use(bodyParser.text());
app.use(compression());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
      url: mongoUrl,
      autoReconnect: true
    })
  }));


app.post('/next/:appId', async (req, res) => {
    logger.info(req.sessionID);
    let payloadStr = Buffer.from(req.body, 'base64').toString('ascii');
    let payload = JSON.parse(payloadStr);
    console.log(payload);
    let appId = req.params.appId;
    let nextActions = await getNextActions(appId, req.sessionID, payload);
    if(nextActions.length) {
        return res.send({nextActions});
    }

    res.send({error: 'No Predictions yet.'})
})

logger.info(`Listening on PORT ${port}`);
app.listen(port);