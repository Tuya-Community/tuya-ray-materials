import { getOptions as getLineOptions } from "../style/line";
import { getOptions as getLineAreaOptions } from "../style/line-area";
import { getOptions as getBarOptions } from "../style/bar";
import { getOptions as getPieOptions } from "../style/pie";
import { getOptions as getGaugeOptions } from "../style/gauge";

export const autoInject = (options) => {

    let serie;
    if (Array.isArray(options.option.series)) {
        serie = options.option.series[0];
    } else if (typeof options.option.series === 'object') {
        serie = options.option.series;
        options.option.series = [serie];
    }
    // 识别图表类型
    const type = serie.type;
    switch (type) {
        case "line":
            if (serie.areaStyle) return getLineAreaOptions(options);
            return getLineOptions(options);
        case "bar":
            return getBarOptions(options);
        case "pie":
            return getPieOptions(options);
        case "gauge":
            return getGaugeOptions(options);
        default:
            break;
    }

    return options.option;
}

