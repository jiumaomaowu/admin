<<template>
   <el-row class="container">
     <!-- header -->
      <el-col :span="24" class="header">
			<el-col :span="10" class="logo logo-width" >
				{{sysName}}
			</el-col>

			<el-col :span="4" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner"><img :src="this.sysUserAvatar" /> {{title}}</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>我的消息</el-dropdown-item>
						<el-dropdown-item>设置</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
      <!-- navmenu -->
      <el-col :span="24" class="main">
          <aside >
            <div class="tools" @click.prevent="collapse">
              <i class="el-icon-plus"></i>
            </div>


            <!-- <el-menu default-active="2" class="el-menu-vertical-demo" router  @open="handleOpen" @close="handleClose"  :collapse="collapsed">
            
              <template v-for="(item,index) in routes" v-if="!item.hidden" >
                
                  <el-submenu :index="index+''"  :key="item.id" v-if="item.children.length>0">
                    <template slot="title">
                      <i :class="item.icon"></i>
                      <span>{{item.name}}{{item.children.length}}11</span>
                    </template>
                    <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>

                  </el-submenu>
              </template>
              
            </el-menu> -->

            <!-- <ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
              <li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item">
                <template v-if="!item.leaf">
                  <div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
                  <ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
                    <li v-for="child in item.children" v-if="!child.hidden" :key="child.path" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">{{child.name}}</li>
                  </ul>
                </template>
                <template v-else>
                  <li class="el-submenu">
                    <div class="el-submenu__title el-menu-item" style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" :class="$route.path==item.children[0].path?'is-active':''" @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i></div>
                  </li>
                </template>
              </li>
            </ul> -->
          </aside>



          <section class="content-container">
            <div class="grid-content bg-purple-light">
              <el-col :span="24" class="breadcrumb-container">
                <strong class="title">111{{$route.name}}</strong>






                <el-breadcrumb separator="/" class="breadcrumb-inner">
                  <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                    {{ item.name }}
                  </el-breadcrumb-item>
                </el-breadcrumb>
              </el-col>
              <el-col :span="24" class="content-wrapper">
                <transition name="fade" mode="out-in">
                  <router-view></router-view>
                </transition>
                 <el-button @click.native.prevent="handleReset2">重置</el-button>
              </el-col>
            </div>
          </section>
        </el-col>
  </el-row>
</template>
<script>
  import store from '@/store'
  export default {
    name:'home',
    data () {
      return {
       sysName:'后台管理系统(测试环境)',
				collapsed:false,
				sysUserName: '',
        sysUserAvatar: '',
        router:true,
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				}
      }
    },
    methods: {
      handleOpen:function(key, keyPath) {
        // console.log(key, keyPath)
      },
      handleClose(key, keyPath) {
        // console.log(key, keyPath)
      },
      handleReset2(){
        let user=[
          {
              path: '/',
              name: '数据管理',
              id:0,
              icon:'el-icon-message',
              component: 'home',
              meta: { roles: ['admin1'] },
              children: [
                  { path: '/hospital', component: 'hospital', name: '医院管理', hidden: false ,meta: { roles: ['admin1'] }, },
                  { path: '/applicant', component: 'applicant', name: '申办方管理', hidden: false },
                  { path: '/protocol_template', component: 'protocol_template', name: '模板管理', hidden: false },
                  { path: '/ethic_meeting_calendar', component: 'ethic_meeting_calendar', name: '上会日历', hidden: false }
              ]
            },
        ]
                this.$router.addRoutes(user)
      },
      collapse() {
        this.collapsed = !this.collapsed
      },
      logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
          // sessionStorage.removeItem('user');
           this.$store.dispatch('LogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
					_this.$router.push('/login');
				}).catch(() => {
        });
			}
    },
    mounted() {
			var user = sessionStorage.getItem('user');
			if (user) {
				user = JSON.parse(user);
				this.sysUserName = user || '';

      }
    },
    computed: {
        routes() {
         
         return   this.$router.options.routes
        },
        title() {
          console.log(store.getters.token)
         return   store.getters.token
        }
    },
     mounted() {
          // console.log(store.getters.token)

      }


  }
</script>






<style scoped lang="scss">
.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;}
    .header {
			height: 60px;
			line-height: 60px;
    background: #545c64;
     background:#409EFF;
    box-sizing: border-box;
    padding-left:20px ;

      color:#fff;
      }
      .userinfo {
        text-align: right;
        float:right;
        padding-right: 20px;

        .el-dropdown{
          color:#fff ;
          cursor: pointer;
        }
      }
.tools{
				margin: 0 auto;
				width:14px;
				height: 30px;
				line-height: 30px;
        cursor: pointer;
        margin-top: 10px;
        color: #fff;
			}
  .main {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      position: absolute;
      top:60px;
      bottom: 0px;
      overflow: hidden;
    }

    aside {
      min-width: 50px;
      // background: #333744;
      // background-color: #545c64;
      background-color:  #eef1f6;
      &::-webkit-scrollbar {
        display: none;
      }

      &.showSidebar {
        overflow-x: hidden;
        overflow-y: auto;
      }

      .el-menu {
        height: 100%; /*写给不支持calc()的浏览器*/
        height: -moz-calc(100% - 80px);
        height: -webkit-calc(100% - 80px);
        height: calc(100% - 80px);
        border-radius: 0px;
        // background-color: #333744;
        //  background-color: #545c64;
         background-color:  #eef1f6;
      }

      .el-submenu .el-menu-item {
        min-width: 60px;
      }
      .el-menu {
        width: 180px;
      }
      .el-menu--collapse {
        width: 60px;
      }

      .el-menu .el-menu-item, .el-submenu .el-submenu__title {
        height: 46px;
        line-height: 46px;
      }

      .el-menu-item:hover, .el-submenu .el-menu-item:hover, .el-submenu__title:hover {
        // background-color: #7ed2df;
      }
    }

    .menu-toggle {
      background: #4A5064;
      text-align: center;
      color: white;
      height: 26px;
      line-height: 30px;
    }

    .content-container {
      background: #fff;
      flex: 1;
      overflow-y: auto;
      padding: 10px;
      padding-bottom: 1px;

      .content-wrapper {
        background-color: #fff;
        box-sizing: border-box;
        margin-top: 15px;
      }
    }
    .content-container {
				// background: #f1f2f7;
				flex:1;
				// position: absolute;
				// right: 0px;
				// top: 0px;
				// bottom: 0px;
				// left: 230px;
				overflow-y: scroll;
				padding: 20px;
				.breadcrumb-container {
					//margin-bottom: 15px;
					.title {
						width: 200px;
						float: left;
						color: #475669;
					}
					.breadcrumb-inner {
						float: right;
					}
				}
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
			}

</style>


