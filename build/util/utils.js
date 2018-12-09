"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
/**
 * Do a task asyncronously as a MacroTask with the promise API.
 * https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
 *
 * @param task
 * @returns {Promise<TResult2|TResult1>}
 */
function doAsyncMacrotask(task) {
    return new Promise((resolve) => {
        setTimeout(resolve);
    }).then(task);
}
exports.doAsyncMacrotask = doAsyncMacrotask;
function createChunks(array, minSize = 2) {
    return lodash_1.default(lodash_1.default.range(minSize, array.length + 1))
        .map(chunkSize => lodash_1.default.chunk(array, chunkSize))
        .flatten()
        .filter(chunk => chunk.length >= minSize)
        .value();
}
exports.createChunks = createChunks;
//# sourceMappingURL=utils.js.map