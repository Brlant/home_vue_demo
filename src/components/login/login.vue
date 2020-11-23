<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../../assets/00004.jpg" height="240" width="320"/>
      </div>

      <!-- 登录表单区域 -->
      <el-form ref="loginFormRefs" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!--用户名-->
        <el-form-item prop="username" >
          <el-input placeholder="admin" v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!--用户名-->
        <!--密码-->
        <el-form-item prop="password">
          <el-input placehoder="123456" v-model="loginForm.password"  prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <!--密码-->
        <!--按钮区域-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
        <!--按钮区域-->
      </el-form>
    </div>
  </div>
</template>

<script>
    export default {
        name: "login",
      data(){
          return{
            loginForm:{
              username:'',
              password:''
            },
            loginFormRules:{
              username:[
                { required: true, message: '请输入登录名称', trigger: 'blur' },
                { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
              ],
              password:[
                { required: true, message: '请输入登录密码', trigger: 'blur' },
                { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
              ]
            }
          }
      },
      methods:{
        resetLoginForm(){
          this.$refs.loginFormRefs.resetFields()
        },
        login(){
          this.$refs.loginFormRefs.validate(async (valid)=>{
            if(!valid) return;
            const res = await this.$http.post('login',this.loginForm)
            console.log(res.data)
            //登录成功之后，把后台发给我的token保存到sessionStorage
            window.sessionStorage.setItem("token",res.data.data.token)
            this.$router.push({path:'/home'})
            if(res.data.meta.status !== 200){
              this.$message.error('登录失败！！！');
            }else{
              this.$message({
                message: '恭喜你，登录成功',
                type: 'success'
              });
            }
          })
        }
      }
    }
</script>

<style scoped>
  .login_container {
    background-color: #EAEAE8;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
  }

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }
</style>
