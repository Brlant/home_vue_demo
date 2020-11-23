<template>
    <div>
      <!--面包屑导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片视图-->
      <el-card>
        <el-row>
          <el-col >
            <el-button type="primary" >添加角色</el-button>
          </el-col>
        </el-row>
      </el-card>
      <!--角色列表区域-->
      <el-table :data="rolesList" border stripe>
        <!--展开列-->
        <el-table-column type="expand" >
          <templates slot-scope="scope">
            <el-row :class="['bdbottom',i1 === 0?'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id" >
<!--              一级权限-->
              <el-col :span="5">
                <el-tag closable @close="removeById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
<!--              二级权限-->
              <el-col :span="19">
                <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[i2 === 0?'':'bdtop','vcenter']" >
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
<!--                  三级权限-->
                  <el-col :span="18">
                    <el-row>
                      <el-tag  type="warning" v-for="(item3,i3) in item2.children" :key="item3.id" closable @close="removeById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
<!--            <pre>-->
<!--              {{scope.row}}-->
<!--            </pre>-->
          </templates>
        </el-table-column>
        <!--索引列-->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column  label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
<!--     展示权限对话框-->
      <el-dialog
                title="分配权限"
                :visible.sync="setRightDialogVisible"
                width="30%"
                @close="setRightDialogClose"
                >
                <el-tree :data="rightslist"
                         :props="treeProps"
                         show-checkbox
                         node-key="id"
                         ref="treeRef"
                         :default-checked-keys="defKeys"
                         default-expand-all>
                </el-tree>
                <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRight">确 定</el-button>
                </span>
      </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "roles",
      data(){
          return{
            rolesList:[],
            //分配权限对话框
            setRightDialogVisible:false,
            //获取所有权限的数据
            rightslist:[],
            //树形结构
            treeProps: {
              children: 'children',
              label: 'authName'
            },
            //默认选中的节点id值
            defKeys:[],
            roleId:''
          }
      },
      methods:{
        async getRosesList(){
          const res = await this.$http.get("roles")
          if (res.data.meta.status !== 200) {
            this.$message.error("获取权限列表失败！！！")
          } else {
            this.rolesList = res.data.data
            console.log(this.rolesList)
          }
        },
        //根据id删除
        async removeById(role,rightId){
          const res = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err=>err)
          if(res !== "confirm"){
            return this.$message.warning("取消了删除!!!")
          }
          const data = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
          if (data.data.meta.status !== 200) {
            this.$message.error("删除失败！！！")
          }
          // this.getRosesList()
          role.childre = data.data.data
        },
        //展示分配权限
         async showSetDialog(role){
          this.roleId = role.id
           //获取所有权限的数据
           const res = await this.$http.get("rights/tree")
           console.log(res.data)
           if (res.data.meta.status !== 200) {
             this.$message.error("获取权限数据失败！！！")
           }
           this.rightslist = res.data.data
           console.log(this.rightslist)
           //获取三级节点的id
           this.getLeafKeys(role,this.defKeys)
           this.setRightDialogVisible = true
        },
        //通过递归全部保存到三级权限的数组中
        getLeafKeys(node,arr){
          if(!node.children){
            return arr.push(node.id)
          }
          node.children.forEach(item=>{
            this.getLeafKeys(item,arr)
          })
        },
        //监听权限对话框
        setRightDialogClose(){
          this.defKeys =[]
        },
        //为角色分配权限
        async allotRight(){
          const keys = [
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
          ]
          console.log(keys)
          const keyStr = keys.join(',')
          const res = await this.$http.post("roles/${this.roleId}/rights",{rids:keyStr})
          if (res.data.meta.status !== 200) {
            this.$message.error("获取权限数据失败！！！")
          }
          this.$message.success("分配权限成功！！！")
          this.getRosesList()
          this.setRightDialogVisible = false;
        }
      },
      created() {
          this.getRosesList()
      }
    }
</script>

<style scoped>
  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #eee;
  }

  .bdbottom {
    border-bottom: 1px solid #eee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }

</style>
