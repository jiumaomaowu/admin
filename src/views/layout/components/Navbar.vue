<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">
      <error-log class="errLog-container right-menu-item"></error-log>
      <lang-select class="international right-menu-item"></lang-select>
      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="'/api/'+this.avatar+'?imageView2/1/w/80/h/80'"  v-if='this.avatar' >   
          <img class="user-avatar" :src="'/api/'+this.avat+'?imageView2/1/w/80/h/80'" v-else>
          <span>{{this.username}}</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/dashboard">
            <el-dropdown-item>
              {{$t('navbar.dashboard')}}
            </el-dropdown-item>
          </router-link>
          <router-link to="/personal">
            <el-dropdown-item>
              {{$t('navbar.personal')}}
              
            </el-dropdown-item>
          </router-link>
      
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/views/Breadcrumb'
import Hamburger from '@/views/Hamburger'
import ErrorLog from '@/views/ErrorLog'
import LangSelect from '@/views/LangSelect'
import store from '@/store'
import { getToken } from '@/utils/auth.js';
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,

    LangSelect,

  },
  data(){
    return {
      username:getToken(),
      avat:this.getAvatar()
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar'
    ])
  },
  created(){
    
  },
  mounted() {
    this.loginname()
  },
  methods: {
    loginname(){
      // console.log(this.$store.getters.token)
      this.username = this.$store.getters.token
    },
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    getAvatar(){
      let Avatar = JSON.parse(window.localStorage.getItem('avatar'))
      return Avatar 
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
     
      .avatar-wrapper {
         display: flex;
        align-items: center;
        cursor: pointer;
        // margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          margin-right: 8px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 21px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
