<template>
  <div class="progress">
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 400 400">
      <!-- 底部背景圆环 -->
      <circle cx="200" cy="200" :r="radius" :stroke="bgRingColor" :stroke-width="strokeWidth" fill="none" />
      <!-- 进度条圆环 -->
      <circle class="progress-bar" ref="progressBar" cx="200" cy="200" :r="radius" :stroke="ringColor" :stroke-width="strokeWidth" fill="none" :stroke-linecap="strokeLineCap" transform="rotate(-90, 200, 200)" :stroke-dasharray="strokeDasharray" :stroke-dashoffset="strokeDashoffset"/>
    </svg> 
    <div class="progress-desc">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import {defineProps} from 'vue'
const { computed }=require("@vue/runtime-core")

const props = defineProps({
    rate: { 
      type: Number,
      default: 0
    },
    bgRingColor: { 
      type: String,
      default: '#ebeef5'
    },
    ringColor: { 
      type: String,
      default: '#67c23a'
    },
    strokeLineCap: { 
      type: String,
      default: 'round'
    },
    strokeWidth: { 
      type: Number,
      default: 20
    },
})
const radius = computed(()=>{
  return 200 - props.strokeWidth / 2;
})
const strokeDasharray = computed(()=>{
  return 2 * Math.PI * radius.value;
})
const strokeDashoffset = computed(()=>{
  let val = 0;
  let copyRate = props.rate
  if (copyRate > 1) {
    copyRate = 1;
  } else if (copyRate < 0) {
    copyRate = 0;
  }
  console.log(copyRate)
  if (props.strokeLineCap === 'round') {
    val = 2 * Math.PI * radius.value * (1 - copyRate) + props.strokeWidth;
  } else {
    val = 2 * Math.PI * radius.value * (1 - copyRate);
  }
  console.log(val)
  return val;
})
</script>

<style scoped>
.progress {
  position: relative;
  width: 100%;
  height: 100%;
}
.progress-desc {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  text-align: center;
}
.progress-bar {
  transition: stroke-dashoffset 1s ease;
}
</style>