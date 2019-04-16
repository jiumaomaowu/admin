<template>
	<section>

    <!--工具条;-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.id" placeholder="工号"></el-input>
				</el-form-item>
        <el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getAdmin">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd($event)">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表;-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" :selectable='checkboxInit' width="55" align="center">
			</el-table-column>

			<el-table-column type="index" label="ID" width="60" align="center">
			</el-table-column>

			<el-table-column prop="job_number" label="工号" min-width="80" sortable align="center">
			</el-table-column>

			<el-table-column prop="name" label="姓名" min-width="80" sortable align="center">
			</el-table-column>

			<el-table-column prop="mailbox" label="邮箱" min-width="90" sortable align="center">
			</el-table-column>

			<el-table-column  label="管理员状态" min-width="80" sortable align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" :disabled="isDisable(scope.row)"  active-text="启用" inactive-text="关闭" @change="changestatu(scope.row)"></el-switch>
          </template>
			</el-table-column>

      <el-table-column label="操作" width="150"  align="center">
				<template slot-scope="scope">
					<el-button size="small" :disabled="isDisable(scope.row)" @click="handleEdit(scope.$index, scope.row,$event)">编辑</el-button>
					<el-button type="danger"  :disabled="isDisable(scope.row)" size="small" @click="handleDel(scope.$index, scope.row,$event)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
    <!--工具条;-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

    <!-- 新增界面; -->
  <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="120px" :rules="addFormRules"  ref="addForm">
          <el-form-item label="工号" prop="job_number" >
            <el-input v-model="addForm.job_number" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="姓名" prop="name">
            <el-input v-model="addForm.name" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="mailbox">
              <el-input v-model="addForm.mailbox" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="是否启用管理员" prop="status">

              <el-switch v-model="addForm.status" ></el-switch>

          </el-form-item>

          <el-form-item label="随机密码" prop="password">
            <el-row >
            <el-col :span="20"><el-input v-model="addForm.password" auto-complete="off"></el-input></el-col>
            <el-col :span="4" align="right"><el-button  @click="createPassword" type="primary">随机生成</el-button></el-col>

            </el-row>
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
			  <el-form-item label="工号" prop="job_number" >
            <el-input v-model="editForm.job_number" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="姓名" prop="name">
            <el-input v-model="editForm.name" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="mailbox">
              <el-input v-model="editForm.mailbox" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="是否启用管理员" prop="status">


              <el-switch v-model="editForm.status" ></el-switch>

          </el-form-item>

          <el-form-item label="随机密码" prop="password">
            <el-row >
              <el-col :span="20"><el-input v-model="editForm.password" auto-complete="off"></el-input></el-col>
            <el-col :span="4" align="right"><el-button  @click="createPassword" type="primary">随机生成</el-button></el-col>
            </el-row>
          </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>




	</section>
</template>

<script>
	// import util from '../../common/js/util'
  //import NProgress from 'nprogress'
  import { Notification } from 'element-ui';
	import { getAdminlist,changeSatus, addAdmin,editAdmin,removeAdmin,batchRemoveAdmin} from '../../api/api';
  import VDistpicker from 'v-distpicker';
    import { mapActions, mapGetters } from 'vuex';
  let province;

  let uid;
	export default {
		data() {
			return {
				filters: {
          name: '',
          id:''
        },
        value1: true,
        value2: true,
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列
        role:'',
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				addLoading: false,
        addFormVisible: false,
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
			 	  job_number: '',
          name: '',
					mailbox: '',
          status:'',
          password:''
        },
        //编辑界面数据
				editForm: {
				  job_number: '',
          name: '',
					mailbox: '',
          status:'',
          password:''
				},
      };
		},
		methods: {
        selsChange(){

        },
        formatSex(){

        },
        checkboxInit(row){
           if(row.job_number == "admin"){
              return false
          }else{
              return true
          }
        },
          isDisable(row){
          
          if(row.job_number == "admin"){
              return true
          }
          
        },
        // 管理员状态改变 函数
        changestatu(obj){

          console.log(obj);
          // return false;
           changeSatus(obj).then(data => {
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
                // this.getAdmin();
              }
          });
        },
        // 随机生成 密码
        createPassword(){
          let password = createPassword(8,15);
          this.addForm.password = password;
          this.editForm.password = password;
          console.log(password);
          function createPassword(min,max) {
            //可以生成随机密码的相关数组
            var num = ["0","1","2","3","4","5","6","7","8","9"];
            var english = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
            var ENGLISH = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
            var special = ["-","_","#","@","$","%","&","*"];
            var config = num.concat(english).concat(ENGLISH).concat(special);

            //先放入一个必须存在的
            var arr = [];
            arr.push(getOne(num));
            arr.push(getOne(english));
            arr.push(getOne(ENGLISH));
            arr.push(getOne(special));

            //获取需要生成的长度
            var len = min + Math.floor(Math.random()*(max-min+1));

            for(var i=4; i<len; i++){
              //从数组里面抽出一个
              arr.push(config[Math.floor(Math.random()*config.length)]);
            }

            //乱序
            var newArr = [];
            for(var j=0; j<len; j++){
              newArr.push(arr.splice(Math.random()*arr.length,1)[0]);
            }

            //随机从数组中抽出一个数值
            function getOne(arr) {
              return arr[Math.floor(Math.random()*arr.length)];
            }

            return newArr.join("");
            }
        },
        handleCurrentChange(val) {
          this.page = val;
          this.getAdmin();
        },
        //获取医院列表
        getAdmin() {
          let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
          let row = JSON.parse(window.localStorage.getItem('row'))
          let para = {
            page: this.page,
            adminName: this.filters.name,
            adminId: this.filters.id,
            menuId:row.id,
            roleId:userInfo.role_id
          };
          this.listLoading = true;
          //NProgress.start();
          console.log(this.row)
          getAdminlist(para).then((res) => {
            console.log(res);
            this.total = res.data.total;
            this.users = res.data.dataAdmin;
            this.role = res.data.role
            this.listLoading = false
          });
        },
        // 显示添加页面
        handleAdd($event){

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
              job_number: '',
              name: '',
              mailbox: '',
              status:false,
              password:''
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


                addAdmin(para).then(data => {
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
                      this.getAdmin();
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
          uid = row.id;
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
                editAdmin(para).then((res) => {
                  this.editLoading = false;
                  //NProgress.done();
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  });
                  this.$refs['editForm'].resetFields();
                  this.editFormVisible = false;
                  this.getAdmin();
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
            removeAdmin(para).then((res) => {
              this.listLoading = false;
              //NProgress.done();
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getAdmin();
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
					batchRemoveAdmin(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
					      this.getAdmin();
					});
				}).catch(() => {
				});
			}


		},
		mounted() {
      this.getAdmin()

    },
     computed: {
        ...mapGetters([
        'row',
      ])
     },
    components: { VDistpicker }

	}

</script>

<style scoped>
  .el-form{

  }
</style>;
