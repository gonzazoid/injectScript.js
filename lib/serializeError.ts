/* typescripted & rewrited from https://github.com/sindresorhus/serialize-error/blob/master/index.js */

export const serializeError = function (value: any) {

    // https://www.npmjs.com/package/destroy-circular
    const destroyCircular = function (from: any, seen: any[]) {
        let to: any;
        if (Array.isArray(from)) {
            to = [];
        } else {
            to = {};
        }

        seen.push(from);

        Object.keys(from).forEach(function (key: string) {
            const value = from[key];

            if (typeof value === 'function') {
                return;
            }

            if (!value || typeof value !== 'object') {
                to[key] = value;
                return;
            }

            if (seen.indexOf(from[key]) === -1) {
                to[key] = destroyCircular(from[key], seen.slice(0));
                return;
            }

            to[key] = '[Circular]';
        });

        if (typeof from.name === 'string') {
            to.name = from.name;
        }

        if (typeof from.message === 'string') {
            to.message = from.message;
        }

        if (typeof from.stack === 'string') {
            to.stack = from.stack;
        }

        return to;
    };

    if (typeof value === 'object') {
        return destroyCircular(value, []);
    }

    // People sometimes throw things besides Error objects, so...

    if (typeof value === 'function') {
        // JSON.stringify discards functions. We do to, unless a function is thrown directly.
        return '[Function: ' + (value.name || 'anonymous') + ']';
    }

    return value;
};
