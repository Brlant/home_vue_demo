<template>
    <div>
      <!--面包屑导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
<!--      卡片视图区域-->
      <el-card>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
              <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="goAddPage">添加商品</el-button>
          </el-col>
        </el-row>
<!--        table表格区域-->
        <el-table :data="goodslist" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="goods_name" label="商品名称"></el-table-column>
          <el-table-column prop="goods_price" label="商品价格(元)" width="95px"></el-table-column>
          <el-table-column prop="goods_weight" label="商品重量" width="70px"></el-table-column>
          <el-table-column prop="add_time" label="创建时间" width="170px">
            <template slot-scope="scope">
              {{scope.row.add_time | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="130px">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeById(scope.row.goods_id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--实现分页效果-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
        >
        </el-pagination>
      </el-card>
    </div>
</template>

<script>
    export default {
        name: "list",
      data(){
          return{
            //查询参数对象
            queryInfo:{
              query:'',
              pagenum:1,
              pagesize:10
            },
            //商品列表
            goodslist:[],
            //总数据条数
            total:0
          }
      },
      methods:{
          //根据分页获取对应的商品列表
        async getGoodsList(){
          const {data:res} = await this.$http.get(`goods`, {params:this.queryInfo})
          if(res.meta.status !== 200){
            this.$message.error("获取数据列表失败")
          }
          this.$message.success("获取商品列表成功")
          console.log(res.data)
          this.goodslist = res.data.goods
          this.total = res.data.total
        },
        handleSizeChange(newSize){
          this.queryInfo.pagesize = newSize
          this.getGoodsList()
        },
        handleCurrentChange(newPage){
          this.queryInfo.pagenum = newPage
          this.getGoodsList()
        },
        //根据id删除参数
        async removeById(id){
          const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err=>err)
          //用户没有删除此列表
          if(confirmResult !== 'confirm'){
            return this.$message.info('已取消删除此参数')
          }
          const {data:res} = await this.$http.delete(`goods/${id}`)
          if(res.meta.status !== 200){
            return this.$message.error("删除失败！！！")
          }
          this.$message.success("删除成功！！！")
          this.getGoodsList()
        },
        //页面跳转
        goAddPage(){
          this.$router.push({path:'/goods/add'})
        }
      },
      created() {
          this.getGoodsList()
      }
    }
</script>

<style scoped>

</style>
