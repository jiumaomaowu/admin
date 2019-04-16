<template>
	<section>

    <!-- 工具条; -->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="角色名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getRole">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd($event)">新增</el-button>

				</el-form-item>
			</el-form>
		</el-col>

		<!--列表;-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55" align="center">
			</el-table-column>

			<el-table-column type="index" label="ID" width="50" align="center">
			</el-table-column>

			<el-table-column prop="role_name" label="角色名" min-width="80" sortable align="center">
			</el-table-column>

			<el-table-column prop="remark" label="备注" min-width="100" sortable align="center">
			</el-table-column>

      <el-table-column label="操作" min-width="80"  align="center">
				<template slot-scope="scope">
					<el-button size="small" :disabled="isDisable(scope.row)" @click="handleEdit(scope.$index, scope.row,$event)">编辑</el-button>
          <el-button size="small"  :disabled="isDisable(scope.row)" @click="handlepermission(scope.$index, scope.row,$event)"  @mouseenter.native="permissionhover(scope.$index, scope.row)">添加权限</el-button>
          <el-button size="small" :disabled="isDisable(scope.row)" @click="handleuser(scope.$index, scope.row,$event)">添加用户</el-button>
					<el-button type="danger" :disabled="isDisable(scope.row)" size="small" @click="handleDel(scope.$index, scope.row,$event)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
    <!--工具条;-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

    <!-- 新增界面; -->
  <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="120px" :rules="addFormRules"  ref="addForm">
          <el-form-item label="角色名称" prop="role_name" >
            <el-input v-model="addForm.role_name" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="备注" prop="remark">
            <el-input v-model="addForm.remark" auto-complete="off"></el-input>
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
			   <el-form-item label="角色名称" prop="role_name" >
            <el-input v-model="editForm.role_name" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="备注" prop="remark">
            <el-input v-model="editForm.remark" auto-complete="off"></el-input>
          </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
<!-- 权限页面 -->
    <el-dialog title="添加权限" :visible.sync="permissionFormVisible" :close-on-click-modal="false">
			<el-form :model="permissionForm" label-width="120px"  ref="permissionForm">
			  <!-- <el-tree :data="tree" show-checkbox node-key="id"  :props="defaultProps"  default-expand-all ref="tree" highlight-current> </el-tree> -->
         <tree-tables :data="tree" :rowid="rowid"  :columns="columns" border @permissionSubmit="permissionSubmit" ref="permission" ></tree-tables>
      </el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="permissionFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="permissionSubmit" :loading="permissionLoading">提交</el-button>
			</div>
		</el-dialog>

<!-- 用户页面 -->
    <el-dialog title="添加用户" :visible.sync="userFormVisible" :close-on-click-modal="false">
			<el-form :model="userForm" label-width="120px"  ref="userForm">
          <index  ref="Index"    v-on:childByValue="childByValue" :usermultipleSelection="multipleSelection"></index>
      </el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="userFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="userFormSubmit" :loading="userLoading">提交</el-button>
			</div>
		</el-dialog>



	</section>
</template>

<script>
	// import util from '../../common/js/util'vfvfvf发vfvfvvvvvvvv额鹅鹅鹅vvvvvvv呃呃呃鹅鹅鹅鹅鹅鹅饿vvvv
	// import NProgress from 'nprogress'
	import { getRoleList,addRole,editRole,removeRole,batchRemoveRole,rolePermission,sumitPermission,getPermission,sumitUser,getUser} from '../../api/api';
  import Index from './index'
  import { mapActions, mapGetters } from 'vuex';
  import treeTables from '@/components/TreeTableAuthor'
  import _ from 'lodash'
  import MenuUtils from '@/utils/MenuUtils'
  import { setSession } from '@/utils/auth';
  import { getToken, setToken, removeToken } from '@/utils/auth'
  import store from '../../store'
  import { Notification } from 'element-ui';
  import { generateTitle } from '@/utils/en'
  export default {
    name: 'treeTableDemo',
    components: { treeTables,Index, generateTitle },
		data() {
			return {
        columns: [
        {
          text: '菜单列表',
          value: 'childname',
          label:'redirect',
          width: 200,
          option: 'sonData'
        },
        {
          text: '功能权限',
          value: 'sonData',
          option: 'sonData',
          act: 'act'
        }
      ],
				filters: {
          name: '',
          id:''
        },
        users: [],
        multipleSelection: [],
        dataList:[],
        tree:[],
        // permission:[],
        rowid:'',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列
        role:[],
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				addLoading: false,
        addFormVisible: false, //添加界面是否显示
        permissionFormVisible: false, //权限界面是否显示
        permissionLoading: false,
        userFormVisible: false, //用户界面是否显示
        userLoading: false,
        addFormRules: {
					hospital_name: [
						{ required: true, message: '请输入医院名称', trigger: 'blur' }
          ],
          region_type:[
             { required: true, message: '请选择所属大区', trigger: 'change' }
          ],
          name:[
             { required: true, message: '请输入负责人姓名', trigger: 'blur' }

          ]


				},
        //新增界面数据
				addForm: {
			 	  role_name: '',
          remark: ''

        },
        //编辑界面数据
				editForm: {
				  role_name: '',
          remark: ''
        },
        //权限界面数据
        permissionForm:{
            checked:[],
            role_id:''
        },
        // 用户页面数据
        userForm:{
          multipleSelection:[]
        }
      };
    },
    // components: {
    //       Index
    // },
		methods: {
...mapActions([
        'addSelection',       
      ]),
      isDisable(row){
        if(getToken()!="admin"){
          if(row.role_name == "超级管理员"){
              return true
          }
        }
        
      },
      handleCurrentChange (){},
        //获取角色列表
        getRole() {
          let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
          let row = JSON.parse(window.localStorage.getItem('row'))
          let para = {
            page: this.page,
            roleName: this.filters.name,
            menuId:row.id,
            roleId:userInfo.role_id
          };
          this.listLoading = true;
          //NProgress.start();

         getRoleList(para).then((res) => {
            // console.log(res);
            this.total = res.total;
            this.users = res.dataRole;
            this.listLoading = false;
            this.role = res.role
            //NProgress.done();
          });
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
              role_name: '',
              remark: ''
            };
        },
        check(status){
          return this.role.includes(status)
        },
        // 提交新增数据
        addSubmit: function (ev) {
          var _this = this;
          this.$refs.addForm.validate((valid) => {
            if (valid) {
              this.$confirm('确认提交吗？', '提示', {}).then(() => {
                this.addLoading = true;
                 let para =  Object.assign({}, this.addForm);
                console.log(para);


                addRole(para).then(data => {
                  this.addLoading = false;
                  //NProgress.done();
                   let {code, message } = data;
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
                      this.$refs['addForm'].resetFields();
                      this.addFormVisible = false;
                      this.getRole();
                    }
                });
              });
            }
          });
        },
        // 显示编辑页面
        handleEdit: function (index, row, $event) {
          if(!this.check($event.target.innerText)){
              Notification({
                title: '警告',
                message: '没有权限,请与管理员联系',
                type: 'warning'
              });
              return false
            }

				  this.editFormVisible = true;
          this.editForm = Object.assign({}, row);

        },
        //提交编辑后的数据
        editSubmit: function () {
          this.$refs.editForm.validate((valid) => {
            if (valid) {
              this.$confirm('确认提交吗？', '提示', {}).then(() => {
                this.editLoading = true;
                //NProgress.start();


                let para = Object.assign({}, this.editForm);
                para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                editRole(para).then((res) => {
                  this.editLoading = false;
                  //NProgress.done();
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  });
                  this.$refs['editForm'].resetFields();
                  this.editFormVisible = false;
                  this.getRole();
                });
              });
            }
          });
        },

        // 显示添加权限页面
        handlepermission(index, row,$event){
            if(!this.check($event.target.innerText)){
              Notification({
                title: '警告',
                message: '没有权限,请与管理员联系',
                type: 'warning'
              });
              return false
            }
            this.permissionFormVisible = true
            let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
            this.permissionForm = {
                checked:[],
                role_id:row.id,
                role_name:row.role_name,
                admin_id: userInfo.role_id
            }
          let para = row.id
          this.rolePermission(para)
        },
        rolePermission(para){
          rolePermission(para).then((res) =>{
              let _that = this
              let data_permission = res.role_permission
              console.log(data_permission)
              Array.from(data_permission).forEach(function (record){
                _that.permission.forEach(element => {
                  if(record.children.length===0){
                    let permission =[]
                    _that.permission.forEach(ele => {
                    if(record.id ===_.split(ele, '_', 2)[0]){
                          permission.push(ele)
                      }
                    })
                      record.selectchecked = permission
                  }else if(record.children.length>0){
                      record.children.forEach(eles => {

                        let permission =[]
                         _that.permission.forEach(ele => {
                          if(eles.id ===_.split(ele, '_', 2)[0]){
                                permission.push(ele)
                            }
                        })
                        eles.selectchecked = permission
                      })
                  }
                })
              })

              this.tree = data_permission
          })
        },
        permissionSubmit(){
          let data = this.$refs.permission.permissionSubmit()
          this.$refs.permissionForm.validate((valid) => {
            if (valid) {
              this.$confirm('确认提交吗？', '提示', {}).then(() => {
                this.permissionLoading = true;
                let opt = []
                data.forEach(val => {
                  if (val.children.length>0) {
                    val.children.forEach(el => {
                      if (el.selectchecked.length) {
                        opt.push(el.selectchecked)
                      }
                    })
                  }else if(val.selectchecked.length > 0){
                    opt.push(val.selectchecked)
                  }
                })
                opt = opt.join().split(',').filter(n => { return n })
                opt = Array.from(new Set(opt));
                this.permissionForm.checked = opt
                this.addPermission(this.permissionForm.checked)
                let para = Object.assign({}, this.permissionForm);
                  console.log(para)
                sumitPermission(para).then((res) =>{
                  this.permissionLoading = false;
                  let  routers = [];
                  if(res.code === 200){
                    this.$message({
                      message: res.message,
                      type: 'success'
                    });
                    console.log(res.data)
                    this.addMenu(res.data);
                    MenuUtils(routers,res.data)
                    this.$router.options.routes = routers
                    this.$router.addRoutes(routers)
                    setSession(res.data)
                    this.$refs['permissionForm'].resetFields();
                    this.permissionFormVisible = false
                    this.getRole()
                  }


                })
              });
            }
          });
        },
        permissionhover(index,row){
          let param={
            row_id:row.id
          }
          getPermission(param).then((rer) =>{
            // console.log(rer.dataPermission)
            this.addPermission(rer.dataPermission)

          })

        },
        // 显示用户添加页面
        handleuser(index, row,$event){
            if(!this.check($event.target.innerText)){
              Notification({
                title: '警告',
                message: '没有权限,请与管理员联系',
                type: 'warning'
              });
              return false
            }
          this.userFormVisible = true
          this.userForm = {
              multipleSelection: [],
              user_id : row.id

          }
          let  para = {
            user_id : row.id
          }
          this.$nextTick(()=>{
            getUser(para).then((res) =>{
                if(res.dataUser[0]){
                  this.$refs.Index.getAdmin(res.dataUser[0].multipleSelection);
                }else{
                  this.$refs.Index.getAdmin([]);
                }
            })
          })
        },
        // 子组件 传值
        childByValue: function (childValue) {
        // childValue就是子组件传过来的值
        console.log(childValue)
        this.userForm.multipleSelection = childValue
        // console.log(this.userForm)
      },
        // 提交用户 添加
        userFormSubmit(){
           var _this = this;
          this.$refs.userForm.validate((valid) => {
            if (valid) {
               let para =  Object.assign({}, this.userForm);
                 console.log(para)

              this.$confirm('确认提交吗？', '提示', {}).then(() => {
                this.userLoading = true;
                sumitUser(para).then((res) =>{
                    this.userLoading = false;
                    this.$message({
                      message: '提交成功',
                      type: 'success'
                    });
                    this.$refs['userForm'].resetFields();
                    this.userFormVisible = false
                    this.addSelection([])
                })
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
            removeRole(para).then((res) => {
              this.listLoading = false;
              //NProgress.done();
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getRole();
            });
          }).catch(() => {
          });
        },
        	selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
          let para = { ids: ids };
					batchRemoveRole(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
					      this.getRole();
					});
				}).catch(() => {
				});
      },
      ...mapActions([
        'addPermission',
        'addMenu'
      ]),
      generateTitle



		},
		mounted() {
      this.getRole()
    },
     computed: {
        ...mapGetters([
        'permission',
        'userInfo'
      ])
     }


	}

</script>

<style scoped>
  li{
    list-style: none;
  }
  .role-table {
    border: 1px solid #e0e0e0;
    border-bottom: none;
    padding: 0;
    position: relative;
}

.header {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #e7e7e7;
    background: #F8F8F9;
    text-align: center;
}

.vertical-line {
    width: 1px;
    height: 100%;
    background: #ddd;
    position: absolute;
    left: 30%;
    top: 0
}

.left {
    width: 30%;
    float: left;
    padding-left: 10px;
    user-select: none;
    cursor: pointer;
}

.one {
    padding-left: 20px;
}

.right {
    width: 65%;
    float: left;
    padding-left: 10px;
}

.item-icon {
    margin-left: -5px;
    padding: 5px;
}

.line {
    clear: both;
    width: 100%;
    height: 1px;
    background: #e0e0e0;
}
.h40{
    height: 39px;
    line-height: 39px;
}
[v-cloak] {
    display: none;
}
</style>;
