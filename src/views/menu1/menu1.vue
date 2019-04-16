<template>
  <div class="app-container">
   <!-- 工具条; -->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
            <el-form-item>
                <el-input v-model="filters.name" placeholder="菜单名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" >查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleAdd($event)">新增</el-button>
            </el-form-item>
        </el-form>
    </el-col>
    <tree-table :data="data" :eval-func="func" :eval-args="args" :expand-all="expandAll" stripe >
      <el-table-column label="菜单名称" align="center" sortable>
        <template slot-scope="scope">
          <span >{{ scope.row.meta.title}}</span>
        </template>
      </el-table-column>
      <el-table-column label="链接" align="center" sortable>
        <template slot-scope="scope">
          <span >{{ scope.row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组件" align="center" sortable>
        <template slot-scope="scope">
          <span >{{ scope.row.component }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Icon" align="center" sortable>
        <template slot-scope="scope">
          <span >{{ scope.row.icon }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" sortable>
        <template slot-scope="scope">
          <span >{{ scope.row.sort }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row, $event)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row, $event)">删除</el-button>
        </template>
      </el-table-column>
    </tree-table>
    <!--工具条;-->
    <el-col :span="24" class="toolbar">
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
        </el-pagination>
    </el-col>
       <!-- 新增界面; -->
  <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="120px" :rules="addFormRules"  ref="addForm">
          <el-form-item label="顶级菜单" prop="top_menu">
            <el-select v-model="addForm.top_menu" @change="change" filterable placeholder="请选择">
              <el-option v-for="item in options" :key="item.id" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="菜单名称" prop="redirect" v-if="addForm.top_menu == '顶级菜单'">
            <el-input v-model="addForm.redirect" auto-complete="off"  clearable></el-input>
          </el-form-item>

          <el-form-item label="子菜单名称" prop="childname" v-else>
            <el-input v-model="addForm.childname" auto-complete="off"  clearable></el-input>
          </el-form-item>
          <el-form-item label="链接" prop="path" >
            <el-input v-model="addForm.path" auto-complete="off" clearable></el-input>
          </el-form-item>

          <el-form-item label="Icon" prop="icon" >
            <el-input v-model="addForm.icon" auto-complete="off" clearable></el-input>
          </el-form-item>

           <el-form-item label="组件名称" prop="component">
            <el-input v-model="addForm.component" auto-complete="off" clearable></el-input>
          </el-form-item>

          <el-form-item label="权限按钮" prop="btn">
            <el-select v-model="addForm.sonData" @visible-change="selectChange($event,addForm.sonData)" multiple filterable  allow-create default-first-option  size="medium" placeholder="请选择权限按钮">

             <el-option v-for="item in options5" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="addForm.sort" @change="handleChange" :min="1" :max="100" label="描述文字"></el-input-number>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>
      <!--编辑界面;-->

		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px" :rules="addFormRules" ref="editForm">
          <el-form-item label="上级菜单" prop="top_menu">
            <el-select v-model="editForm.top_menu" filterable placeholder="请选择">
              <el-option v-for="item in options" :key="item.label" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>


			   <el-form-item label="菜单名称" prop="redirect" v-if="editForm.top_menu === '顶级菜单'">
            <el-input v-model="editForm.redirect" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="子菜单名称" prop="childname" v-else>
            <el-input v-model="editForm.childname" auto-complete="off"></el-input>
          </el-form-item>


          

          <el-form-item label="链接" prop="path" >
            <el-input v-model="editForm.path" auto-complete="off" clearable></el-input>
          </el-form-item>

          <el-form-item label="Icon" prop="icon" >
            <el-input v-model="editForm.icon" auto-complete="off" clearable></el-input>
          </el-form-item>



           <el-form-item label="组件名称" prop="component">
            <el-input v-model="editForm.component" auto-complete="off" clearable></el-input>
          </el-form-item>

          <el-form-item label="权限按钮" prop="btn">

            <el-select v-model="editForm.sonData"  @visible-change="selectChange($event,editForm.sonData)" multiple filterable  allow-create default-first-option  size="medium" placeholder="请选择权限按钮">

             <el-option v-for="item in options5" :key="item.label" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="editForm.sort" @change="handleChange" :min="1" :max="100" label="描述文字"></el-input-number>
          </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

  </div>
</template>

<script>

import treeTable from "@/components/TreeTable";
import treeToArray from "./customEval";
import { Notification } from 'element-ui';
import { generateTitle } from '@/utils/en'
import { getmenuList,addMenu,topMenu,openMenu,editMenu,removeMenu,batchRemoveMenu,permissionBtn} from '@/api/api';
import { mapActions, mapGetters } from 'vuex';
import { setSession } from '@/utils/auth';
import MenuUtils from '@/utils/MenuUtils'
import  _  from 'lodash';
import Menus from '@/utils/auth';
export default {
  name: "CustomTreeTableDemo",
  components: { treeTable },
  data() {
    return {
    filters: {
        name: '',
        id:''
    },
    total: 0,
    page: 1,
    listLoading: false,
    options: [
          {
          value: '0',
          label: '顶级菜单',
          id:0
        }
    ],
    options5:[
       {
          value: 'add',
          label: '新增'
        },
        {
          value: 'edit',
          label: '编辑'
        }
    ],
    role:[],
    addLoading: false,
    addFormVisible: false, //添加界面是否显示
    editLoading: false,
    editFormVisible: false,//编辑界面是否显示
    addFormRules:{},
    //新增界面数据
	  addForm: {
	    redirect: '',
        top_menu: '',
        path:'',
        icon:'',
        sort:'',
        component:'',
        sonData:[],
        childname:''
    },
     //编辑界面数据
    editForm: {
        redirect: '',
        top_menu: '',
        path:'',
        icon:'',
        sort:'',
        component:'',
        children:[],
        sonData:[],
        childname:''
    },
    func: treeToArray,
    expandAll: false,
    data: [],
    args: [null, null, "timeLine"]
    };
  },
  methods: {
    ...mapActions([
    'addMenu',
    'row'
    ]),
    changeValue(callback,vc){
        console.log(callback,vc)
    },
    handleChange(){},
    message(row) {
      this.$message.info(row.event);
    },
    selectChange($event,vc){
      console.log($event,vc)
      if($event){
          permissionBtn().then((res) => {
            console.log(res)
           this.options5 = res
        })
      }
    },
    handleCurrentChange(){

    },
      //获取角色列表
    getMenu() {
      let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      let row = JSON.parse(window.localStorage.getItem('row'))
      let para = {
        page: this.page,
        menuName: this.filters.name,
        menuId:row.id,
        roleId:userInfo.role_id
      };
      this.listLoading = true;
      //NProgress.start();
      getmenuList(para).then((res) => {
        console.log(res);
        this.total = res.total;
        this.role = res.role
        this.data = res.dataMenu;
        this.listLoading = false;
        //NProgress.done();
      })
    },
    // 选择上级菜单
    change(data){
        console.log(data)
        if(data=="顶级菜单"){
            this.addForm.path = "/"
            this.addForm.component = "layout"
            
        }


    },
    // 显示添加页面
    handleAdd($event){
        console.log($event.target.innerText)
        if(!this.check($event.target.innerText)){
              Notification({
                title: '警告',
                message: '没有权限,请与管理员联系',
                type: 'warning'
              });
              return false
            }
        this.addFormVisible = true;
        this.addForm = {
                redirect: '',
                top_menu: '',
                path:'',
                icon:'',
                sort:'',
                component:'',
                sonData:[],
                childname:''
                
                
            }
        topMenu().then((res) => {
      
            this.options = res.topmenu
        })
    },
    check(status){
      return this.role.includes(status)
    },
    // 提交新增数据
    addSubmit: function (ev) {
        var _this = this;

        // let para =  Object.assign({}, this.addForm);
        // console.log(para);
        // return false;


        this.$refs.addForm.validate((valid) => {
        if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
                this.addLoading = true;
                let para =  Object.assign({}, this.addForm);
                console.log(para);

                addMenu(para).then(data => {
                    let  routers = []
                    this.addLoading = false;
                    let {code, message, user} = data;
                    console.log(data)
                    if (code !== 200) {
                        this.$message({
                        message: message,
                        type: 'error'
                        });
                    } else {
                        this.$message({
                        message:message,
                        type: 'success'
                        });
                        this.addMenu(data.user);
                        MenuUtils(routers,user)
                        this.$router.options.routes = routers
                        this.$router.addRoutes(routers)
                        setSession(data.user)
                        this.$refs['addForm'].resetFields();
                        this.addFormVisible = false;
                        this.getMenu()
                    }
                });
            });
        }
        });
    },
    // 显示编辑页面
    handleEdit: function (index, row,$event) {
       if(!this.check($event.target.innerText)){
              Notification({
                title: '警告',
                message: '没有权限,请与管理员联系',
                type: 'warning'
              });
              return false
          }
        this.editFormVisible = true;
        console.log(row)
        let data = []
        row.sonData.forEach(element => {
          if( _.split(element, '_', 2)[1]){
            element = _.split(element, '_', 2)[1]
          }
          if(element){
            data.push(element)
          }
          
        })
        row.sonData = data
        console.log(row.sonData)
        this.editForm = Object.assign({}, row);
        topMenu().then((res) => {
            this.options = res.topmenu
        })

    },
     //提交编辑后的数据
    editSubmit: function () {
        this.$refs.editForm.validate((valid) => {
        if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true;
            //NProgress.start();


            let para = Object.assign({}, this.editForm);
            delete para.children;
            delete para.parent;
            console.log(para)
            // para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
            editMenu(para).then((res) => {
                let  routers = [];
                this.editLoading = false;
                //NProgress.done();
                let {code, message, user} = res;
                if (code !== 200) {
                    this.$message({
                    message: message,
                    type: 'error'
                    });
                } else {
                    this.$message({
                    message:message,
                    type: 'success'
                    });
                    console.log(res)
                    this.addMenu(res.user);
                    MenuUtils(routers,user)
                    this.$router.options.routes = routers
                    this.$router.addRoutes(routers)
                    setSession(res.user)
                    this.$refs['editForm'].resetFields();
                    this.editFormVisible = false;
                    this.getMenu();
                }
            });
            });
        }
        });
    },
   //删除
        handleDel: function (index, row, $event) {

          if(!this.check($event.target.innerText)){
              Notification({
                title: '警告',
                message: '没有权限,请与管理员联系',
                type: 'warning'
              });
              return false
          }
          this.$confirm('确认删除该记录吗?', '提示', {
            type: 'warning'
          }).then(() => {
            this.listLoading = true;
            //NProgress.start();
            let para = { id: row.id };
            removeMenu(para).then((res) => {
              let  routers = [];
              this.listLoading = false;
              //NProgress.done();
              let {code, message, user} = res;
              if (code !== 200) {
                this.$message({
                  message: message,
                  type: 'error'
                });
              } else {
                this.$message({
                  message:message,
                  type: 'success'
                });
                // console.log(res)
                this.addMenu(res.user);
                MenuUtils(routers,user)
                this.$router.options.routes = routers
                this.$router.addRoutes(routers)
                setSession(res.user)

                this.getMenu();
              }
            });
          }).catch(() => {
          });
        },

  },
  mounted() {
      this.getMenu()
  },
};
</script>
<style scoped>
.el-select{
 width: 100%;
}
</style>
