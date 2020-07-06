<template>
  <div class="statistics-flow">
    <el-row class="table-search">
      <el-col class="kuaijieriqi">
        <el-radio-group v-model="checkedRadio" @change="radioChange" size="medium">
          <el-radio-button label="0">今天</el-radio-button>
          <el-radio-button label="1">昨天</el-radio-button>
          <el-radio-button label="7">近7日</el-radio-button>
          <el-radio-button label="30">近30日</el-radio-button>
        </el-radio-group>
      </el-col>
      <el-col :span="14">
        <el-form ref="searchForm" size="medium" :inline="true" :model="searchCondition" class="demo-form-inline">
          <el-form-item label="选择时间">
            <el-date-picker
              v-model="searchCondition.time_value"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchButton" :loading='loadingStatus'>查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row id="echarts-flow-data">
      <div id="main" ></div>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/extension/bmap/bmap'
import elementResizeDetector from 'element-resize-detector'
import { mapGetters } from 'vuex'

export default {
  components: {
    echarts,
    elementResizeDetector
  },
  data() {
    return {
      // 日期单选
      checkedRadio:7,
      chartFlow: null,
      searchCondition: {
        time_value: null
      },
    }
  },
  computed: {
    ...mapGetters(['loadingStatus'])
  },
  watch: {
  },
  methods: {
    radioChange() {
      this.initChart()
    },
    initChart() {
      this.chartFlow = echarts.init(document.getElementById('main'))
      let nowTime = new Date()
      let startTime = new Date(nowTime.getTime() - (1000 * 86400 * this.checkedRadio))
      let start = startTime.getFullYear() + '-' + (startTime.getMonth() + 1) + '-' + startTime.getDate()
      let end = nowTime.getFullYear() + '-' + (nowTime.getMonth() + 1) + '-' + nowTime.getDate()
      this.searchCondition.time_value = [start, end]
      let condition = this.handleCondition()
      this.loadChartData(condition)
    },
    async searchButton() {
      this.checkedRadio = -1
      this.$refs['searchForm'].validate((valid) => {
        if (valid) {
          let condition = this.handleCondition()
          this.loadChartData(condition)
        }
      })
    },
    handleCondition() {
      let condition = {
        start_time : this.searchCondition.time_value[0],
        end_time : this.searchCondition.time_value[1]
      }
      return condition
    },
    convertData(data) {
      let res = []
      for (let i = 0; i < data.length; i++) {
          let geoCoord = data[i].name
          if (geoCoord) {
              res.push({
                  name: data[i].name,
                  value: data[i].value,
              });
          }
      }
      return res;
    },
    async loadChartData(condition) {
      this.chartFlow.clear()
      this.$store.commit('changeLoadingStatus',true)
      let info = await this.$api.getStatisticsRegionData(condition)
      this.$store.commit('changeLoadingStatus',false)
      let option = {
        title: {
          text: '地域统计',
          subtext: 'PV/UV/IP',
          subtextStyle:{
            color: '#000',
            fontWeight: 'bold'
          },
          left: 'center',
          top: 0
        },
        tooltip : {
          formatter: function (params) {
            let str = params.name+'<br />';
            str = str+'PV：'+params.value[2]+'<br />';
            str = str+'UV：'+params.value[3]+'<br />';
            str = str+'IP：'+params.value[4]+'<br />';
            return str;
          }
        },
        bmap: {
          center: [104.114129, 37.550339],
          zoom: 5,
          roam: true,
          mapStyle: {
            styleJson: [
              {
              'featureType': 'water',
              'elementType': 'all',
              'stylers': {
                  'color': '#96b5d6'
                }
              }, 
              {
              'featureType': 'land',
              'elementType': 'all',
              'stylers': {
                  'color': '#f3f3f3'
                }
              },
              {
                'featureType': 'railway',
                'elementType': 'all',
                'stylers': {
                  'color': '##ff4d4f',
                }
              },
              {
                'featureType': 'highway',
                'elementType': 'all',
                'stylers': {
                  'color': '#ffec3d'
                }
              },
              {
                'featureType': 'highway',
                'elementType': 'labels',
                'stylers': {
                  'color': '#ffec3d'
                }
              },
              {
                'featureType': 'arterial',
                'elementType': 'geometry',
                'stylers': {
                  'color': '#36cfc9'
                }
              }, 
              {
                'featureType': 'arterial',
                'elementType': 'geometry.fill',
                'stylers': {
                  'color': '#36cfc9'
                }
              },
              {
                'featureType': 'green',
                'elementType': 'all',
                'stylers': {
                  'color': '#52c41a'
                }
              }, 
              {
                'featureType': 'manmade',
                'elementType': 'all',
                'stylers': {
                  'color': '#eaff8f'
                }
              }, 
              {
                'featureType': 'local',
                'elementType': 'all',
                'stylers': {
                  'color': '#bfbfbf'
                }
              }, 
              {
                'featureType': 'boundary',
                'elementType': 'province',
                'stylers': {
                  'color': '#262626'
                }
              }, 
              {
                'featureType': 'building',
                'elementType': 'all',
                'stylers': {
                  'color': '#d1d1d1'
                }
              }, 
              {
                'featureType': 'label',
                'elementType': 'labels.text.fill',
                'stylers': {
                  'color': '#999999'
                }
              }
            ]
          }
        },
        series : [
          {
            name: 'all',
            type: 'scatter',
            coordinateSystem: 'bmap',
            data: this.convertData(info.all_data),
            symbolSize: function (val) {
              let v = val[2]/20
              return v>50?50:v
            },
            label: {
              formatter: '{b}',
              position: 'right',
              show: false
            },
            itemStyle: {
              color: 'purple'
            },
            emphasis: {
              label: {
                fontWeight: 'bolder',
                show: true
              }
            }
          },
          {
            name: 'Top 5',
            type: 'effectScatter',
            coordinateSystem: 'bmap',
            data: this.convertData(info.all_data.sort(function (a, b) {
                return b.value[2] - a.value[2]
            }).slice(0, 6)),
            symbolSize: function (val) {
              let v = val[2]/20
              return v>60?60:v
            },
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke',
              scale: 3.5
            },
            hoverAnimation: true,
            label: {
              formatter: '{b}',
              position: 'right',
              fontWeight: 'bolder',
              show: true
            },
            itemStyle: {
              color: 'purple',
              shadowColor: '#820014'
            }
          }
        ]
      }
      this.chartFlow.setOption(option)
      // // 获取百度地图实例，使用百度地图自带的控件
      // this.bmap = this.chartFlow.getModel().getComponent('bmap').getBMap()
      // this.bmap.setMinZoom(2) // 设置地图最小缩放比例
      // this.bmap.setMaxZoom(12) // 设置地图最大缩放比例
      // // this.bmap.addControl(new BMap.MapTypeControl({ mapTypes: [] })) // 不显示地图右上方的控件
      // this.bmap.addControl(new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT })) // 在左下角显示比例尺控件
      // const _this = this
      // // 监听地图比例缩放， 可以根据缩放等级控制某些图标的显示
      // this.bmap.addEventListener('zoomend', function () {
      //   _this.mapZoom = _this.bmap.getZoom()
      // })
    }
  },

  mounted() {
    this.initChart()
    let erd = elementResizeDetector()
    let _this = this
    erd.listenTo(document.getElementById("echarts-flow-data"),function(){
      _this.chartFlow.resize()
    })
  },
}
</script>

<style lang="stylus">
  .kuaijieriqi
    width 320px
  #main
    width 100%
    height 640px
</style>
