<template>
    <div>
      <!--面包屑导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片视图-->
      <el-card>
        <el-table :data="rightsList" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="authName" label="权限名称"></el-table-column>
          <el-table-column prop="path" label="路径"></el-table-column>
          <el-table-column prop="level" label="权限等级">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.level === '0'">一级</el-tag>
              <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
              <el-tag v-else="scope.row.level === '2'" type="warning">三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
    export default {
        name: "power",
      data(){
          return{
            //所有的权限列表
            rightsList:[]
          }
      },
      created() {
          this.getRightList()
      },
      methods:{
          async getRightList(){
            const res = await this.$http.get("rights/list")
            if (res.data.meta.status !== 200) {
             this.$message.error("获取权限列表失败！！！")
            } else {
              this.rightsList = res.data.data
              console.log(this.rightsList)
            }
          }
      }
    }
</script>

<style scoped>

</style>
