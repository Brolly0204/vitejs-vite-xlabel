<script setup>
import {
  ref,
  markRaw,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  computed,
} from 'vue';
// import htmlDocx from '../plugins/html-docx.js';
import FileSaver from 'file-saver';

const mainRef = ref();
const chartRef = ref();
const { proxy } = getCurrentInstance();
const unit = 'kWh';
const isMultiOption = ref(true);
const handleSave2 = () => {
  const baseImg = chartRef.value.getDataURL({
    pixelRatio: 2,
    backgroundColor: '#fff',
  });
  imgSrc.value = baseImg;
  console.log('imageRef.value', imageRef.value);
  imageRef.value.onload = () => {
    const html = `
    <html>
    <head>
      <meta charset=UTF-8">
      <style>
      html, body {
        width: 100%;
        height: 100%
        margin: 0;
      }
      .container {
        text-align: center;
      }
      table{
        min-width: 300px;
        border-collapse: collapse;
        font-family: "宋体";
        color: #000;
        border:1pt solid #000;
      }

      th, td{
        width: 300px;
        padding: 8px;
        text-align: center;
        border: 1pt solid #000 !important;
      }
    </style>
    </head>
      <body>
        <h1 style="text-align:center;">测试列表</h1>
         ${tableRef.value.$el.outerHTML}
         <br>
         <br>
         ${imageRef.value.outerHTML}
      </body>
    </html>
    `;
    setTimeout(() => {
      const blob = new Blob([html], {
        type: 'application/msword',
        //type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      FileSaver.saveAs(blob, '测试文件.doc');

      // const link = document.createElement('a');
      // link.download = '测试文件.doc';
      //link.href = URL.createObjectURL(blob);
      //link.click();
    }, 1000);
  };
};
defineOptions({
  name: 'LineChartComp',
});
const handleSaveWord = () => {
  const baseImg = chartRef.value.getDataURL({
    pixelRatio: 2,
    backgroundColor: '#fff',
  });
  imgSrc.value = baseImg;
  console.log('imageRef.value', imageRef.value);
  imageRef.value.onload = () => {
    // const htmlContent = '<h1>Hello, World!</h1><p>This is a sample document.</p>';
    //const htmlContent = contentRef.value.innerHTML;
    //console.log('html', htmlContent);
    const htmlContent = `
    <h1 style="text-align:center;">测试列表11</h1>
    ${tableRef.value.$el.outerHTML}
    <br>
    <br>
    ${imageRef.value.outerHTML}
    `;
    exportToDocx(htmlContent);
  };
};

const exportToDocx = (htmlContent, fileName = 'exported-document.docx') => {
  // 构建包含 HTML 内容的完整 HTML 文档字符串
  const fullHtmlContent = `
    <!DOCTYPE html>
    <html xmlns:o=\'urn:schemas-microsoft-com:office:office\' xmlns:w=\'urn:schemas-microsoft-com:office:word\' xmlns=\'http://www.w3.org/TR/REC-html40\'>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <style>
        html, body {
          width: 100%;
          height: 100%
          margin: 0;
        }
        .container {
          text-align: center;
        }
        table{
          min-width: 300px;
          border-collapse: collapse;
          font-family: "宋体";
          color: #000;
          border:1pt solid #000;
        }

        th, td{
          min-width: 300px;
          padding: 8px;
          text-align: center;
          border: 1pt solid #000 !important;
        }
      </style>
      </head>
      <body>
        <div class="container">
          ${htmlContent}
        </div>
       
      </body>
    </html>
  `;

  // 使用 html-docx-js 将 HTML 转换为 Word 文档的 Blob 对象
  const converted = htmlDocx.asBlob(fullHtmlContent);
  console.log('converted', converted);

  // 使用 file-saver 保存 Blob 对象为 Word 文档文件
  FileSaver.saveAs(converted, fileName);
};
const props = defineProps({
  msg: String,
});

const createToolTip = computed(() => {
  return isMultiOption.value
    ? createMultiOpitonTooltip
    : createSingleOpitonTooltip;
});
const createSingleOpitonTooltip = (params) => {
  const { seriesName } = params[0];
  const [title] = seriesName.split('&');
  const info = params
    .map(({ seriesName, value, marker }) => {
      const [title, label] = seriesName.split('&');
      return `
           <span class="row"><span class="name">${marker}  <span>${label}</span></span>  <span>${value} ${unit}</span></span><br />
         `;
    })
    .join('');
  return `<div class="tooltip-container">
            <div class="tooltip">
              ${title}<br />
              <hr>
              <div class="list">${info}</div>
            </div>
         </div>
        `;
};
const createMultiOpitonTooltip = (params) => {
  const mapObj = {};
  params.forEach(({ seriesName, value, marker }) => {
    const [name, date] = seriesName.split('&');
    mapObj[date] = [
      ...(mapObj[date] || []),
      {
        name,
        value,
        marker,
      },
    ];
  });
  const contentStr = Object.keys(mapObj)
    .map((key) => {
      const data = mapObj[key];
      const title = key;
      const dataStr = data
        .map(({ name, value, marker }) => {
          return `<span class="row"><span class="name">${marker}  <span>${name}</span></span>  <span>${value} ${unit}</span></span><br />`;
        })
        .join('');
      return `<div class="tooltip">
                <div class="title">${title}</div>
                <hr>
                <div class="list">${dataStr}</div>
              </div>
            `;
    })
    .join('');
  return `<div class="tooltip-container">
           ${contentStr}
          </div>
        `;
};

const option2 = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line',
      markLine: {
        silent: true,
        lineStyle: {
          normal: {
            color: '#01fef9', // 这儿设置安全基线颜色
          },
        },
        data: [
          {
            yAxis: 130,
          },
        ],
        label: {
          normal: {
            formatter: '标准\n基线', // 这儿设置安全基线
          },
        },
      },
    },
  ],
};

const option1 = {
  title: {
    show: true,
    text: props.msg,
  },
  tooltip: {
    show: true,
    trigger: 'axis',
    formatter(params) {
      return createToolTip.value(params);
    },
  },
  dataZoom: {
    type: 'slider',
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00'],
  },
  yAxis: {},
  series: [
    {
      name: '暖通空调&2024-01',
      data: [120, 200, 150, 210, 280, 230],
      type: 'line',

      markLine: {
        silent: true,
        lineStyle: {
          normal: {
            color: '#01fef9', // 这儿设置安全基线颜色
          },
        },
        data: [
          {
            yAxis: 230,
          },
        ],
        label: {
          normal: {
            formatter: '标准\n基线', // 这儿设置安全基线
          },
        },
      },
    },
    {
      name: '暖通空调&2024-02',
      data: [220, 330, 150, 190, 210, 230],
      type: 'line',
      // lineStyle: {
      //  color: 'pink',
      //},
      //itemStyle: {
      //设置端点颜色
      //  normal: {
      //    color: 'pink', // 设置线条上点的颜色（和图例的颜色）
      //  },
      //},
    },
    {
      name: '暖通空调&2024-03',
      data: [80, 130, 180, 220, 270, 230],
      type: 'line',
      //lineStyle: {
      // color: 'pink',
      //},
      //itemStyle: {
      //设置端点颜色
      //  normal: {
      //color: 'pink', // 设置线条上点的颜色（和图例的颜色）
      // },
      // },
    },
    {
      name: '动力用电&2024-01',
      data: [190, 280, 300, 220, 290, 230],
      type: 'line',
    },
    {
      name: '动力用电&2024-02',
      data: [178, 220, 350, 260, 260, 230],
      type: 'line',
    },
    {
      name: '动力用电&2024-03',
      data: [280, 230, 180, 210, 280, 230],
      type: 'line',
    },
  ],
};
onMounted(() => {
  const chartIns = (chartRef.value = markRaw(
    proxy.$echarts.init(mainRef.value, 'dark', {})
  ));
  chartRef.value.on('dataZoom', function (event) {
    console.log('dataZoom', event, chartIns.getOption());
    const { xAxis, dataZoom } = chartIns.getOption();
    const xAxisData = xAxis[0].data;
    const { startValue, endValue } = dataZoom[0];
    console.log('dataZoom', startValue, endValue);
    console.log('label', xAxisData[startValue], xAxisData[endValue]);
  });
  chartRef.value.setOption(option2);
});
const resizeFn = () => {
  if (chartRef.value) {
    chartRef.value.resize();
  }
};

onMounted(() => {
  window.addEventListener('resize', resizeFn);
});
onUnmounted(() => {
  chartRef.value.dispose();
  window.removeEventListener('resize', resizeFn);
});

const dataSource = ref([
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
]);

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
];
const imgSrc = ref('');
const tableRef = ref(null);
const contentRef = ref(null);
const imageRef = ref(null);
</script>
<template>
  <div>
    <h1>{{ msg }}</h1>
    <a-button type="primary" size="small" @click="handleSaveWord"
      >下载</a-button
    >
    <a-button type="primary" size="small" @click="handleSave2">下载2</a-button>
    <div ref="mainRef" class="bar"></div>
    <hr />
    <div ref="contentRef">
      <a-table
        ref="tableRef"
        :pagination="false"
        :dataSource="dataSource"
        :columns="columns"
      />
      <br />
      <br />
      <img style="display: none" ref="imageRef" width="600" :src="imgSrc" />
    </div>
  </div>
</template>

<style>
.bar {
  width: 100%;
  height: 80vh;
}
.tooltip-container {
  .tooltip {
    .title {
      color: red;
      font-weight: bold;
      text-align: left;
    }
    .list {
      .row {
        width: 100%;
        min-width: 100px;
        display: inline-flex;
        justify-content: space-between;
        align-items: center;
        text-align: left;
        .name {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
