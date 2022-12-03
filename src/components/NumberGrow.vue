<template>
  <i>
    {{values.toFixed(decimals)}}
  </i>
</template>

<script setup>
import {defineProps, onMounted, ref} from 'vue'

const props = defineProps({
    value: { 
      type: [Number, String],
      default: 0
    },
    duration: { 
      type: Number,
      default: 1
    },
    decimals: { 
      type: Number,
      default: 2
    },
})
let values = ref(0)

let step = (props.value * 10) / (props.duration * 500)
function growFn() {
  let timer = setInterval(() => {
    values.value += step
    if (values.value + step >= props.value) {
    clearInterval(timer)
    values.value += props.value - values.value
  }
  }, 10)
}
onMounted(() => {
  growFn()
})

</script>

<style scoped>

</style>