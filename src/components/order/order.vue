<template>
    <div>
      <!--面包屑导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
<!--      卡片视图-->
      <el-card>
        <el-row>
          <el-col :span="8">
            <el-input placeholder="请输入内容">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
        </el-row>
<!--        订单列表数据-->
        <el-table :data="orderlist" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="order_number" label="订单编号" width="300px"></el-table-column>
          <el-table-column prop="order_price" label="订单价格" width="100px"></el-table-column>
          <el-table-column prop="pay_status" label="是否付款" width="100px">
            <template slot-scope="scope"  >
              <el-tag type="success" v-if="scope.row.pay_status === '1'" width="300px">已付款</el-tag>
              <el-tag type="danger" v-else>未付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="is_send" label="是否发货"></el-table-column>
          <el-table-column prop="create_time" label="下单时间">
            <template slot-scope="scope">
              {{scope.row.create_time | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini"
                         type="primary"
                         icon="el-icon-edit"
                         @click="showBox">
              </el-button>
              <el-button size="mini" type="success"
                         icon="el-icon-location"
                         @click="showProgressBox">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
<!--        分页-->
        <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="queryInfo.pagenum"
                  :page-sizes="[10, 20, 30]"
                  :page-size="queryInfo.pagesize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total">
        </el-pagination>
      </el-card>
<!--      修改地址的对话框-->
        <el-dialog
              title="修改地址"
              width="50%"
              :visible.sync="addressVisible"
              @close="addressDialogClosed"
              >
              <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px" >
                  <el-form-item label="省市区/县" prop="address1">
                    <el-cascader
                             :options="cityData"
                             v-model="addressForm.address1">
                    </el-cascader>
                  </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                  <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="addressVisible = false">取 消</el-button>
                <el-button type="primary" @click="addressVisible = false">确 定</el-button>
              </span>
        </el-dialog>
<!--      展示物流进度的对话框-->
      <el-dialog
            title="物流进度"
            :visible.sync="progressVisible"
            width="50%">
            <span>这是一段信息</span>
      </el-dialog>
    </div>
</template>

<script>
  import cityData from "./citydata";
    export default {
      name: "order",
      data(){
          return{
            queryInfo:{
              query:'',
              pagenum:1,
              pagesize:10
            },
            total:0,
            orderlist:[],
            //修改地址的对话框
            addressVisible:false,
            //表单地址
            addressForm:{
              address1:[],
              address2:''
            },
            //表单验证
            addressFormRules:{
              address1:[
                { required: true, message: '请选择省市区/县', trigger: 'blur' }
              ],
              address2:[
                { required: true, message: '请输入详细地址', trigger: 'blur' }
              ]
            },
            //城市级别
            cityData:cityData,
            //物流进度
            progressVisible:false,
            //物流信息
            progressInfo:[],
          }
      },
      methods:{
        async getOrderList(){
          const {data:res} = await this.$http.get('orders',{params:this.queryInfo})
          if(res.meta.status !== 200){
            return this.$message.error("获取订单列表失败！！！")
          }
          console.log(res)
          this.total = res.data.total
          this.orderlist = res.data.goods
        },
        handleSizeChange(newSize){
          this.queryInfo.pagesize = newSize
          this.getOrderList()
        },
        handleCurrentChange(newPage){
          this.queryInfo.pagenum = newPage
          this.getOrderList()
        },
        //展示修改地址的对话框
        showBox(){
          this.addressVisible = true
        },
        //关闭的时候，清空表单
        addressDialogClosed(){
          this.$refs.addressFormRef.resetFields()
        },
        //物流进度
         showProgressBox(){
          const res =  this.$http.get('kuaidi/804909574412544580')
          if(res.data.meta.status !== 200){
            return this.$message.error("获取快递进度失败！！！")
          }
          this.progressInfo = res.data.data
          console.log(this.progressInfo)
          this.progressVisible = true
        }
      },
      created() {
        this.getOrderList()
      }
    }
</script>

<style scoped>
.el-cascader{
  width: 100%;
}
</style>
