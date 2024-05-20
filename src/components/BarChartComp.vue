<script setup>
import { ref, markRaw, getCurrentInstance, onMounted, onUnmounted } from 'vue';
const mainRef = ref();
const chartRef = ref();
const { proxy } = getCurrentInstance();
onMounted(() => {
  chartRef.value = markRaw(proxy.$echarts.init(mainRef.value, 'dark', {}));
  chartRef.value.setOption({
    legend: {},
    tooltip: {},
    dataset: {
      source: [
        ['product', '2012', '2013', '2014', '2015'],
        ['Matcha Latte', 41.1, 30.4, 65.1, 53.3],
        ['Milk Tea', 86.5, 92.1, 85.7, 83.1],
        ['Cheese Cocoa', 24.1, 67.2, 79.5, 86.4],
      ],
    },
    xAxis: [
      { type: 'category', gridIndex: 0 },
      { type: 'category', gridIndex: 1 },
    ],
    yAxis: [{ gridIndex: 0 }, { gridIndex: 1 }],
    grid: [{ left: '55%' }, { right: '55%' }],
    series: [
      // 这几个系列会出现在第一个直角坐标系中，每个系列对应到 dataset 的每一行。
      { type: 'bar', seriesLayoutBy: 'row' },
      { type: 'bar', seriesLayoutBy: 'row' },
      { type: 'bar', seriesLayoutBy: 'row' },
      // 这几个系列会出现在第二个直角坐标系中，每个系列对应到 dataset 的每一列。
      { type: 'bar', xAxisIndex: 1, yAxisIndex: 1 },
      { type: 'bar', xAxisIndex: 1, yAxisIndex: 1 },
      { type: 'bar', xAxisIndex: 1, yAxisIndex: 1 },
      { type: 'bar', xAxisIndex: 1, yAxisIndex: 1 },
    ],
  });
});
const resizeFn = () => {
  if (chartRef.value) {
    console.log('resize');
    chartRef.value.resize();
  }
};

onMounted(() => {
  console.log('onMounted');
  window.addEventListener('resize', resizeFn);
});
onUnmounted(() => {
  console.log('onUnmounted');
  chartRef.value.dispose();
  window.removeEventListener('resize', resizeFn);
});

defineOptions({
  name: 'BarChartComp',
});

defineProps({
  msg: String,
});

const count = ref(0);
</script>
<template>
  <h1>{{ msg }}</h1>
  <div ref="mainRef" class="bar"></div>
</template>

<style scoped>
.bar {
  width: 100%;
  height: 80vh;
}
</style>
