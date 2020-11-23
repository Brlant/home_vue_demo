<template>
    <div>
      <!--面包屑导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据报表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片视图-->
      <el-card>
        <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
        <div class="flex">
          <div id="main" style="width: 640px;height:300px;"></div>
          <div id="echart" style="width: 640px;height:300px;"></div>
        </div>
        <div class="flex-height">
          <div id="focus" style="width: 640px;height:300px;"></div>
          <div id="find" style="width: 640px;height:300px;"></div>
        </div>

      </el-card>
    </div>
</template>

<script>
  import echarts from "echarts"
  import _ from 'lodash'
    export default {
        name: "report",
      data(){
          return{
            //需要合并的数据
            options: {
              title: {
                text: '浩:学习模板'
              },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  label: {
                    backgroundColor: '#E9EEF3'
                  }
                }
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: [
                {
                  boundaryGap: false
                }
              ],
              yAxis: [
                {
                  type: 'value'
                }
              ]
            }
          }
      },
      created() {

      },
      //此时,页面上的元素被渲染完毕
      async mounted() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
        var Chart = echarts.init(document.getElementById('echart'));
        var focus = echarts.init(document.getElementById('focus'));
        var find = echarts.init(document.getElementById('find'));

        const {data:res} = await this.$http.get('reports/type/1')
        if(res.meta.status !== 200){
          return this.$message.info("获取图标数据失败!!!")
        }

      //  准备数据和配置项目
        const result = _.merge(res.data,this.options)
      //   var option = {
      //     title: {
      //       text: '郑浩'
      //     },
      //     tooltip: {},
      //     legend: {
      //       data:['销量']
      //     },
      //     xAxis: {
      //       data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
      //     },
      //     yAxis: {},
      //     series: [{
      //       name: '销量',
      //       type: 'bar',
      //       data: [5, 20, 36, 10, 10, 20]
      //     }]
      //   };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(result);
        Chart.setOption(result);
        focus.setOption(result);
        find.setOption(result);
      },
      methods:{

      }
    }
</script>

<style scoped>
.flex{
  display: flex;
}
.flex-height{
  display: flex;
  margin-top: 10px;
}
</style>
