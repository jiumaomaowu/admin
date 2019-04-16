<template>
<div class="el-login">
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <h4></h4>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <!-- <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit3" >登录1</el-button> -->
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="logining">登录</el-button>
    </el-form-item>
  </el-form>
</div>
  
</template>

<script>
import { loginByUsername,loginBywx} from '../../api/api';
import { mapActions, mapGetters } from 'vuex';
import { getToken, setToken, removeToken } from '@/utils/auth'
// import router from './router/index'
import MenuUtils from '@/utils/MenuUtils'
import Hidden from '@/utils/hidden'
import store from '../../store'
  //import NProgress from 'nprogress'
   let  routers = []
  export default {
    data() {
      return {
        logining: false,
        logining2:false,
        ruleForm2: {
          account: '022030',
          checkPass: '0'
          // account: '022030',
          // checkPass: 'liuzhaoyu'
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };

    },
    computed: {
      ...mapGetters([
        'menuitems',
        'isLoadRoutes'
      ])
    },
    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      handleSubmit(ev) {
        // var _this = this;

        this.$refs.ruleForm2.validate((valid) => {

          if (valid) {
            //_this.$router.replace('/table');
            this.logining = true;
            //NProgress.start();
            var loginParams = { username: this.ruleForm2.account, password: this.ruleForm2.checkPass };

            loginByUsername(loginParams).then( (data) => {
              this.logining = false;
              //NProgress.done();
              let { message, code, user, userInfo, loginTime} = data;

              if (code !== 200) {
                this.$message({
                  message: message,
                  type: 'error'
                });
              } else {
                console.log(user)
                sessionStorage.setItem('user', JSON.stringify(user));
                
                store.commit('SET_TOKEN', data.data.token)
                this.addUserinfo(data.userInfo)
                this.setName(data.data.token)
                setToken(data.data.token)
                this.addMenu(user)
                this.setAvatar(data.userInfo.avatar)
                MenuUtils(routers,user)
               
                this.$router.options.routes = routers
                this.$router.addRoutes(routers)
                this.loadRoutes()
                this.$router.push({ path: '/dashboard' });
              }
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },





      handleSubmit3(){
        let loginParams={
          source:'wx'
        }
        loginBywx(loginParams).then(data => {
              console.log(data)
        })

      },
        ...mapActions([
        'addMenu',
        'addCount',
        'addUserinfo',
        'loadRoutes',
        'setName',
        'setAvatar'
      ])
    }
  }
</script>

<style lang="scss" scoped>
.el-login{
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: url(../../../static/images/login-bg.jpg) no-repeat;
    background-size: cover;
}   
// ssseeeeee
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>
