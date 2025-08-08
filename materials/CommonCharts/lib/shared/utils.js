import evaluate from 'eval5';

export const uuid = () => 'C_' + Math.random().toString(36).substring(2, 10);
const protoKey = "__proto__";
export const isFunction = obj => typeof obj === 'function';
export const isPlanObject = obj => obj !== null && typeof obj === 'object';


export const merge = (target, source) => {

    function mergeObj(target, source) {
        if (isPlanObject(target) && isPlanObject(source)) {
            for (var key in source) {
                if (source.hasOwnProperty(key) && key !== protoKey) {
                    var targetProp = target[key];
                    var sourceProp = source[key];
                    if (isPlanObject(sourceProp)
                        && isPlanObject(targetProp)
                    ) {
                        mergeObj(targetProp, sourceProp);
                    }
                    else {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        } else {
            return target;
        }
    }

    if (Array.isArray(source)) {
        return source.map(s => mergeObj(mergeObj({}, target), s));
    }

    return mergeObj(target, source);

}
export const validateOption = (option) => {
    if (!option) return false;

    // 识别图表类型
    if (!option.series) return false;

    // 识别是否使用了函数式格式化
    // 由于rjs不支持函数式格式化，所以这里默认阻止掉
    JSON.stringify(option, (key, value) => {
        if (typeof value === 'function') {
            throw new Error(`Function is not supported in this option. try to use string template formatter or use stringal function`);
        }
        return '';
    });

    return true;
}



// 用来进行深拷贝数据，防止一些无法序列化的数据被传输
export const copy = (obj) => {
    const cache = new Map();
    function run(obj) {
        // 为了数据可序列化所有循环引用的对象都会被置为null
        if (cache.has(obj)) {
            return null;
        }
        cache.set(obj, true);
        if (Array.isArray(obj)) {
            return obj.map(item => run(item));
        }

        if (obj instanceof Date) {
            return new Date(obj).getTime();
        }

        if (isPlanObject(obj)) {
            return Object.keys(obj).reduce((acc, key) => {
                acc[key] = run(obj[key]);
                return acc;
            }, {});
        } else {
            if (isFunction(obj)) return null;
            return obj;
        }
    }

    return run(obj);

}

export const convertStringalFunction = (string, context) => {
    return function (...args) {

        // 将 args 透传到函数中
        const inputArgs = args.map((item, index) => ({
            key: `$${index}`,
            value: item
        }));
        const inputs = inputArgs.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {});
        const inputsArgs = inputArgs.map(item => item.key).join(',');
        try {
            return evaluate(`(${string})(${inputsArgs})`, {
                ...context,
                Date,
                console,
                ...inputs
            });
        } catch (error) {
            console.log("run evaluate function error", error);
        }
    };
}

export const isStringalFunction = (string) => {
    // 是否为function字符串或者箭头函数
    return typeof string === 'string' && string.includes('function');
}

export const isStringArrowFunction = (string) => {
    return typeof string === 'string' && /\([^\)]*\)\s*=>\s*.+/.test(string);
}

export const convertOptionStringalFunction = (option, context) => {
    for (const key in option) {
        const value = option[key];
        if (isStringArrowFunction(value)) {
            throw new Error("Arrow function is not supported in this option. use es5 function instead");
        }
        else if (isStringalFunction(value)) {
            option[key] = convertStringalFunction(value, context);
        } else if (isPlanObject(value)) {
            convertOptionStringalFunction(value, context);
        } else if (Array.isArray(value)) {
            value.forEach(item => {
                convertOptionStringalFunction(item, context);
            });
        }
    }
}
