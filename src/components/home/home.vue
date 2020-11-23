<template>
    <div>
      <el-container class="home-container">
        <!--头部区域-->
        <el-header>
          <div>
            <img src="../../assets/one.piece.jpg" height="55" width="55"/>
            <span>系统管理后台模板：Welcome_Smith.Z.H.Bralant</span>
          </div>
          <el-button type="primary" @click="logout">退出</el-button>
        </el-header>
        <!--头部区域-->

        <!--主体区域-->
        <el-container>
          <!--侧边栏-->
          <el-aside :width="isCollapse? '64px':'200px'">
            <div class="toggle-button" @click="toggle">|||</div>
            <!--侧边栏菜单区域-->
            <el-menu
              :unique-opened="true"
              background-color="#8BEAE8"
              text-color="#3B397E"
              active-text-color="#C40A50"
              :collapse="isCollapse"
              :collapse-transition="false"
              :default-active="activePath"
              router>

              <!--一级菜单-->
              <el-submenu :index="item.id + ''" v-for="(item,index) in menulist" :key="item.id">
                <!--一级菜单模板-->
                <template slot="title">
                  <i :class="iconsObj[item.id]"></i>
                  <span>{{item.authName}}</span>
                </template>
                <!--一级菜单模板-->
                <!--二级菜单模板-->
                  <el-menu-item
                    :index="'/'+subItem.path" v-for="(subItem,subIndex) in item.children"
                    @click="saveActive('/'+subItem.path)"
                    :key="subItem.id">
                    <template slot="title">
                      <i class="el-icon-menu"></i>
                      <span>{{subItem.authName}}</span>
                    </template>
                  </el-menu-item>
                <!--二级菜单模板-->
              </el-submenu>
              <!--一级菜单-->

            </el-menu>
            <!--侧边栏菜单区域-->
          </el-aside>
          <!--侧边栏-->

          <!--右侧部分-->
          <el-main>
            <router-view></router-view>
          </el-main>
          <!--右侧部分-->
        </el-container>
        <!--主体区域-->

      </el-container>
    </div>

</template>

<script>
    export default {
        name: "home",
      data(){
          return{
          //  左侧
            menulist:[],
            iconsObj:{
              '125':'iconfont icon-users',
              '103':'iconfont icon-danju',
              '101':'iconfont icon-baobiao',
              '102':'iconfont icon-tijikongjian',
              '145':'iconfont icon-shangpin'

            },
            //用户折叠
            isCollapse:false,
            //被激活的连接
            activePath:''
          }
      },
      methods:{
        logout(){
          window.sessionStorage.clear()
          this.$router.push({path:'/login'})
        },
        async getMenuList(){
          const res = await this.$http.get('menus')
          // console.log(res.data.data)
          if(res.data.meta.status !=200){
            this.$message.error(res.data.meta.msg);
          }else{
            // this.$message({
            //   message: res.data.meta.msg,
            //   type: 'success'
            // });
            this.menulist = res.data.data
          }
        },
        //保存连接的激活状态
        saveActive(activePath){
          window.sessionStorage.setItem("activePath",activePath)
          this.activePath = activePath

        },
        //点击按钮切换菜单的展开和折叠
        toggle(){
          this.isCollapse = !this.isCollapse
        }
      },
      created() {
          this.getMenuList()
          this.activePath = window.sessionStorage.getItem("activePath")
      }
    }
</script>

<style scoped>
  .home-container {
    height: 100vh;
  }
  .el-header {
    background-color: #29485A;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
  }
  .el-header div {
    display: flex;
    align-items: center;
  }
  span {
    margin-left: 15px;
  }


  .el-aside {
    background-color: #8BEAE8;
  }
  .el-menu {
    border-right: none;
  }


  .el-main {
    background-color: #eaedf1;
  }

  .iconfont {
    margin-right: 10px;
  }

  .toggle-button {
    background-color: #EAEDF1;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
