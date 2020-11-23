<template>
    <div>
      <!--面包屑导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>参数列表</el-breadcrumb-item>
      </el-breadcrumb>
<!--      卡片视图区域-->
      <el-card >
            <el-alert
                :closable="false"
                title="注意！只允许为第三级分类设置参数！！！"
                show-icon
                type="warning">
            </el-alert>
<!--        选择商品分类区域-->
        <el-row class="cat_opt">
          <el-col>
            <span>选择商品分类:</span>
<!--            选择商品分类的级联选择框-->
            <el-cascader
                      expand-trigger="hover"
                      :options="catelist"
                      :props="cateProps"
                      v-model="selectedCateKeys"
                      @change="handleChange">
            </el-cascader>
          </el-col>
        </el-row>
<!--tab页签区域-->
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
<!--          添加动态参数的面板-->
          <el-tab-pane label="动态参数" name="many">
            <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="addDialogVisible=true">添加参数</el-button>
<!--            动态参数表格-->
            <el-table :data="manyTableData" border stripe>
<!--              展开行-->
              <el-table-column type="expand"></el-table-column>
<!--              索引列-->
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column  label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column  label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                  <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
<!--          添加静态属性的面板-->
          <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="addDialogVisible=true">添加属性</el-button>
            <!--            静态属性表格-->
            <el-table :data="onlyTableData" border stripe>
              <!--              展开行-->
              <el-table-column type="expand"></el-table-column>
              <!--              索引列-->
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column  label="属性名称" prop="attr_name"></el-table-column>
              <el-table-column  label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                  <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>
<!--      添加参数的对话框-->
      <el-dialog
              :title="'添加'+titleText"
              :visible.sync="addDialogVisible"
              width="50%"
              @close="addDialogClosed"
              >
<!--              添加参数的对话框-->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" >
                <el-form-item :label="titleText" prop="attr_name ">
                  <el-input v-model="addForm.attr_name "></el-input>
                </el-form-item>
            </el-form>
              <span slot="footer" class="dialog-footer">
                  <el-button @click="addDialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="addParams">确 定</el-button>
              </span>
      </el-dialog>
      <!--      修改参数的对话框-->
      <el-dialog
        :title="'修改'+titleText"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
        <!--              添加参数的对话框-->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" >
          <el-form-item :label="titleText" prop="attr_name ">
            <el-input v-model="editForm.attr_name "></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                  <el-button @click="editDialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="editParams">确 定</el-button>
              </span>
      </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "params",
      data(){
          return{
            //商品分类列表
            catelist:[],
            //级联选择框配置对象
            cateProps:{
              value:'cat_id',
              label:'cat_name',
              children:'children'
            },
            //级联选择框双向绑定
            selectedCateKeys:[],
            //被激活的页签名称
            activeName:'many',
            //动态参数的数据
            manyTableData:[],
            //静态参数的数据
            onlyTableData:[],
            //控制添加对话框的显示与隐藏
            addDialogVisible:false,
            //添加表单的数据对象
            addForm:{
              attr_name:''
            },
            //添加表单验证的数据对象
            addFormRules:{
              attr_name:[
                { required: true, message: '请输入分类名称', trigger: 'blur' }
              ]
            },
            //控制修改动态的对话框
            editDialogVisible:false,
            //修改的表单数据对象
            editForm:{
              attr_name:''
            },
            //验证的表单数据对象
            editFormRules:{
              attr_name:[
                { required: true, message: '请输入分类名称', trigger: 'blur' }
              ]
            }
          }
      },
      computed:{
          //如果按钮需要被禁用,则返回true,否则返回false
        isBtnDisable(){
          if(this.selectedCateKeys.length !==3){
            return true;
          }else{
            return false
          }
        },
        //这是当前选中的
        cateId(){
          if(this.selectedCateKeys.length ===3){
            return this.selectedCateKeys[2]
          }else{
            return null
          }
        },
        //动态计算标题的文本
        titleText(){
          if(this.activeName === 'many'){
            return '动态参数'
          }else{
            return '静态属性'
          }
        }
      },
      methods:{
          //获取所有的商品分类列表
        async getCateList(){
          const {data:res} = await this.$http.get("categories")
          if(res.meta.status !== 200){
            return this.$message.error("获取所有的商品分类列表失败！！！")
          }
          this.$message.success("获取所有的商品分类成功~")
          this.catelist = res.data
          console.log(this.catelist)
        },
        //级联选择框选择
        handleChange(){
          this.getParmsData()

        },
        //tab页签点击事件
        handleTabClick(){
          this.getParmsData()
          console.log(this.activeName)
        },
        //获取参数的列表数据
        async getParmsData(){
          // console.log(this.selectedCateKeys)
          //证明选择的不是三级分类
          if(this.selectedCateKeys.length !==3){
            this.selectedCateKeys =[]
            return
          }
          // console.log(this.selectedCateKeys)
          //根据所选参数的id,选择对应的参数
          const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,
          {params:{sel:this.activeName}})
          if(res.meta.status !== 200){
            return this.$message.error("获取级联列表失败！！！")
          }
            // console.log(res.data)
          //获取的数据需要做一个判断
          if(this.activeName ==="many"){
            this.manyTableData = res.data
          }else{
            this.onlyTableData = res.data
          }
        },
        //监听对话框的关闭事件
        addDialogClosed(){
          this.$refs.addFormRef.resetFields()
        },
        //添加参数
        addParams(){
          this.$refs.addFormRef.validate(async (valid)=>{
            if(!valid){
              return
            }
            const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,
              {
                attr_name:this.addForm.attr_name,
                attr_sel:this.activeName
              }
              )
            if(res.meta.status !== 201){
              return this.$message.error("添加参数失败！！！")
            }
            this.$message.success("添加参数成功！！")
            this.addDialogVisible = false
            this.getParmsData()
          })
        },
        //修改参数内容
        async showEditDialog(attr_id){
          this.editDialogVisible = true
          //查询当前参数的名称
          const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,
            {params:{attr_sel:this.activeName}})
          if(res.meta.status !== 200){
            return this.$message.error("获取参数信息失败！！！")
          }
          this.editForm = res.data
        },
        //监听对话框的关闭事件
        editDialogClosed(){
          this.$refs.editFormRef.resetFields()
        },
        //修改对话框的关闭事件
        editParams(){
          this.$refs.editFormRef.validate(async (valid)=>{
            if(!valid){
              return
            }
            const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
              {
                attr_name:this.editForm.attr_name,
                attr_sel:this.activeName
              })
            if(res.meta.status !== 200){
              return this.$message.error("修改参数信息失败！！！")
            }
            this.$message.success("修改参数信息成功！！")
            this.getParmsData()
            this.editDialogVisible = false
          })
        },
        //删除参数
        async removeParams(attr_id){
          const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err=>err)
          //用户没有删除此列表
          if(confirmResult !== 'confirm'){
            return this.$message.info('已取消删除此参数')
          }
          const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
          if(res.meta.status !== 200){
            return this.$message.error("删除参数失败！！！")
          }
          this.$message.success("删除参数成功！！！")
          this.getParmsData()
        }
      },
      created() {
          this.getCateList()
      }
    }
</script>

<style scoped>
.cat_opt{
  margin: 15px 0;
}
</style>
