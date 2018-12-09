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
const xxhash_1 = __importDefault(require("xxhash"));
const compact_prediction_tree_1 = __importDefault(require("compact-prediction-tree"));
const lodash_1 = __importDefault(require("lodash"));
const utils_1 = require("../../util/utils");
const MAX_NUM_LAST_ELEM = 4;
const NUM_PREDICTIONS = 2;
const HASH_SEED = 0xCAFEBABE;
class PreditionModel {
    constructor() {
        this.cpt = new compact_prediction_tree_1.default();
        this.hashToAction = new Map();
        this.sequenceIdToSequence = new Map();
    }
    train(sequenceId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return utils_1.doAsyncMacrotask(() => {
                let sequenceItems = this.getHashesForData(data);
                let sequence = this.getSequence(sequenceId);
                sequence.push(...sequenceItems);
                console.log('sequence', sequence);
                sequence = lodash_1.default.takeRight(sequence, 5);
                this.sequenceIdToSequence.set(sequenceId, sequence);
                this.cpt.train([sequence.slice(0)]);
                console.log('Trained Model', this.cpt);
            });
        });
    }
    predict(sequenceId, numPredictions = NUM_PREDICTIONS) {
        return __awaiter(this, void 0, void 0, function* () {
            return utils_1.doAsyncMacrotask(() => {
                let sequence = this.getSequence(sequenceId);
                return lodash_1.default(lodash_1.default.rangeRight(1, MAX_NUM_LAST_ELEM))
                    .map(numLastElem => this.cpt.predict([sequence], numLastElem, numPredictions))
                    .flatten()
                    .filter((prediction) => prediction.length > 0)
                    .flatten()
                    .uniq()
                    .map((prediction) => this.hashToAction.get(prediction))
                    .map((prediction) => JSON.parse(prediction))
                    .value();
            });
        });
    }
    getDataModel() {
        return (this.cpt);
    }
    getHashesForData(data) {
        let hashes = [];
        data.forEach(action => {
            let actionStr = JSON.stringify(action);
            let actionBuffer = Buffer.from(actionStr);
            let hash = xxhash_1.default.hash(actionBuffer, HASH_SEED);
            this.hashToAction.set(hash, actionStr);
            hashes.push(hash);
        });
        return hashes;
    }
    getSequence(sequenceId) {
        let sequence = this.sequenceIdToSequence.get(sequenceId);
        if (!sequence) {
            sequence = [];
            this.sequenceIdToSequence.set(sequenceId, sequence);
        }
        return sequence;
    }
}
exports.PreditionModel = PreditionModel;
//# sourceMappingURL=predition-model.js.map