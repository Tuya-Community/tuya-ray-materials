export const lineOption = {
  backgroundColor: '#fff',
  title: {
    text: "温湿度",
    textStyle: {
      color: "#333333",
      fontSize: 20,
    },
    left: "center",
    top: "0%",
  },
  legend: {
    show: true,
    data: ['温度', '湿度'],
  },
  tooltip: {
    formatter: `function (params) {

      var text = _.reduce(params, function (acc, cur, idx) {
        var lineText = "<div style='font-size: 10px;'>" + cur.marker + cur.seriesName + ": " + cur.value + "</div>";
        return acc + lineText;
      }, "");

      return "<div style='color: red;text-align: center;'>" + dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss") + "</div>" + text;
    }`,
    renderMode: 'html',
    confine: true
  },
  dataZoom: [
    {
      xAxisIndex: 0,
      show: false,
      type: "slider",
      startValue: 0,
      endValue: 7,
    },
  ],
  xAxis: {
    type: 'category',
    boundaryGap: true,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },


  yAxis: [{
    type: 'value',
    name: '湿度 (%)',
    axisLine: {
      onZero: false,
    },
    position: 'right',
  },
  {
    type: 'value',
    name: '温度 (℃)',
    axisLine: {
      onZero: false,
    },
    position: 'left',
  }
  ],
  series: [
    {
      name: '温度',
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line',
      yAxisIndex: 1,
    },
    {
      name: '湿度',
      data: [20, 30, 40, 50, 60, 70, 80],
      type: 'line',
      yAxisIndex: 0,
    },
  ],
}


export const homeLineOption = {
  backgroundColor: '#fff',
  title: {
    text: "温湿度",
    textStyle: {
      color: "#333333",
      fontSize: 20,
    },
    left: "center",
    top: "0%",
  },
  legend: {
    show: true,
    data: ['温度', '湿度'],
  },
  tooltip: {
    formatter: `function (params) {

    var clickedIndex = highlightIndex;
      var text = _.reduce(params, function (acc, cur, idx) {
        var lineText = "<div style='font-size: 10px;'>" + cur.marker + cur.seriesName + ": " + cur.value + "</div>";
        return acc + lineText;
      }, clickedIndex.toString());

      return "<div style='color: red;text-align: center;'>" + dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss") + "</div>" + text;
    }`,
    renderMode: 'html',
    confine: true
  },
  dataZoom: [
    {
      xAxisIndex: 0,
      show: false,
      type: "slider",
      startValue: 0,
      endValue: 7,
    },
  ],
  xAxis: {
    type: 'category',
    boundaryGap: true,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },


  yAxis: [{
    type: 'value',
    name: '湿度 (%)',
    axisLine: {
      onZero: false,
    },
    position: 'right',
  },
  {
    type: 'value',
    name: '温度 (℃)',
    axisLine: {
      onZero: false,
    },
    position: 'left',
  }
  ],
  series: [
    {
      name: '温度',
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line',
      yAxisIndex: 1,
    },
    {
      name: '湿度',
      data: [20, 30, 40, 50, 60, 70, 80],
      type: 'line',
      yAxisIndex: 0,
    },
  ],
}
export const lineAreaOption = {
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  dataZoom: [
    {
      type: 'inside',
    }
  ],
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      areaStyle: {}
    }
  ]
};

export const pieOption = {
  title: {
    text: 'Referer of a Website',
    subtext: 'Fake Data',
    left: 'center',
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },

  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}

export const barOption = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar'
    }
  ]
};

export const gaugeOption = {
  tooltip: {
    formatter: '{a} <br/>{b} : {c}%'
  },
  series: [
    {
      name: 'Pressure',
      type: 'gauge',
      progress: {
        show: true
      },
      detail: {
        valueAnimation: true,
        formatter: '{value}'
      },
      data: [
        {
          value: 50,
          name: 'SCORE'
        }
      ]
    }
  ]
};


export const functionalOption = {
  title: {
    text: '阅读书籍分布',
    left: 'center',
    textStyle: {
      color: '#999',
      fontWeight: 'normal',
      fontSize: 14
    }
  },
  series: {
    type: 'pie',
    radius: [20, 60],
    height: '33.33%',
    left: 'center',
    width: 300,
    itemStyle: {
      borderColor: '#fff',
      borderWidth: 1
    },
    label: {
      alignTo: 'edge',
      formatter: '{name|{b}}\n{time|{c} 小时}',
      minMargin: 5,
      edgeDistance: 10,
      lineHeight: 15,
      rich: {
        time: {
          fontSize: 10,
          color: '#999'
        }
      }
    },
    labelLine: {
      length: 15,
      length2: 0,
      maxSurfaceAngle: 80
    },
    labelLayout: `function (params) {
        var isLeft = params.labelRect.x < myChart.getWidth() / 2;
        var points = params.labelLinePoints;
        // Update the end point.
        points[2][0] = isLeft
          ? params.labelRect.x
          : params.labelRect.x + params.labelRect.width;
        return {
          labelLinePoints: points
        };
      }`,
    data: [
      { name: '圣彼得堡来客', value: 5.6 },
      { name: '陀思妥耶夫斯基全集', value: 1 },
      { name: '史记精注全译（全6册）', value: 0.8 },
      { name: '加德纳艺术通史', value: 0.5 },
      { name: '表象与本质', value: 0.5 },
      { name: '其它', value: 3.8 }
    ]
  }
};

