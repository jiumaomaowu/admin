<template>
    <div class="content">
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img :src="'/api/'+this.avat" class="user-avator" alt="">
                        <div class="user-info-cont">
                            <div class="user-info-name">{{this.username}}</div>
                            <div>{{this.rolename}}</div>
                        </div>  
                    </div>
                    <div class="user-info-list">上次登录时间：<span>{{this.lastTime}}</span></div>
                    <div class="user-info-list">上次登录ip地址 ：<span>{{this.lastIplogin}}</span></div>
                </el-card>
                <el-card shadow="hover">
                    <div slot="header" class="clearfix">
                        <span>技术栈</span>
                    </div>
                    
                    <span class="demonstration">Vue</span>
                    <el-slider v-model="value1" :step="10"></el-slider>
                    <span class="demonstration">JavaScript(es6)</span>
                    <el-slider v-model="value2" :step="10"></el-slider>
                    <span class="demonstration">Css</span>
                    <el-slider v-model="value3" :step="10"></el-slider>
                    <span class="demonstration">node.js</span>
                    <el-slider v-model="value4" :step="10"></el-slider>
                    <span class="demonstration">php</span>
                    <el-slider v-model="value5" :step="10"></el-slider>
                    <span class="demonstration">mongodb</span>
                    <el-slider v-model="value6" :step="10"></el-slider>
                </el-card>
            </el-col>
            <el-col :span="16" v-loading="loading">
                <el-card shadow="hover" >
                    <!-- <schart ref="line" class="schart" canvasId="line" :data="data" type="line" :options="options2"></schart> -->
                     <line-chart :to-child ="toChildren" />  
                </el-card>
                 <!-- <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
                   
                </el-row> -->
            </el-col>
            <el-col :span="16" class="Todo">
               
                <el-card shadow="hover" style="height:340px;">
                    <div slot="header" class="clearfix">
                        <span>待办事项</span>
                        <el-button style="float: right; padding: 3px 0" type="text">添加</el-button>
                    </div>
                    <el-table :data="todoList" :show-header="false" height="280" style="width: 100%;font-size:14px;">
                        <el-table-column width="40">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.status"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <div class="todo-item" :class="{'todo-item-del': scope.row.status}">{{scope.row.title}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column width="60">
                            <template slot-scope="">
                                <i class="el-icon-edit"></i>
                                <i class="el-icon-delete"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            
        </el-row>
       
    </div>
</template>

<script>
    import Schart from 'vue-schart';
    // import bus from '../common/bus';
    import { mapGetters } from 'vuex';
    import { getToken } from '@/utils/auth.js';
    import LineChart from './components/LineChart'
    import { constants } from 'fs';
    import { getLogindata, getlastLogin} from '../../api/api';

    export default {
        name: 'dashboard',
        data() {
            return {
                username:getToken(),
                rolename:this.getRolename('role_name'),
                avat:this.getAvatar(),
                lastTime:'',
                lastIplogin:'',
                loading:true,
                value1: 70,
                value2: 60,
                value3: 80,
                value4: 68,
                value5: 62,
                value6: 60,
                toChildren:{},
                todoList: [{
                        title: '今天天气不错',
                        status: false,
                    },
                    {
                        title: '今天要完成工作',
                        status: false,
                    },
                    {
                        title: '今天要写100行代码',
                        status: false,
                    }, {
                        title: '今天努力工作',
                        status: false,
                    },
                    {
                        title: '今天要修复10个bug',
                        status: true,
                    }
                    
                ],
               
            }
        },
        computed: {
          ...mapGetters([
            'sidebar',
            'name',
            'avatar'
          ])
        }, 
        components: {
            Schart,
            LineChart
        },
        computed: {
            role() {
                return this.name === 'admin' ? '超级管理员' : '普通用户';
            }
        },
        created(){
            // this.handleListener();
            // this.changeDate();
            this.getlastLogindata()
            this.getchar()
        },
        activated(){
            this.handleListener();
        },
        deactivated(){
            window.removeEventListener('resize', this.renderChart);
            // bus.$off('collapse', this.handleBus);
        },
        methods: {
            getlastLogindata(){
                let param = {
                    username:getToken()
                }
                getlastLogin(param).then( (res)=>{
                   
                    this.lastTime = res.loginTime
                    this.lastIplogin = res.ip
                })
            },
            getchar(){
                getLogindata().then((res) => {
                    this.toChildren={
                        newVisitis:{
                           actualData: res.numsArray
                        },
                        data:res.dateArray
                    }
                    this.loading = false
                })
            },
            getAvatar(){
                let Avatar = JSON.parse(window.localStorage.getItem('avatar'))
                return Avatar 
            },
         
            getRolename(name){
                let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
            
                return userInfo[name] 
            },
            changeDate(){
                const now = new Date().getTime();
                this.data.forEach((item, index) => {
                    const date = new Date(now - (6 - index) * 86400000);
                    item.name = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
                })
            },
            handleListener(){
                bus.$on('collapse', this.handleBus);
                // 调用renderChart方法对图表进行重新渲染
                window.addEventListener('resize', this.renderChart)
            },
            handleBus(msg){
                setTimeout(() => {
                    this.renderChart()
                }, 300);
            },
            renderChart(){
                this.$refs.bar.renderChart();
                this.$refs.line.renderChart();
            }
        }
    }
</script>


<style scoped>
.content{
      width: auto;
    height: 100%;
    padding: 10px;
    overflow-y: scroll;
    box-sizing: border-box;
    background: #f0f0f0;
}
    .el-row {
        margin-bottom: 20px;
    }
    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }
    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }
    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }
    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }
    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }
    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }
    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }
    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }
    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }
    .grid-con-3 .grid-num {
           color: rgb(242, 94, 67);
    }
    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }
    .user-info-name{
          margin-bottom: 6px;
    }
    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }
    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }
    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }
    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }
    .user-info-list span {
        margin-left: 70px;
    }
    .mgb20 {
        margin-bottom: 20px;
    }
    .todo-item {
        font-size: 14px;
    }
    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }
    .schart {
        width: 100%;
        height: 300px;
    }
    .Todo{
        margin-top: 20px;
    }
</style>