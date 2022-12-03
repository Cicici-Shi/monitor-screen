import debounce from 'lodash.debounce';
import { nextTick, onMounted, beforeUnmount, ref } from 'vue';

const observerDomResize = (dom, callback) => {
  const MutationObserver = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver; 
  const observer = new MutationObserver(callback);
  observer.observe(dom, { attributes: true, attributeFilter: ['style'], attributeOldValue: true });
  return observer;
}

export function useAutoResize(dom, onResize, afterAutoResizeInit) {
  let width = ref(0);
  let height = ref(0);
  let debounceInitWH = ref('');
  let domObserver = ref('');

  const initWH = (resize = true) => {
    return new Promise(resolve => {
      nextTick(() => {
        const dom = dom.value;
        width.value = dom ? dom.clientWidth : 0;
        height.value = dom ? dom.clientWidth : 0;
        if (!dom.value) {
          console.warn('获取dom节点失败，组件渲染可能异常！')
        } else if (!width.value || !height.value) {
          console.warn('组件宽度或高度为0px，可能出现渲染异常！')
        }

        if (typeof onResize === 'function' && resize) {
          onResize();
        }

        resolve(true);
      })
    })
  };
  const getDebounceInitWH = () => {
    debounceInitWH = debounce(100, initWH)
  };
  const bindDomResizeCallback = () => {
    domObserver = observerDomResize(dom, debounceInitWH)
    window.addEventListener('resize', debounceInitWH)
  };
  const unbindDomResizeCallback = () => {
    if (!domObserver.value) return

    domObserver.value.disconnect()
    domObserver.value.takeRecords()
    domObserver = null

    window.removeEventListener('resize', debounceInitWH)
  };

  const autoResizeInit = async () =>{
    await initWH(false);
    getDebounceInitWH();
    bindDomResizeCallback();
    if (typeof afterAutoResizeInit === 'function') {
      afterAutoResizeInit();
    }
  }

  onMounted(() => {
    autoResizeInit();
  });
  
  beforeUnmount(() => {
    unbindDomResizeCallback();
  });

  return {
    width,
    height,
    initWH,
  }

}