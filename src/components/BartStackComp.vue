<script setup>
import { ref, markRaw, getCurrentInstance, onMounted, onUnmounted } from 'vue';
const mainRef = ref();
const chartRef = ref();
const { proxy } = getCurrentInstance();

var data = [900, 345, 393, -108, -154, 135, 178, 286, -119, -361, -203];
var help = [];
var positive = [];
var negative = [];
var topData = [];
var start = 300;
for (var i = 0, sum = 0; i < data.length; ++i) {
  if (data[i] >= 0) {
    positive.push(data[i]);
    negative.push('-');
  } else {
    positive.push('-');
    negative.push(-data[i]);
  }

  if (i === 0) {
    help.push(start);
    topData.push(data[i] + start);
  } else {
    sum += data[i - 1];
    if (data[i] < 0) {
      help.push(sum + data[i]);
      topData.push(sum);
    } else {
      help.push(sum);
      topData.push(sum + data[i]);
    }
  }
}

// console.log(positive, negative, topData);
onMounted(() => {
  chartRef.value = markRaw(proxy.$echarts.init(mainRef.value, 'dark', {}));
  chartRef.value.setOption({
    title: {
      text: 'Waterfall',
    },
    tooltip: {},
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      splitLine: { show: false },
      data: (function () {
        var list = [];
        for (var i = 1; i <= 11; i++) {
          list.push('Oct/' + i);
        }
        return list;
      })(),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        type: 'bar',
        stack: 'all',
        emphasis: {
          itemStyle: {
            borderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)',
          },
        },
        itemStyle: {
          normal: {
            borderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)',
          },
        },
        data: help,
      },
      {
        name: 'positive',
        type: 'bar',
        stack: 'all',
        data: positive,
        barWidth: '20%',
        itemStyle: {
          borderRadius: 5,
          borderWidth: 1,
          borderType: 'solid',
          borderColor: '#73c0de',
          //shadowColor: '#5470c6',
          //shadowBlur: 3,
        },
      },
      {
        name: 'negative',
        type: 'bar',
        stack: 'all',
        data: negative,
        barWidth: '20%',
        itemStyle: {
          barBorderRadius: 5,
          borderWidth: 1,
          borderType: 'solid',
          borderColor: '#73c0de',
          //shadowColor: '#5470c6',
          //shadowBlur: 3,
          color: 'red',
        },
      },
      {
        name: 'low',
        type: 'line',
        data: help,
        itemStyle: {
          color: '#ccc',
        },
      },
      {
        name: 'top',
        type: 'line',
        data: topData,
        itemStyle: {
          color: 'red',
        },
      },
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
  name: 'BartStackComp',
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
