<template>
    <div>
      <!--面包屑导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
<!--      卡片视图-->
      <el-card>
        <el-row>
          <el-col>
            <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
          </el-col>
        </el-row>

<!--        表格占位-->
        <tree-table
                  :data="catelist"
                  :columns="columns"
                  :selection-type="false"
                  :expand-type="false"
                  show-index
                  :show-row-hover="false"
                  border
                  class="treeTable"
                  index-text="#">
<!--          是否有效-->
          <template slot-scope="scope" slot="isok">
            <i class="el-icon-success"
               v-if="scope.row.cat_deleted == false"
               style="color:#4D43F2;"
            ></i>
            <i class="el-icon-error" v-else
               style="color:red;"
            ></i>
          </template>
          <!--          排序-->
          <template slot-scope="scope" slot="order">
            <el-tag v-if="scope.row.cat_level === 0 ">一级</el-tag>
            <el-tag v-else-if="scope.row.cat_level === 1 "type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
          <!--          操作-->
          <template slot-scope="scope" slot="opt">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          </template>
        </tree-table>
<!--        分页区域-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[4, 8, 12, 16]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>
<!--      添加分类的对话框-->
      <el-dialog
                title="添加分类"
                :visible.sync="addCateDialogVisible"
                width="50%"
                @close="addCateDialogClose"
                >
<!--        添加分类的表单-->
        <!--props用来指定配置对象-->
                <el-form :model="addCateForm"
                         :rules="addCateRules"
                         ref="addCateRef"
                         label-width="100px"
                         class="demo-ruleForm">
                  <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                  </el-form-item>
                  <el-form-item label="父级分类" >
                    <el-cascader
                                expand-tigger="hover"
                                clearable
                                change-on-select
                                v-model="selectKeys"
                                :options="parentCateList"
                                :props="cascaderProps"
                                @change="parentCateChange">
                    </el-cascader>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
                </span>
      </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "categories",
      data(){
          return{
            //商品分类的数据列表
            catelist:[],
            //查询条件
            queryInfo:{
              type:3,
              pagenum:1,
              pagesize:5
            },
            //总数居条数
            total:0,
            columns: [
              {
                label: '分类名称',
                prop: 'cat_name',
                width: '400px',
              },
              {
                label: '是否有效',
                //表示,当前列为模板列
                type:'template',
                //表示当前这一列使用模板
                template:'isok'
              },
              {
                label: '排序',
                //表示,当前列为模板列
                type:'template',
                //表示当前这一列使用模板
                template:'order'
              },
              {
                label: '操作',
                //表示,当前列为模板列
                type:'template',
                //表示当前这一列使用模板
                template:'opt'
              }
            ],
            //添加分类对话框
            addCateDialogVisible:false,
            //添加用的的数据表单
            addCateForm:{
              cat_name:'',
              cat_pid:0,
              cat_level:0
            },
            //表单验证
            addCateRules:{
              cat_name:[
                { required: true, message: '请输入分类名称', trigger: 'blur' }
              ]
            },
            //父级分类的数据
            parentCateList:[],
            //配置对象
            cascaderProps:{
              value:'cat_id',
              label:'cat_name',
              children:'children'
            },
            //级联数组对象
            selectKeys:[]
          }
      },
      methods:{
        async  getCateList(){
         const {data:res} = await this.$http.get("categories",{params:this.queryInfo})
          if(res.meta.status !== 200){
            this.$message.error("获取数据列表失败")
          }
          this.catelist = res.data.result
          this.total = res.data.total
          // console.log(res.data)
        },
        //监听pageSize改变
        handleSizeChange(newSize){
          this.queryInfo.pagesize = newSize
          this.getCateList()
        },
        //监听pageNum改变
        handleCurrentChange(newPage){
          this.queryInfo.pagenum = newPage
          this.getCateList()
        },
        //点击按钮添加分类的对话框
        showAddCateDialog(){
          //获取父级分类的数据列表
          this.getParentCateList()
          this.addCateDialogVisible= true
        },
        //获取父级分类的数据列表
        async getParentCateList(){
          const {data:res} = await this.$http.get("categories",{params:{type:2}})
          if(res.meta.status !== 200){
            return this.$message.error("获取数据失败！！！")
          }
          // console.log(res.data)
          this.parentCateList = res.data
        },
        //选择项变化的触发
        parentCateChange(){
          console.log(this.selectKeys)
          if(this.selectKeys.length >0){
            this.addCateForm.cat_pid =this.selectKeys[this.selectKeys.length-1]
            //为当前的等级赋值
            this.addCateForm.cat_level = this.selectKeys.length
            return
          }else{
            this.addCateForm.cat_pid =0
            //为当前的等级赋值
            this.addCateForm.cat_level = 0
            return
          }
        },
        addCate(){
          // console.log(this.addCateForm)
          this.$refs.addCateRef.validate(async (valid)=>{
            // console.log(valid)
            const {data:res} = await this.$http.post("categories",this.addCateForm)
            if(res.meta.status !== 201){
              return this.$message.error("添加分类失败！！！")
            }
            // console.log(res.data)
            this.$message.success("添加分类成功！！！")
            this.getCateList()
            this.addCateDialogVisible = false
          })

        },
        //监听对话框的清空事件
        addCateDialogClose(){
          this.$refs.addCateRef.resetFields()
          this.selectKeys=[]
          this.addCateForm.cat_level =0
          this.addCateForm.cat_pid = 0
        }
      },
      created() {
        this.getCateList()
      },
    }
</script>

<style scoped>
.treeTable{
  margin-left: 15px;
}
  .el-cascader{
    width: 100%;
  }
</style>
