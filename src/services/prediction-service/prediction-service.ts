import _ from 'lodash';
import { PreditionModel } from './predition-model';

const appIDToModel: Map<string, any> = new Map(); // Populate from DB ?
const sessionIdToActions: Map<string, any[]> = new Map();

export async function getNextActions(appId: string, sessionId: string, actions: any[]) {
    let model = getOrCreateModelFromAppId(appId);
    
    await model.train(sessionId, actions);
    
    let predictions = await model.predict(sessionId) || [];

    console.log('predictions', predictions);
    return predictions;
}

function getOrCreateModelFromAppId(appId: string): PreditionModel {
    let model = appIDToModel.get(appId);
    if(!model) {
        model = new PreditionModel();
        appIDToModel.set(appId, model);
    }
    return model;
}
