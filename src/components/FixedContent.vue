<template>
  <div
    ref="fixedContent"
    class="fixed-content"
  >
    <template v-if="ready">
      <slot />
    </template>
  </div>
</template>

<script setup>
// import useAutoResize from "@/hooks/use-auto-resize";
import { ref } from '@vue/reactivity'

let fixedContent = ref(null)
let allWidth = ref(0)
let allHeight = ref(0)
let ready = ref(false)
let scaleCoeff = ref('')

const initConfig = () => {
  let width = ref(1920)
  let height = ref(1111)

  allWidth.value = width.value
  allHeight.value = height.value

  if (fixedContent.value) {
    fixedContent.value.style.width = `${width.value}px`
    fixedContent.value.style.height = `${height.value}px`
  }
}

const setAppScale = () => {
  let baseRate = ref((allWidth.value / allHeight.value).toFixed(5))
  let currentRate = ref((window.innerWidth / window.innerHeight).toFixed(5))
  //以高为准
  if (currentRate.value > baseRate.value) {
    scaleCoeff.value = (window.innerHeight / allHeight.value).toFixed(5)
    fixedContent.value.style.transform = `scale(${scaleCoeff.value}) translate(-50%, -50%)`
  } else {
    //以宽为准
    scaleCoeff.value = (window.innerWidth / allWidth.value).toFixed(5)
    if (fixedContent.value) {
      fixedContent.value.style.transform = `scale(${scaleCoeff.value}) translate(-50%, -50%)`
    }
  }
}

const onResize = () => {
  setAppScale()
}

const afterAutoResizeInit = () => {
  initConfig()
  setAppScale()

  ready.value = true
}

import debounce from 'lodash.debounce'
import { nextTick, onMounted, onBeforeUnmount } from 'vue'

const observerDomResize = (dom, callback) => {
  const MutationObserver =
    window.MutationObserver ||
    window.WebkitMutationObserver ||
    window.MozMutationObserver
  const observer = new MutationObserver(callback)
  observer.observe(dom, {
    attributes: true,
    attributeFilter: ['style'],
    attributeOldValue: true,
  })
  return observer
}

let width = ref(0)
let height = ref(0)
let debounceInitWH = ref('')
let domObserver = ref('')

const initWH = (resize = true) => {
  return new Promise((resolve) => {
    nextTick(() => {
      const dom = fixedContent.value
      width.value = dom ? dom.clientWidth : 0
      height.value = dom ? dom.clientWidth : 0
      if (!dom) {
        console.warn('获取dom节点失败，组件渲染可能异常！')
      } else if (!width.value || !height.value) {
        console.warn('组件宽度或高度为0px，可能出现渲染异常！')
      }

      if (typeof onResize === 'function' && resize) {
        onResize()
      }

      resolve(true)
    })
  })
}
const getDebounceInitWH = () => {
  debounceInitWH = debounce(initWH, 100)
}
const bindDomResizeCallback = () => {
  //本来没有下一行
  const dom = fixedContent.value
  domObserver = observerDomResize(dom, debounceInitWH)
  window.addEventListener('resize', debounceInitWH)
}
const unbindDomResizeCallback = () => {
  if (!domObserver.value) return

  domObserver.value.disconnect()
  domObserver.value.takeRecords()
  domObserver = null

  window.removeEventListener('resize', debounceInitWH)
}

const autoResizeInit = async () => {
  await initWH(false)
  getDebounceInitWH()
  bindDomResizeCallback()
  if (typeof afterAutoResizeInit === 'function') {
    afterAutoResizeInit()
  }
}

onMounted(() => {
  autoResizeInit()
})

onBeforeUnmount(() => {
  unbindDomResizeCallback()
})
</script>

<style scoped>
.fixed-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: left top;
}
</style>
