<template>
    <div>
      <!--面包屑导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品添加</el-breadcrumb-item>
      </el-breadcrumb>
<!--      卡片视图-->
      <el-card>
<!--        提示区域-->
          <el-alert
              title="添加商品信息"
              type="warning"
              :closable="false"
              center
              show-icon>
          </el-alert>
<!--        步骤条-->
        <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
<!--        tab区域-->
        <el-form :model="addForm"
                 :rules="addFormRules"
                 ref="addFormRef"
                 label-position="top"
                 label-width="100px">
          <el-tabs v-model="activeIndex"
                   :tab-position="'left'"
                   @tab-click="tabClicked"
                   :before-leave="beforeTabLeave">
            <el-tab-pane label="基本信息" name="0">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price" type="number">
                <el-input v-model="addForm.goods_price"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight" type="number">
                <el-input v-model="addForm.goods_weight"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number" type="number">
                <el-input v-model="addForm.goods_number"></el-input>
              </el-form-item>
              <el-form-item label="商品分类" prop="goods_cat">
                <el-cascader
                            expand-trigger="hover"
                            :options="catelist"
                            :props="cateProps"
                            v-model="addForm.goods_cat"
                            @change="handleChange">
                </el-cascader>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name="1">
<!--              渲染表单的item项-->
              <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
<!--                复选框组-->
                <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox :label="item1"
                               v-for="(item1,i) in item.attr_vals"
                               border
                               :key="i"></el-checkbox>
                </el-checkbox-group>

              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="2">
              <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                <el-input v-model="item.attr_vals">
                </el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="3">
              <!--图片要上传的api地址-->
              <el-upload
                        :action="uploadUrl"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :headers="headerObj"
                        :on-success="handleSuccess"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="4">
<!--              富文本编辑器组件-->
              <quill-editor v-model="addForm.goods_introduce">
              </quill-editor>
<!--              添加商品的按钮-->
              <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </el-card>
<!--      预览图片对话框-->
          <el-dialog
                title="预览图片"
                :visible.sync="previewVisible"
                width="50%"
                class="previewImg"
                >
            <img :src="previewPath" alt="">
          </el-dialog>
    </div>
</template>

<script>
  import _ from "lodash"
    export default {
        name: "add",
      data(){
          return{
            activeIndex:'0',
            //添加表单
            addForm:{
              goods_name:'',
              goods_price:0,
              goods_weight:0,
              goods_number:0,
              //商品所属的分类数组
              goods_cat:[],
              //图片的数组
              pics:[],
              //商品的详情描述
              goods_introduce:'',
              attrs:[]
            },
            //添加表单验证
            addFormRules:{
              goods_name:[
                { required: true, message: '请输入商品名称', trigger: 'blur' }
              ],
              goods_price:[
                { required: true, message: '请输入商品价格', trigger: 'blur' }
              ],
              goods_weight:[
                { required: true, message: '请输入商品重量', trigger: 'blur' }
              ],
              goods_number:[
                { required: true, message: '请输入商品数量', trigger: 'blur' }
              ],
              goods_cat:[
                { required: true, message: '请选择商品分类', trigger: 'blur' }
              ],
            },
            //商品分类列表
            catelist:[],
            //
            cateProps:{
              label:'cat_name',
              value:'cat_id',
              children:'children'
            },
            //动态参数列表
            manyTableData:[],
            //静态属性列表
            onlyTableData:[],
            //上传图片地址
            uploadUrl:'http://127.0.0.1:8888/api/private/v1/upload',
            //图片上传文件头
            headerObj:{
              Authorization:window.sessionStorage.getItem("token")
            },
            //预览图片
            previewPath:'',
            previewVisible:false,
          }
      },
      computed:{
          cateId(){
            if(this.addForm.goods_cat.length === 3){
              return this.addForm.goods_cat[2]
            }
            return null
          }
      },
      methods:{
          //获取所有商品的数据分类请求
          async getCateList(){
            const {data:res} = await this.$http.get("categories")
            if(res.meta.status !== 200){
              return this.$message.error("获取商品分类数据失败！！！")
            }
            this.catelist = res.data
            console.log(this.catelist)
          },
        //级联选择器选中项变化
        handleChange(){
            console.log(this.addForm.goods_cat)
          if(this.addForm.goods_cat.length !==3){
            this.addForm.goods_cat = []
          }
        },
        //
        beforeTabLeave(activeName,oldActiveName){
          //   console.log('即将离开的标签页名字'+oldActiveName)
          //   console.log('即将进入的标签页名字'+activeName)
          // return false
          if( oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
            this.$message.warning('请先选择商品分类！！！')
            return false
          }
        },
        //
        async tabClicked(){
            // console.log(this.activeIndex)
          //证明访问的是动态参数面板
          if(this.activeIndex === '1'){
            // console.log('动态参数面板')
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,
              {params:{sel:'many'}})

            if(res.meta.status !== 200){
              return this.$message.error("获取动态参数失败！！！")
            }
          console.log(res.data)
            res.data.forEach((item,index)=>{
              item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
            })
            this.manyTableData = res.data
          }else if(this.activeIndex === '2'){
            // console.log('动态参数面板')
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,
              {params:{sel:'only'}})
            if(res.meta.status !== 200){
              return this.$message.error("获取静态属性失败！！！")
            }
          console.log(res.data)
            this.onlyTableData = res.data
          }
        },
        //图片预览效果
        handlePreview(file){
            console.log(file)
          this.previewPath = file.response.data.url
          this.previewVisible = true
        },
        //删除图片
        handleRemove(file, fileList){
            console.log(file)
          const filePath = file.response.data.tmp_path
          //获取将要删除的图片路径
          const i = this.addForm.pics.findIndex(x =>
            x.pic === filePath
          )
          //从pics中找到图片的索引值
          this.addForm.pics.splice(i,1)
          //调用数组中的splice
          console.log(this.addForm)
        },
        //图片上传
        handleSuccess(response, file, fileList){
            console.log(response)
          //拼接图像
          const picInfo = {pic:response.data.tmp_path}
          //push 到pics[]数组中
          this.addForm.pics.push(picInfo)
          console.log(this.addForm)
        },
        //添加商品
        add(){
            // console.log(this.addForm)
          this.$refs.addFormRef.validate(async (valid)=>{
            if(!valid){
              return this.$message.warning("请填写必要的表单项！！！")
            }
            //执行添加的逻辑
            //lodash cloneDeep(obj)
            const form = _.cloneDeep(this.addForm)
            form.goods_cat = form.goods_cat.join(',')
            console.log(form)
            //处理动态参数
            this.manyTableData.forEach((item,index)=>{
              const newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals.join(' ')}
              this.addForm.attrs.push(newInfo)
            })
            //处理静态属性
            this.onlyTableData.forEach((item,index)=>{
              const newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals}
              this.addForm.attrs.push(newInfo)
            })
            form.attrs = this.addForm.attrs
            //发起请求，添加商品
            //商品的名称，必须是唯一的
            const {data:res} = await this.$http.post('goods',form)
            if(res.meta.status !== 201){
              return this.$message.error("添加商品失败！！！")
            }
            this.$message.success("添加商品成功！！！")
            this.$router.push('/goods')
          })
        },
      },
      created() {
          this.getCateList()
      }
    }
</script>

<style scoped>
.el-checkbox{
  margin: 0 10px 0 0 !important;
}
  .previewImg{
    width: 100%;
  }
  .btnAdd{
    margin-top: 15px;
  }
</style>
