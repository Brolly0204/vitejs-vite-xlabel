<script setup>
import { ref, markRaw, getCurrentInstance, onMounted, onUnmounted } from 'vue';
const mainRef = ref(null);
const secondRef = ref(null);
const thridRef = ref(null);
const chartRef = ref();
const secChartRef = ref();
const thirChartRef = ref();
const { proxy } = getCurrentInstance();
onMounted(() => {
  chartRef.value = markRaw(proxy.$echarts.init(mainRef.value, 'dark', {}));
  chartRef.value.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '10%',
      right: '0',
      bottom: 120,
      containLabel: false,
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: [
      {
        type: 'category',
        data: [
          '中国人民解放军海军航空大学',
          'Tue',
          'Wed',
          'Thu',
          'Fri',
          'Sat',
          'Sun',
        ],
        axisTick: { show: false, alignWithLabel: true },
        axisLabel: {
          width: 100,
          //backgroundColor: 'pink',
          margin: 10,
          rotate: 60,
          formatter(value) {
            const start = value.slice(0, 8);
            const end = value.slice(8);
            return `${start}\n${end}`;
          },
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: 'Direct',
        type: 'bar',
        barWidth: '60%',
        data: [10, 52, 200, 334, 390, 330, 220],
      },
    ],
  });
  secChartRef.value = markRaw(proxy.$echarts.init(secondRef.value, 'dark', {}));
  secChartRef.value.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '0',
      right: '0',
      bottom: 120,
      containLabel: false,
    },
    xAxis: [
      {
        type: 'category',
        data: [
          '',
          'Mon',
          'Tue',
          'Wed',
          'Thu',
          'Fri',
          'Sat',
          'Sun',
          '中国人民大学首届深圳金融论坛',
        ],
        axisTick: { show: false, alignWithLabel: true },
        axisLabel: {
          width: 100,
          //backgroundColor: 'pink',
          margin: 10,
          rotate: 60,
          formatter(value) {
            const start = value.slice(0, 8);
            const end = value.slice(8);
            return `${start}\n${end}`;
          },
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
      formatter(params) {
        return params
          .map(({ seriesName, axisValue, data, value, marker }) => {
            if (data === '-') {
              return '';
            }
            return `
              ${axisValue}<br>
              ${marker} ${seriesName}&ensp;&ensp;&ensp;<strong>${value}</strong>
            `;
          })
          .join('');
      },
    },
    yAxis: [
      {
        axisLabel: {
          show: false,
        },
        type: 'value',
      },
    ],
    series: [
      {
        name: 'Direct',
        type: 'bar',
        barWidth: '60%',
        data: ['-', 10, 52, 100, 234, 320, 399, 120, 110],
      },
    ],
  });
  thirChartRef.value = markRaw(proxy.$echarts.init(thridRef.value, 'dark', {}));
  thirChartRef.value.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '0',
      right: '4%',
      bottom: 120,
      containLabel: false,
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: [
      {
        type: 'category',
        data: [
          '',
          '中国人民解放军海军航空大学68215',
          'Wed',
          'Thu',
          'Fri',
          'Sat',
          'Sun',
        ],
        axisTick: {
          show: false,
          alignWithLabel: true,
        },
        axisLabel: {
          width: 100,
          backgroundColor: 'pink',
          margin: 10,
          rotate: 60,
          formatter(value) {
            const start = value.slice(0, 8);
            const end = value.slice(8);
            return `${start}\n${end}`;
          },
        },
      },
    ],
    yAxis: [
      {
        axisLabel: {
          show: false,
        },
        type: 'value',
      },
    ],
    series: [
      {
        name: 'Direct',
        type: 'bar',
        barWidth: '60%',
        data: ['', 52, 200, 334, 390, 330, 220],
      },
    ],
  });
});

const updateYaxisValue = () => {
  const yMin = 0;
  const yMax = 280;

  chartRef.value.setOption({
    yAxis: {
      min: yMin,
      max: yMax,
      //interval: interval,
    },
  });
  secChartRef.value.setOption({
    yAxis: {
      min: yMin,
      max: yMax,
      //interval: interval,
    },
  });
  thirChartRef.value.setOption({
    yAxis: {
      min: yMin,
      max: yMax,
      //interval: interval,
    },
  });
};

defineOptions({
  name: 'ThirdBarComp',
});

defineProps({
  msg: String,
});

const count = ref(0);
</script>
<template>
  <h1 @click="updateYaxisValue">{{ msg }}</h1>
  <div class="bar-container">
    <div ref="mainRef" class="bar"></div>
    <div ref="secondRef" class="bar"></div>
    <div ref="thridRef" class="bar"></div>
  </div>
</template>

<style scoped>
.bar-container {
  display: flex;
}
.bar {
  flex: 1;
  height: 80vh;
  min-width: 407px;
}
</style>
