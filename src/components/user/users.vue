<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--      卡片视图区域-->
    <el-card>
      <!--搜索于添加区域-->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!--用户列表区域-->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!--              {{scope.row.id}}-->
            <el-switch v-model="scope.row.mg_state" @change="userChange(scope.row.id)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190px">
          <template slot-scope="scope">
            <!--              修改-->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!--              删除-->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            <!--              分配权限-->
            <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20, 25]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

<!--      添加用户-->
      <el-dialog
                title="添加用户"
                :visible.sync="addDialogVisible"
                width="50%"
                @close="addDialogClose"
                >
<!--        内容主题区域-->
          <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>
<!--        底部区域-->
                <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
                </span>
      </el-dialog>

<!--      修改用户的对话框-->
      <el-dialog
                title="修改用户的对话框"
                :visible.sync="editDialogVisible"
                width="30%"
                @close="closeEditDialogVisible"
                >
<!--        修改表单主体内容-->
                <el-form :model="editForm" ref="editFormRef" :rules="editFormRules"  label-width="70px">
                  <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                  </el-form-item>
                  <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
                </span>
      </el-dialog>
<!--分配角色对话框-->
      <el-dialog
                title="提示"
                :visible.sync="setRoleDialogVisible"
                width="30%"
                @close="setRoleCloseDialogVisible"
                >
                <div>
                  <p>当前的用户：{{userInfo.username}}</p>
                  <p>当前的角色：{{userInfo.role_name}}</p>
                  <p>分配新的角色：
                    <el-select v-model="selectRoleId" placeholder="请选择">
                      <el-option
                                v-for="item in roleslist"
                                :key="item.id"
                                :label="item.roleName"
                                :value="item.id">
                      </el-option>
                    </el-select>
                  </p>
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
                </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "users",
    data() {
      //验证邮箱
      var checkEmail =(rule, value, callback)=>{
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

        if (regEmail.test(value)) {
          // 合法的邮箱
          return callback()
        }

        callback(new Error('请输入合法的邮箱'))
      }
      //验证手机号
      var checkMobile =(rule, value, callback)=>{
        // 验证手机号的正则表达式
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

        if (regMobile.test(value)) {
          return callback()
        }

        callback(new Error('请输入合法的手机号'))
      }
      return {
        queryInfo: {
          query: '',
          //当前的页数
          pagenum: 1,
          //当前每页显示多少条数据
          pagesize: 4
        },
        userlist: [],
        total: 0,
        //控制对话框
        addDialogVisible:false,
        //添加表单数据
        addForm:{
          username:'',
          password:'',
          email:'',
          mobile:''

        },
        addFormRules:{
          username:[
            { required: true, message: '请输入登录名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
          email:[
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            {validator: checkEmail,trigger: 'blur' }
          ],
          mobile:[
            { required: true, message: '请输入手机号', trigger: 'blur' },
            {validator: checkMobile,trigger: 'blur' }
          ]
        },
        //修改用户的对话框
        editDialogVisible:false,
      //  查询到的用户信息
        editForm:{

        },
        editFormRules:{
          email:[
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            {validator: checkEmail,trigger: 'blur' }
          ],
          mobile:[
            { required: true, message: '请输入手机号', trigger: 'blur' },
            {validator: checkMobile,trigger: 'blur' }
          ]
        },
        //控制分配角色
        setRoleDialogVisible:false,
        //用户的信息
        userInfo:{},

        roleslist:[],
        //已选中的值
        selectRoleId:''
      }
    },
    methods: {
      async getUserList() {
        const res = await this.$http.get("users", {params: this.queryInfo})
        if (res.data.meta.status != 200) {
          this.$message.error(res.data.meta.msg);
        } else {
          // console.log(res.data.data)
          this.userlist = res.data.data.users
          this.total = res.data.data.total
        }
      },
      //监听pageSize改变的事件
      handleSizeChange(newSize) {
        console.log(newSize)
        this.queryInfo.pagesize = newSize
        this.getUserList()
      },
      //监听页码值改变的属性
      handleCurrentChange(newPage) {
        console.log(newPage)
        this.queryInfo.pagenum = newPage
        this.getUserList()
      },
      //监听开关状态的改变
      async userChange(userInfo) {
        console.log(userInfo)
        const res = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
        console.log(res.data)
        if (res.data.meta.status !== 200) {
          userInfo.mg_state = !userInfo.mg_state
          this.$message.error('更新失败！！！');
        } else {
          this.$message({
            message: '恭喜你，更新成功',
            type: 'success'
          });
        }
      },
      //重置表单
      addDialogClose(){
        this.$refs.addFormRef.resetFields()
      },
      //点击按钮，添加用户
      addUser(){
        this.$refs.addFormRef.validate(async (valid)=>{
          if(!valid) return;
        //  发起添加用户的网络请求
          const res = await this.$http.post('users',this.addForm)
          this.addDialogVisible = false
          this.getUserList()
        })
      },
      //展示编辑用户的对话框
      async showEditDialog(id){
        this.editDialogVisible=true
        // console.log(id)
        const res = await this.$http.get('users/'+id)
        if(res.data.meta.status !== 200){
          this.$message.error('查询用户信息失败！！！');
        }else{
          this.editForm = res.data.data
        }
      },
      //关闭修改的表单
      closeEditDialogVisible(){
        this.$refs.editFormRef.resetFields()
      },
      //修改用户
      editUserInfo(){
        this.$refs.editFormRef.validate(async (valid)=>{
          console.log(valid)
          if(!valid) return;
        //  发起修改用户的数据请求
          const res = await this.$http.put("users/"+this.editForm.id,
            {
              email:this.editForm.email,
              mobile:this.editForm.mobile
            })
          if(res.data.meta.status !== 200){
            this.$message.error('用户更新失败！！！');
          }else{
            this.editDialogVisible = false
            this.getUserList()
            this.$message.success("更新用户信息成功！！！")
          }
        })
      },
    //  删除用户
      async removeUserById(id){
        const res = await  this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>{
          err
        })
        console.log(res)
        if(res !== "confirm"){
          return this.$message.warning("已经取消删除")
          this.getUserList()
        }
        const data = await this.$http.delete('users/'+id)
        this.$message.success("删除用户成功！！！")
        this.getUserList()
      },
      //修改用户
      async setRole(userInfo){
        this.userInfo = userInfo
        //获取角色列表
        const res = await this.$http.get('roles')
        if (res.data.meta.status !== 200) {
          this.$message.error("获取角色列表失败！！！")
        }
        this.roleslist = res.data.data
        this.setRoleDialogVisible= true
      },
      //点击按钮，分配角色
      async saveRoleInfo(){
        if(!this.selectRoleId){
          this.$message.info("请选择需要分配的角色！！！")
        }
        const res = await this.$http.put(
          `users/${this.userInfo.id}/role`,
          {
            rid: this.selectRoleId
          }
        )
        console.log(res.data)
        this.getUserList()
        this.setRoleDialogVisible = false
      },
      setRoleCloseDialogVisible(){
        this.selectRoleId = ''
        this.userInfo ={}
      }
    },
    created() {
      this.getUserList()
    }
  }
</script>

<style scoped>

</style>
