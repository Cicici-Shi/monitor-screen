<template>
  <div class="main-screen">
    <FixedContent>
      <div class="screen-container">
        <div class="item-1">
          <div class="nav-l">
            <span class="logo-name">数据监控大屏</span>
          </div>
          <div class="nav-r">
            <ul>
              <li
                v-for="n in headList"
                :key="n.key"
              >
                {{ n.name }}
                <b>
                  <NumberGrow :value="n.render(result.headList).value" />
                  {{ n.render(result.headList).unit }}
                </b>
              </li>
            </ul>
            <ul>
              <li>数据统计范围：{{ result.currentTime }}</li>
            </ul>
          </div>
        </div>
        <div class="item-2">
          <div class="title-panel">
            数据库概览
          </div>
          <ul>
            <li
              v-for="(n, i) in result.databaseOverview"
              :key="n.title"
            >
              <b>{{ n.title }}</b>
              <div class="echarts-box">
                <div
                  :id="'overview' + i"
                  style="width: 100%; height: 120px"
                />
                <div class="center">
                  <b>
                    <NumberGrow
                      :value="overviewTotal(n)"
                      :decimals="0"
                    />
                  </b>
                  <p>数据库</p>
                </div>
              </div>
              <div class="hint">
                <p
                  v-for="(o, j) in n.list"
                  :key="i + j"
                  :data-color="o.name"
                >
                  {{ o.name }}：{{ o.count }}
                </p>
              </div>
            </li>
          </ul>
        </div>
        <div class="item-8">
          <div class="box">
            <div class="max-title">
              数据同步延迟监控
            </div>

            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50%"
                height="50%"
                viewBox="0 0 400 400"
              >
                <circle
                  cx="106"
                  cy="200"
                  r="71"
                  stroke="#3dcc9d"
                  stroke-width="7"
                  fill="#0a1c47"
                  stroke-dasharray="35 5 20 15 5 5"
                />
                <circle
                  cx="106"
                  cy="200"
                  r="21"
                  stroke="#3dcc9d"
                  stroke-width="7"
                  fill="#3dcc9d"
                  stroke-dasharray="5"
                />
              </svg>
            </div>
            <div class="monitor-border" />
            <ul
              class="monitoring-box"
              :style="{ '--length': synMonitoringLength }"
            >
              <li
                v-for="(n, i) in result.synMonitoring"
                :key="n.db_name"
                :class="{ on: i === currentObj.currentItem }"
                :style="{ '--index': i }"
              >
                <span>
                  <div
                    class="cylinder"
                    :class="{ abnormal: n.syn_status === 2 }"
                  />
                </span>
                <b />
              </li>
            </ul>
            <div class="status-container">
              <div class="state">
                同步状态占比
              </div>
              <div
                class="total"
                data-status="同步正常"
              >
                <span>同步正常</span>
                <p>{{ synMonitoringLength - synMonitoringNormalLeng }}个</p>
              </div>
              <div
                class="total"
                data-status="同步延迟"
              >
                <span>同步延迟</span>
                <p>{{ synMonitoringNormalLeng }}个</p>
              </div>
            </div>
            <div class="reminder-container">
              <vue3-seamless-scroll
                :list="result.synMonitoring"
                :step="0.2"
                :limit-scroll-num="5"
              >
                <ul>
                  <li
                    v-for="n in result.synMonitoring"
                    :key="n"
                  >
                    {{ n.desc }}:&nbsp;延迟{{ n.delay_time }}
                  </li>
                </ul>
              </vue3-seamless-scroll>
            </div>
            <div class="operation-container">
              <ul>
                <li />
                <li>
                  <p>{{ currentObj.delayDetails.db_name }}</p>
                  <p>{{ currentObj.delayDetails.desc }}</p>
                </li>
              </ul>
              <div class="date">
                {{ currentObj.delayDetails.delay_time }}
              </div>
            </div>
          </div>
        </div>
        <div class="item-9">
          <div class="title-panel">
            厂商调用数量TOP5
          </div>
          <div class="box">
            <ul>
              <li data-key="TOP4">
                <div class="prompt">
                  {{ unitConverter(result.top5[3].rowCount).value }}
                  {{ unitConverter(result.top5[3].rowCount).unit }}
                  <b>{{ result.top5[3].vendorName }}</b>
                </div>
                <div class="bar" />
              </li>
              <li data-key="TOP2">
                <div class="prompt">
                  {{ unitConverter(result.top5[1].rowCount).value
                  }}{{ unitConverter(result.top5[1].rowCount).unit }}
                  <b>{{ result.top5[1].vendorName }}</b>
                </div>
                <div class="bar" />
              </li>
              <li data-key="TOP1">
                <div class="prompt">
                  {{ unitConverter(result.top5[0].rowCount).value }}
                  {{ unitConverter(result.top5[0].rowCount).unit }}
                  <b>{{ result.top5[0].vendorName }}</b>
                </div>
                <div class="bar" />
              </li>
              <li data-key="TOP3">
                <div class="prompt">
                  {{ unitConverter(result.top5[2].rowCount).value }}
                  {{ unitConverter(result.top5[2].rowCount).unit }}
                  <b>{{ result.top5[2].vendorName }}</b>
                </div>
                <div class="bar" />
              </li>
              <li data-key="TOP5">
                <div class="prompt">
                  {{ unitConverter(result.top5[4].rowCount).value }}
                  {{ unitConverter(result.top5[4].rowCount).unit }}
                  <b>{{ result.top5[4].vendorName }}</b>
                </div>
                <div class="bar" />
              </li>
            </ul>
          </div>
        </div>
        <div class="item-3">
          <div class="title-panel">
            队列资源监控
          </div>
          <div class="box">
            <div class="queue">
              {{ result.queueList.scheduler.schedulerInfo.queueName }}
              {{ result.queueList.scheduler.schedulerInfo.used }}% 使用中
            </div>
            <div class="monitoring-list">
              <vue3-seamless-scroll
                :list="result.queueList.scheduler.schedulerInfo.queues.queue"
                :step="0.1"
                :limit-scroll-num="8"
              >
                <ul>
                  <li
                    v-for="o in result.queueList.scheduler.schedulerInfo.queues
                      .queue"
                    :key="o.queueName"
                    :class="calcRatio(o)['cls']"
                  >
                    <span class="l">{{ o.queueName }}</span>
                    <span class="c">
                      <div
                        class="bar"
                        :style="calcRatio(o)['style']"
                      />
                    </span>
                    <span class="r">{{ calcRatio(o)['used'] }}</span>
                  </li>
                </ul>
              </vue3-seamless-scroll>
            </div>
          </div>
        </div>
        <div class="item-4">
          <div class="title-panel">
            数据库API调用热度TOP10
          </div>
          <div class="boxs">
            <vue3-seamless-scroll
              :list="result.databaseTop10"
              :step="0.2"
              :limit-scroll-num="5"
            >
              <ul>
                <li
                  v-for="n in result.databaseTop10"
                  :key="n.databaseName"
                >
                  <div class="l">
                    <p>{{ n.databaseName }}</p>
                    <p>{{ n.databaseRemark || '暂无说明' }}</p>
                  </div>
                  <div class="r">
                    <div class="text">
                      {{ unitConverter(n.rowCount, 2).value
                      }}{{ unitConverter(n.rowCount, 2).unit }}
                    </div>
                    <span>
                      <div
                        class="bar"
                        :style="{
                          width:
                            (n.rowCount / result.databaseTop10[0].rowCount) *
                            100 +
                            '%',
                        }"
                      />
                    </span>
                  </div>
                </li>
              </ul>
            </vue3-seamless-scroll>
          </div>
        </div>
        <div class="item-5">
          <div class="title-panel">
            延迟概览
          </div>
          <div class="boxs">
            <b>{{ result.delayOverview[2].name }}</b>
            <ul>
              <li class="first">
                <div data-status="同步正常">
                  <p>
                    <NumberGrow
                      :value="result.delayOverview[2].normal"
                      :decimals="0"
                    />
                  </p>
                  <span>同步正常</span>
                </div>
                <div data-status="同步延迟">
                  <p>
                    <NumberGrow
                      :value="result.delayOverview[2].abnormal"
                      :decimals="0"
                    />
                  </p>
                  <span>同步延迟</span>
                </div>
                <div>
                  <div
                    id="total"
                    style="width: 80px; height: 70px"
                  >
                    <ProgressCircle
                      :rate="
                        result.delayOverview[2].normal /
                          result.delayOverview[2].total
                      "
                      ring-color="#3dcc9d"
                      bg-ring-color="#596080"
                      stroke-linecap="round"
                      :stroke-width="30"
                    >
                      <span>{{ normalPercent(result.delayOverview[2]) }}</span>
                    </ProgressCircle>
                  </div>
                </div>
              </li>
              <li>
                <b>{{ result.delayOverview[0].name }}</b>
                <span data-status="同步正常">同步正常</span>
                <span>{{ normalPercent(result.delayOverview[0]) }}</span>
                <span>{{ result.delayOverview[0].normal }}</span>
              </li>
              <li>
                <b>{{ result.delayOverview[1].name }}</b>
                <span data-status="同步正常">同步正常</span>
                <span>{{ normalPercent(result.delayOverview[1]) }}</span>
                <span>{{ result.delayOverview[1].normal }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="item-6">
          <div class="title-panel">
            数据同步延迟
          </div>
          <div class="boxs">
            <div
              id="synDelayEcharts"
              style="width: 100%; height: 240px"
            />
          </div>
        </div>
        <div class="item-7">
          <div class="title-panel">
            数据表API调用热度Top10
          </div>
          <div class="boxs">
            <vue3-seamless-scroll
              :list="result.tableTop10"
              :step="0.2"
              :limit-scroll-num="5"
            >
              <ul>
                <li
                  v-for="n in result.tableTop10"
                  :key="n.tableName"
                >
                  <div class="l">
                    <p>{{ n.tableName }}</p>
                    <p>{{ n.tableRemark || '暂无说明' }}</p>
                  </div>
                  <div class="r">
                    <div class="text">
                      {{ unitConverter(n.rowCount, 2).value
                      }}{{ unitConverter(n.rowCount, 2).unit }}
                    </div>
                    <span>
                      <div
                        class="bar"
                        :style="{
                          width:
                            (n.rowCount / result.tableTop10[0].rowCount) * 100 +
                            '%',
                        }"
                      />
                    </span>
                  </div>
                </li>
              </ul>
            </vue3-seamless-scroll>
          </div>
        </div>
      </div>
    </FixedContent>
  </div>
</template>

<script setup>
import { reactive } from '@vue/reactivity'
import dayjs from 'dayjs'
import Util from '../../utils'
import NumberGrow from '../../components/NumberGrow.vue'
import FixedContent from '../../components/FixedContent.vue'
import ProgressCircle from '../../components/ProgressCircle.vue'
import * as echarts from 'echarts'
import { computed } from '@vue/runtime-core'

const unitConverter = (val, digits) => {
  return Util.unitConverter(val, digits)
}

const normalPercent = (obj) => {
  return ((obj.normal / obj.total) * 100).toFixed(2) + '%'
}

const headList = reactive([
  {
    name: '数据库',
    key: 'database_count',
    render: (item) => {
      let o = unitConverter(item.database_count)
      return {
        value: o.value,
        unit: o.unit,
      }
    },
  },
  {
    name: '数据表',
    key: 'table_count',
    render: (item) => {
      let o = unitConverter(item.table_count)
      return {
        value: o.value,
        unit: o.unit,
      }
    },
  },
  {
    name: '数据字段',
    key: 'field_count',
    render: (item) => {
      let o = unitConverter(item.field_count)
      return {
        value: o.value,
        unit: o.unit,
      }
    },
  },
  {
    name: '数据量',
    key: 'row_count',
    render: (item) => {
      let o = unitConverter(item.row_count)
      return {
        value: o.value,
        unit: o.unit,
      }
    },
  },
  {
    name: 'API调用次数',
    key: 'query_count',
    render: (item) => {
      let o = unitConverter(item.query_count)
      return {
        value: o.value,
        unit: o.unit,
      }
    },
  },
  {
    name: 'API调用数据量',
    key: 'api_row_count',
    render: (item) => {
      let o = unitConverter(item.api_row_count)
      return {
        value: o.value,
        unit: o.unit,
      }
    },
  },
])

const echartConfig = reactive({
  //数据库概览
  databaseOverviewEcharts: {
    tooltip: {
      show: false,
      trigger: 'item',
    },
    series: [
      {
        name: 'database',
        type: 'pie',
        radius: ['60%', '72%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        labelLine: {
          show: false,
        },
        data: [],
      },
    ],
  },
  //数据同步延迟
  synDelayOption: {
    animation: true,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    legend: {
      textStyle: {
        color: '#fff',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundartGap: false,
        data: [],
        axisLine: {
          onZero: false,
          lineStyle: {
            color: '#b8bccc',
          },
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(0,0,0,0)',
            type: 'solid',
          },
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: '#b8bccc',
          },
        },
      },
    ],
  },
})
const overviewTotal = (obj) => {
  let num = 0
  obj.list.forEach((n) => {
    num += n.count
  })
  return num
}
const databaseOverviewEcharts = () => {
  let chartDom = []
  let myChart = []
  let bgColor = [
    ['#3dcc9d', '#f5983b'],
    ['#3dcc9d', '#65d0e5', '#f5983b'],
    ['#65d0e5', '#8585ff', '#898ca3'],
  ]
  result.databaseOverview.forEach((n, i) => {
    chartDom[i] = document.getElementById('overview' + i)
    myChart[i] = echarts.init(chartDom[i], null, { devicePixelRatio: 2.5 })
    let copyDatabaseOverviewEcharts = echartConfig.databaseOverviewEcharts
    copyDatabaseOverviewEcharts.series[0].color = bgColor[i]
    copyDatabaseOverviewEcharts.series[0].data = n.list.map((o) => {
      return {
        name: o.name,
        value: o.count,
      }
    })
    myChart[i].setOption(copyDatabaseOverviewEcharts)
  })
  return myChart
}
const synDelayEcharts = () => {
  let chartDom = document.getElementById('synDelayEcharts')
  let myChart = echarts.init(chartDom, null, { devicePixelRatio: 2.5 })
  let { synDelayOption } = echartConfig
  let { dataSynDelay } = result
  let xAxis = dataSynDelay[0].data.map((n) => n.create_time)
  let series = []
  // const colorTheme = [
  //   {
  //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
  //       {
  //         offset: 0,
  //         color: '#6281ed'
  //       },
  //       {
  //         offset: 1,
  //         color: '#001320'
  //       }
  //     ])
  //   },
  //   {
  //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
  //       {
  //         offset: 0,
  //         color: '#42c2db'
  //       },
  //       {
  //         offset: 1,
  //         color: '#001320'
  //       }
  //     ])
  //   },
  //   {
  //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
  //       {
  //         offset: 0,
  //         color: '#f5cc3b'
  //       },
  //       {
  //         offset: 1,
  //         color: '#001320'
  //       }
  //     ])
  //   }
  // ];
  dataSynDelay.forEach((o) => {
    series.push({
      name: o.name,
      type: 'line',
      showSymbol: false,
      smooth: true,
      emphasis: {
        focus: 'series',
      },
      data: o.data.map((n) => n.delay_time),
    })
  })
  synDelayOption.xAxis[0].data = xAxis
  synDelayOption.series = [...series]

  myChart.setOption(synDelayOption)
  return myChart
}

setTimeout(() => {
  databaseOverviewEcharts()
  synDelayEcharts()
}, 300)

const calcRatio = (o) => {
  let { used } = o
  let cls = 'used'
  if (used > 100) cls = 'used-over-capacity'
  return {
    used: `${used}%`,
    cls,
    style: {
      width: `${used > 100 ? 100 : used}%`,
    },
  }
}

const synMonitoringLength = computed(() => {
  return result.synMonitoring.length
})
const synMonitoringNormalLeng = computed(() => {
  let arr = []
  result.synMonitoring.forEach((n) => {
    if (n.syn_status === 2) {
      arr.push(n.syn_status)
    }
  })
  return arr.length
})
let currentObj = reactive({
  currentItem: 1,
  // currentItemKey: `key-${Date.now()}`,
  delayDetails: {},
})
const result = reactive({
  headList: {
    database_count: 132,
    table_count: 20890,
    field_count: 498448,
    row_count: 3580087967656,
    query_count: 32668097,
    api_row_count: 3209097687,
  },
  currentTime: dayjs().format('YYYY-MM-DD') + ' 00:00至23:59',
  databaseOverview: [
    {
      title: 'T0数据库',
      list: [
        { name: '同步正常', count: 21 },
        { name: '同步异常', count: 1 },
      ],
    },
    {
      title: 'TN数据库',
      list: [
        { name: '更新正常', count: 37 },
        { name: '正在更新', count: 0 },
        { name: '更新异常', count: 23 },
      ],
    },
    {
      title: '数据更新方式',
      list: [
        { name: 'T0数据库', count: 22 },
        { name: 'TN数据库', count: 60 },
        { name: '历史数据库', count: 50 },
      ],
    },
  ],
  queueList: {
    scheduler: {
      schedulerInfo: {
        queueName: 'root',
        used: 58,
        queues: {
          queue: [
            {
              queueName: 'default',
              used: 54,
            },
            {
              queueName: 'sandbox',
              used: 0,
            },
            {
              queueName: 'orl',
              used: 111,
            },
            {
              queueName: 'aolc',
              used: 109,
            },
            {
              queueName: 'bbp',
              used: 20,
            },
            {
              queueName: 'gmnw',
              used: 33,
            },
            {
              queueName: 'lko',
              used: 2,
            },
            {
              queueName: 'btto',
              used: 0,
            },
            {
              queueName: 'al',
              used: 88,
            },
          ],
        },
      },
    },
  },
  delayOverview: [
    {
      name: '前置机延迟',
      normal: '7152',
      abnormal: '28',
      total: '7180',
    },
    {
      name: 'Biou延迟',
      normal: '7168',
      abnormal: '12',
      total: '7180',
    },
    {
      name: '整体延迟',
      normal: '7170',
      abnormal: '10',
      total: '7180',
    },
  ],
  dataSynDelay: [
    {
      name: '前置机',
      data: [
        {
          delay_time: 131,
          create_time: '2022-11-30 00:00:01',
        },
        {
          delay_time: 130,
          create_time: '2022-11-30 02:00:01',
        },
        {
          delay_time: 131,
          create_time: '2022-11-30 04:00:01',
        },
        {
          delay_time: 133,
          create_time: '2022-11-30 06:00:01',
        },
        {
          delay_time: 139.4,
          create_time: '2022-11-30 08:00:01',
        },
        {
          delay_time: 177.9,
          create_time: '2022-11-30 10:00:01',
        },
        {
          delay_time: 184,
          create_time: '2022-11-30 12:00:01',
        },
        {
          delay_time: 120,
          create_time: '2022-11-30 14:00:01',
        },
        {
          delay_time: 220,
          create_time: '2022-11-30 16:00:01',
        },
        {
          delay_time: 100,
          create_time: '2022-11-30 18:00:01',
        },
      ],
    },
    {
      name: 'Biou',
      data: [
        {
          delay_time: 233,
          create_time: '2022-11-30 00:00:01',
        },
        {
          delay_time: 199,
          create_time: '2022-11-30 02:00:01',
        },
        {
          delay_time: 402,
          create_time: '2022-11-30 04:00:01',
        },
        {
          delay_time: 222,
          create_time: '2022-11-30 06:00:01',
        },
        {
          delay_time: 39.4,
          create_time: '2022-11-30 08:00:01',
        },
        {
          delay_time: 77.9,
          create_time: '2022-11-30 10:00:01',
        },
        {
          delay_time: 84,
          create_time: '2022-11-30 12:00:01',
        },
        {
          delay_time: 170,
          create_time: '2022-11-30 14:00:01',
        },
        {
          delay_time: 120,
          create_time: '2022-11-30 16:00:01',
        },
        {
          delay_time: 200,
          create_time: '2022-11-30 18:00:01',
        },
      ],
    },
    {
      name: '整体',
      data: [
        {
          delay_time: 31,
          create_time: '2022-11-30 00:00:01',
        },
        {
          delay_time: 150,
          create_time: '2022-11-30 02:00:01',
        },
        {
          delay_time: 101,
          create_time: '2022-11-30 04:00:01',
        },
        {
          delay_time: 143,
          create_time: '2022-11-30 06:00:01',
        },
        {
          delay_time: 119.4,
          create_time: '2022-11-30 08:00:01',
        },
        {
          delay_time: 107.9,
          create_time: '2022-11-30 10:00:01',
        },
        {
          delay_time: 194,
          create_time: '2022-11-30 12:00:01',
        },
        {
          delay_time: 110,
          create_time: '2022-11-30 14:00:01',
        },
        {
          delay_time: 210,
          create_time: '2022-11-30 16:00:01',
        },
        {
          delay_time: 190,
          create_time: '2022-11-30 18:00:01',
        },
      ],
    },
  ],
  tableTop10: [
    {
      tableName: 'Tbi_iu_jik',
      tableRemark: '记录表',
      rowCount: 299888,
    },
    {
      tableName: 'Tbi_iu_yyn',
      tableRemark: '业务表',
      rowCount: 250888,
    },
    {
      tableName: 'Tbi_iu_yy',
      tableRemark: '业务主表',
      rowCount: 232888,
    },
    {
      tableName: 'Biou_hj',
      rowCount: 210888,
    },
    {
      tableName: 'Oral_nn',
      rowCount: 189888,
    },
    {
      tableName: 'Yhbh',
      tableRemark: '申请表',
      rowCount: 149088,
    },
    {
      tableName: 'Bbh',
      rowCount: 109888,
    },
    {
      tableName: 'Gyh_hj',
      tableRemark: '归类表',
      rowCount: 9288,
    },
    {
      tableName: 'Cgt',
      rowCount: 3188,
    },
    {
      tableName: 'Ayh',
      tableRemark: '离线表',
      rowCount: 258,
    },
  ],
  databaseTop10: [
    {
      databaseName: 'Hu_jik',
      databaseRemark: '申请库',
      rowCount: 323888,
    },
    {
      databaseName: 'Tbi_iu_yyn',
      databaseRemark: '业务主库',
      rowCount: 250888,
    },
    {
      databaseName: 'Tbi_iu_yy',
      databaseRemark: '业务库',
      rowCount: 244488,
    },
    {
      databaseName: 'Biou_hj',
      rowCount: 210888,
    },
    {
      databaseName: 'Oral_nn',
      rowCount: 189888,
    },
    {
      databaseName: 'Yhbh',
      databaseRemark: '记录表',
      rowCount: 119088,
    },
    {
      databaseName: 'Bbh',
      rowCount: 109888,
    },
    {
      databaseName: 'Gyh_hj',
      databaseRemark: '汇总表',
      rowCount: 9288,
    },
    {
      databaseName: 'Cgt',
      rowCount: 3188,
    },
    {
      databaseName: 'Ayh',
      rowCount: 2358,
    },
  ],
  top5: [
    { rowCount: 913690, vendorName: 'Ace' },
    { rowCount: 119685, vendorName: 'Bnn' },
    { rowCount: 100690, vendorName: 'Tvh' },
    { rowCount: 93690, vendorName: 'Cnj' },
    { rowCount: 69090, vendorName: 'Kju' },
  ],
  synMonitoring: [
    {
      db_name: 'gui_yj',
      desc: '新增',
      delay_time: 635,
      syn_status: 1,
    },
    {
      db_name: 'gui_yj',
      desc: '现存',
      delay_time: 6350,
      syn_status: 2,
    },
    {
      db_name: 'gui_yj',
      desc: '新增',
      delay_time: 35,
      syn_status: 1,
    },
    {
      db_name: 'yk',
      desc: 'auto',
      delay_time: 888,
      syn_status: 1,
    },
    {
      db_name: 'gui_yj',
      desc: '待增加',
      delay_time: 999,
      syn_status: 1,
    },
    {
      db_name: 'gui_yj',
      desc: '新增',
      delay_time: 78,
      syn_status: 1,
    },
    {
      db_name: 'gui_yj',
      desc: '新增',
      delay_time: 9,
      syn_status: 1,
    },
    {
      db_name: 'po',
      desc: '现存',
      delay_time: 635,
      syn_status: 2,
    },
    {
      db_name: 'gui_yj',
      desc: '新增',
      delay_time: 56,
      syn_status: 1,
    },
    {
      db_name: 'gui_yj',
      desc: '现存',
      delay_time: 7,
      syn_status: 1,
    },
    {
      db_name: 'wf',
      desc: '新增',
      delay_time: 635,
      syn_status: 1,
    },
    {
      db_name: 'gui_yj',
      desc: '新增',
      delay_time: 222,
      syn_status: 1,
    },
    {
      db_name: 'vg',
      desc: '新增',
      delay_time: 635,
      syn_status: 1,
    },
    {
      db_name: 'gui_yj',
      desc: '新增',
      delay_time: 78,
      syn_status: 1,
    },
    {
      db_name: 'gui_yj',
      desc: '新增',
      delay_time: 8,
      syn_status: 1,
    },
    {
      db_name: 'yd',
      desc: '新增',
      delay_time: 635,
      syn_status: 1,
    },
    {
      db_name: 'gui_yj',
      desc: '现存',
      delay_time: 67,
      syn_status: 1,
    },
    {
      db_name: 'cy',
      desc: '新增',
      delay_time: 635,
      syn_status: 1,
    },
    {
      db_name: 'gui_yj',
      desc: '现存',
      delay_time: 788,
      syn_status: 1,
    },
    {
      db_name: 'gui_yj',
      desc: '新增',
      delay_time: 88,
      syn_status: 1,
    },
    {
      db_name: 'bl',
      desc: '现存',
      delay_time: 635,
      syn_status: 1,
    },
    {
      db_name: 'ybd',
      desc: 'auto',
      delay_time: 4,
      syn_status: 1,
    },
  ],
})
currentObj.delayDetails = result.synMonitoring[0]
</script>

<style lang="scss" scoped>
// $color: red;

// div {
//   color: $color;
// };
@keyframes fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.main-screen {
  width: 100%;
  height: 100%;
  position: relative;
  background: #000;
  font-size: 14px;
  $statusObj: (同步正常, #60dbb3, #0a1c47), (同步延迟, #f1aa63, #0a1c47);
  div[data-status] {
    @each $txt, $bg, $color in $statusObj {
      &[data-status='#{$txt}'] {
        p {
          color: $bg;
        }
        span {
          display: inline-flex;
          align-items: center;
          padding: 0 8px;
          height: 20px;
          border-radius: 2px;
          font-size: 12px;
          color: $color;
          background: $bg;
          &::before {
            content: '';
            width: 6px;
            height: 6px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 4px;
            background: $color;
          }
        }
      }
    }
  }
  span[data-status] {
    @each $txt, $bg, $color in $statusObj {
      &[data-status='#{$txt}'] {
        color: $bg;
      }
    }
  }
  ul {
    padding-left: 20px;
  }
  .screen-container {
    display: grid;
    grid-gap: 15px;
    grid-template-columns: 22% auto 22%;
    grid-template-rows: 80px auto auto 30%;
    background: #0a1c47;
    padding: 0 20px;
  }
  li {
    list-style: none;
  }
  .title-panel {
    &::before {
      content: ' ';
      width: 60px;
      height: 3px;
      background: #60dbb3;
      position: absolute;
      top: -3px;
      font-size: 16px;
    }
    &::after {
      content: ' ';
      width: 25px;
      height: 3px;
      background: #60dbb3;
      position: absolute;
      top: -3px;
      right: 0;
    }
    position: relative;
    border-top: 1px solid #60dbb3;
    color: #60dbb3;
    font-weight: 600;
    padding-top: 10px;
    margin-bottom: 5px;
  }
  .item-1 {
    grid-column-start: 1;
    grid-column-end: 4;
    .nav-l {
      float: left;
      position: relative;
      top: 13px;
      .logo-name {
        font-size: 28px;
        background-image: -webkit-linear-gradient(left, #fff, #c8fae9);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        padding-left: 20px;
      }
    }
    .nav-r {
      display: flex;
      justify-content: space-around;
      ul {
        display: flex;
        justify-content: space-between;
        color: #b8bccc;
        padding-left: 20px;
        li {
          white-space: nowrap;
          padding-right: 15px;
          &:first-child {
            position: relative;
            top: 2px;
          }
        }
        b {
          color: #60dbb3;
          font-size: 20px;
        }
      }
    }
  }
  .item-2 {
    animation: fadein 0.3s ease 0s 1 normal both running;
    ul {
      color: #d8d9e6;
      display: flex;
      justify-content: space-between;
      li {
        text-align: center;
        .echarts-box {
          position: relative;
          .center {
            color: #fff;
            position: absolute;
            width: 100%;
            top: 37px;
            b {
              font-size: 20px;
            }
            p {
              font-size: 12px;
              margin-top: 0;
            }
          }
        }
        .hint {
          text-align: left;
          margin-top: 5px;
          p[data-color='TN数据库'] {
            color: #8585ff;
          }
          p[data-color='历史数据库'] {
            color: #898ca3;
          }
          p[data-color='更新正常'],
          p[data-color='同步正常'] {
            color: #3dcc9d;
          }
          p[data-color='正在更新'],
          p[data-color='T0数据库'] {
            color: #65d0e5;
          }
          p[data-color='更新异常'],
          p[data-color='同步异常'] {
            color: #f7ad63;
          }
        }
      }
    }
  }
  .item-3 {
    animation: fadein 0.3s ease 0s 1 normal both running;
    .box {
      .queue {
        background: rgba(66, 194, 219, 0.1);
        color: #65d0e6;
        padding: 5px 15px;
        margin: 5px 0;
      }
      .monitoring-list {
        height: 245px;
        // margin-top: 15px;
        overflow: hidden;
      }
      ul {
        color: #fff;
        font-size: 12px;
        li {
          margin-bottom: 13px;
          display: flex;
          span {
            &.l {
              width: 90px;
            }
            &.c {
              position: relative;
              height: 12px;
              width: 100%;
              background: #223058;
              .bar {
                position: absolute;
                top: 2px;
                left: 0;
                height: 8px;
                width: 10%;
                background-image: linear-gradient(
                  to right,
                  rgba(255, 255, 255, 19%),
                  #60dbb3
                );
              }
            }
            &.r {
              margin-left: 5px;
              width: 50px;
              text-align: center;
            }
          }
          &.used-over-capacity {
            span {
              &.l {
                &::after {
                  content: '\8fc7\8f7d';
                  height: 20px;
                  background: #f1aa63;
                  border-radius: 2px;
                  color: #1f264d;
                  font-size: 12px;
                  padding: 2px 3px;
                  margin-left: 8px;
                }
              }
              &.c {
                .bar {
                  background-image: linear-gradient(
                    to right,
                    rgba(255, 255, 255, 19%),
                    #f58718
                  );
                }
              }
            }
          }
        }
      }
    }
  }
  .item-5 {
    .boxs {
      b {
        font-size: 16px;
      }
      li {
        display: flex;
        justify-content: space-between;
        padding: 9px 16px;
        &:nth-child(odd) {
          background: rgba(255, 255, 255, 0.08);
        }
        &.first {
          margin-bottom: 24px;
          p {
            font-size: 24px;
            text-align: center;
            margin: 7px;
          }
        }
        b {
          width: 130px;
        }
        span {
          font-weight: 500;
        }
      }
    }
  }
  .item-4,
  .item-7 {
    margin-bottom: 25px;
    .boxs {
      height: 278px;
      overflow: hidden;
      li {
        position: relative;
        padding: 5px 16px;
        display: flex;
        .l {
          width: 220px;
        }
        .r {
          width: 145px;
          display: flex;
          align-items: center;
          margin-right: 10px;
          .text {
            padding-right: 8px;
            white-space: nowrap;
          }
          span {
            position: relative;
            width: 80px;
            height: 8px;
            .bar {
              position: absolute;
              width: 30%;
              height: 100%;
              background: #3dcc9d;
            }
          }
        }
        &:nth-child(odd) {
          background-color: rgba(255, 255, 255, 0.08);
        }
        p {
          color: #d8d9e6;
          margin: 2px 0;
        }
      }
    }
  }
  .item-8 {
    animation: fadein 0.3s ease 0s 1 normal both running;
    grid-row-start: 2;
    grid-row-end: 4;
    grid-column-start: 2;
    .box {
      position: relative;
      height: 100%;
      .max-title {
        font-weight: 500;
        color: #60dbb3;
        font-size: 30px;
        padding-left: 45px;
      }
      .monitor-border {
        width: 460px;
        height: 460px;
        position: absolute;
        top: 17%;
        left: 28.5%;
        border: 1px dashed #3dcc9d;
        border-radius: 50%;
      }
      svg {
        position: absolute;
        top: 27%;
        left: 35%;
        // circle {
        // transform: rotate(30deg);
        // transform-origin: 30% 50%;
        //         animation:rotate30 4s infinite alternate;
        //         @keyframes rotate30
        // {
        // 	from {opacity: 1;}
        // 	to {opacity: 1;transform: rotate(180deg);}
        // }
        // }
        // @keyframes rotate30 {
        //   0% {
        //     opacity: 1;
        //     transform: rotate(0deg);
        //   }
        //   100% {
        //     opacity: 1;
        //     transform: rotate(30deg);
        //   }
        // }
        // circle {
        //   animation: rotate30 5s  ease 0s 1 infinite alternate;
        // }
      }
      .monitoring-box {
        position: absolute;
        top: 44%;
        left: 27.5%;
        li {
          &.on {
            background: #60dbb3;
          }
          border: 1px solid #233158;
          width: 50px;
          height: 50px;
          background: #233158;
          border-radius: 50%;
          text-align: center;
          position: absolute;
          display: inline;
          span {
            width: 40px;
            height: 40px;
            border: 1px dashed #7b90e2;
            border-radius: 50%;
            margin: 2px;
            position: absolute;
            top: 2px;
            left: 2px;
            .cylinder {
              margin-left: 10px;
              width: 18px;
              height: 18px;
              background: #3c5ff6;
              border-radius: 10px;
              transform: rotateX(70deg);
              &::after {
                content: '';
                display: inline-block;
                width: 18px;
                height: 72px;
                position: relative;
                opacity: 0.65;
                background: #3c5ff6;
                top: 50%;
                border-bottom-left-radius: 10px;
                border-bottom-right-radius: 10px;
              }
              &.abnormal {
                background: #c36681;
                &::after {
                  background: #c36681;
                }
              }
            }
          }
          b {
            background: #2d3d76;
            position: relative;
            top: 25px;
            left: 47px;
            width: 100px;
            height: 2px;
            display: block;
            z-index: 0;
            overflow: hidden;
            &::after {
              content: ' ';
              width: 8px;
              height: 8px;
              background: #4fffd6;
              border-radius: 50%;
              display: block;
              position: relative;
              top: -4px;
              left: -6px;
            }
          }
        }
        @keyframes operation {
          0% {
            opacity: 1;
            left: 0px;
          }
          100% {
            opacity: 1;
            left: 150px;
          }
        }
        --length: 10;
        --angle: calc(calc(360 / var(--length)) * 1deg);
        li {
          --index: 0;
          --ang: calc(var(--index) * var(--angle));
          --ang1: calc(var(--ang) * -1);
          transform: rotate(var(--ang));
          transform-origin: 220px 40px;
          span {
            transform: rotate(var(--ang1));
            position: absolute;
          }
          b {
            &::after {
              animation: operation 10s calc(var(--index) * 0.8s) ease infinite;
            }
          }
        }
      }
      .status-container {
        position: absolute;
        top: 125px;
        left: 45px;
        color: #fff;
        .state {
          font-weight: 600;
        }
        .total {
          p {
            display: inline-block;
            margin-left: 5px;
            position: relative;
            top: 2px;
          }
        }
      }
      .reminder-container,
      .operation-container {
        width: 200px;
        background: #0a1c47;
        // background-size: 100% 100%;
      }
      .reminder-container {
        border: 1px solid #3dcc9d;
        border-radius: 2px;
        height: 150px;
        overflow: hidden;
        position: absolute;
        left: 45px;
        bottom: 50px;
        ul {
          padding: 4px 8px;
          li {
            padding: 10px 12px;
            color: #fff;
            &:nth-child(odd) {
              background: rgba(255, 255, 255, 0.08);
            }
          }
        }
      }
      .operation-container {
        position: absolute;
        right: 45px;
        bottom: 50px;
        border: 1px solid #3dcc9d;
        border-radius: 2px;
        padding: 20px 10px 20px 15px;
      }
    }
  }
  .item-9 {
    animation: fadein 0.3s ease 0s 1 normal both running;
    .box {
      height: 100%;
    }
    ul {
      display: flex;
      height: 100%;
      li {
        flex: 1;
        position: relative;
        .prompt {
          width: 100%;
          position: absolute;
          font-size: 12px;
          color: #c8fae9;
          text-align: center;
          b {
            font-size: 14px;
            display: block;
            margin-top: 3px;
          }
        }
        .bar {
          width: 30px;
          position: absolute;
          right: calc(50% - 15px);
          bottom: 77px;
        }
        &[data-key='TOP1'] {
          .prompt {
            top: 10px;
          }
          .bar {
            height: 178px;
            background: linear-gradient(to left top, #6dea85, rgba(0, 0, 0, 0));
          }
        }
        &[data-key='TOP2'] {
          .prompt {
            top: 10%;
          }
          .bar {
            height: 156px;
            background: linear-gradient(to left top, #4063d7, rgba(0, 0, 0, 0));
          }
        }
        &[data-key='TOP3'] {
          .prompt {
            top: 20%;
          }
          .bar {
            height: 125px;
            background: linear-gradient(to left top, #5cbed2, rgba(0, 0, 0, 0));
          }
        }
        &[data-key='TOP4'] {
          .prompt {
            top: 30%;
          }
          .bar {
            height: 90px;
            background: linear-gradient(to left top, #bd8eed, rgba(0, 0, 0, 0));
          }
        }
        &[data-key='TOP5'] {
          .prompt {
            top: 40%;
          }
          .bar {
            height: 65px;
            background: linear-gradient(to left top, #e88038, rgba(0, 0, 0, 0));
          }
        }
      }
    }
  }
}
.box {
  display: block;
}
</style>
