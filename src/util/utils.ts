import _ from 'lodash';
/**
 * Do a task asyncronously as a MacroTask with the promise API.
 * https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
 *
 * @param task
 * @returns {Promise<TResult2|TResult1>}
 */
export function doAsyncMacrotask(task: () => any): Promise<any> {
    return new Promise((resolve) => {
        setTimeout(resolve);
    }).then(task);
}

export function createChunks(array: any[], minSize = 2) {
    return _(_.range(minSize, array.length + 1))
        .map(chunkSize => _.chunk(array, chunkSize))
        .flatten()
        .filter(chunk => chunk.length >= minSize)
        .value();
}