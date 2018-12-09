import xxHash from 'xxhash';
import CPT from 'compact-prediction-tree';
import _ from 'lodash';
import { doAsyncMacrotask, createChunks } from '../../util/utils';

const MAX_NUM_LAST_ELEM = 4;
const NUM_PREDICTIONS = 2;
const HASH_SEED = 0xCAFEBABE;

export class PreditionModel {
    private cpt: CPT = new CPT();
    private hashToAction: Map<string, string> = new Map();
    private sequenceIdToSequence: Map<string, string[]> = new Map();

    public  async train(sequenceId: string, data: any[]) {
        return doAsyncMacrotask(() => {
            let sequenceItems = this.getHashesForData(data);
            let sequence = this.getSequence(sequenceId);
            sequence.push(...sequenceItems);
            console.log('sequence', sequence);
            sequence = _.takeRight(sequence, 5);

            this.sequenceIdToSequence.set(sequenceId, sequence);
            this.cpt.train([ sequence.slice(0) ]);
            console.log('Trained Model', this.cpt);
        });
    }

    public async predict(sequenceId: string, numPredictions = NUM_PREDICTIONS) {
        return doAsyncMacrotask(() => {
            let sequence = this.getSequence(sequenceId);
            return _(_.rangeRight(1, MAX_NUM_LAST_ELEM))
                .map(numLastElem => this.cpt.predict([ sequence ], numLastElem, numPredictions))
                .flatten()
                .filter((prediction: string[]) => prediction.length > 0)
                .flatten()
                .uniq()
                .map((prediction: string) => this.hashToAction.get(prediction))
                .map((prediction: string) => JSON.parse(prediction))
                .value()
        });
    }

    public getDataModel() {
        return (this.cpt);
    }

    private getHashesForData(data: any[]): string[] {
        let hashes: string[] = [];
        data.forEach(action => {
            let actionStr = JSON.stringify(action);
            let actionBuffer = Buffer.from(actionStr);
            let hash = xxHash.hash(actionBuffer, HASH_SEED);
            this.hashToAction.set(hash, actionStr);
            hashes.push(hash);
        });
        return hashes;
    }

    private getSequence(sequenceId: string): string[] {
        let sequence = this.sequenceIdToSequence.get(sequenceId);
        if(!sequence) {
            sequence = [];
            this.sequenceIdToSequence.set(sequenceId, sequence);
        }
        return sequence;
    }
}