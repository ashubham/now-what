"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const predition_model_1 = require("./predition-model");
const appIDToModel = new Map(); // Populate from DB ?
const sessionIdToActions = new Map();
function getNextActions(appId, sessionId, actions) {
    return __awaiter(this, void 0, void 0, function* () {
        let model = getOrCreateModelFromAppId(appId);
        yield model.train(sessionId, actions);
        let predictions = (yield model.predict(sessionId)) || [];
        console.log('predictions', predictions);
        return predictions;
    });
}
exports.getNextActions = getNextActions;
function getOrCreateModelFromAppId(appId) {
    let model = appIDToModel.get(appId);
    if (!model) {
        model = new predition_model_1.PreditionModel();
        appIDToModel.set(appId, model);
    }
    return model;
}
//# sourceMappingURL=prediction-service.js.map