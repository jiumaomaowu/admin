<template>
	<section>
    <!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="医院名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getHospital">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd($event)">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55" align="center">
			</el-table-column>
			<el-table-column type="index" label="ID" width="60" align="center">
			</el-table-column>
			<el-table-column prop="hospital_name" label="医院名称" min-width="180" sortable align="center">
			</el-table-column>
			<el-table-column prop="province" label="所属省/市" width="180" sortable align="center">
			</el-table-column>
			<el-table-column prop="city" label="所在城市" width="180" sortable align="center">
			</el-table-column>
			<el-table-column prop="region_type" label="所属大区" width="150" sortable align="center">
			</el-table-column>
			<el-table-column prop="name" label="负责人" width="150" sortable align="center">
			</el-table-column>
      <el-table-column prop="createTime" label="更新时间" width="180" sortable align="center">
			</el-table-column>
      <el-table-column label="操作" width="150"  align="center">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row,$event)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row,$event)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
    <!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

    <!-- 新增界面 -->
  <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="80px"   ref="addForm">
          <el-form-item label="医院名称" prop="hospital_name">
            <el-input v-model="addForm.hospital_name" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="所属大区" prop="region_type">
            <el-select v-model="addForm.region_type" placeholder="请选择所属大区">
              <el-option label="东区" value="东区"></el-option>
              <el-option label="南区" value="南区"></el-option>
              <el-option label="西区" value="西区"></el-option>
              <el-option label="北区" value="北区"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="居住省/市" prop="provincecity">
               <v-distpicker hide-area @selected="onSelected" v-model="addForm.provincecity" ></v-distpicker>
          </el-form-item>

          <el-form-item label="负责人" prop="name">
            <el-input v-model="addForm.name" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="上会时间" prop="meetingTime">
            <el-date-picker v-model="addForm.meetingTime" type="date"  rangeSeparator = "/" placeholder="选择日期"> </el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>
<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px"  ref="editForm">
			<el-form-item label="医院名称" prop="hospital_name">
            <el-input v-model="editForm.hospital_name" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="所属大区" prop="region_type">
            <el-select v-model="editForm.region_type" placeholder="请选择所属大区">
              <el-option label="东区" value="东区"></el-option>
              <el-option label="南区" value="南区"></el-option>
              <el-option label="西区" value="西区"></el-option>
              <el-option label="北区" value="北区"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="居住省/市" prop="provincecity">
               <v-distpicker hide-area @selected="onSelected" v-model="editForm.provincecity" :province="editForm.province" :city="editForm.city"></v-distpicker>
          </el-form-item>

          <el-form-item label="负责人" prop="name">
            <el-input v-model="editForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="上会时间" prop="meetingTime">
            <el-date-picker v-model="editForm.meetingTime" type="date" rangeSeparator = "/"   placeholder="选择日期"> </el-date-picker>
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
	import { getHospitalList, addHospital,editHospital,removeHospital,batchRemoveHospital} from '../../api/api';
  import VDistpicker from 'v-distpicker'
  import { mapActions, mapGetters } from 'vuex';
  let province;
  let uid;
	export default {
		data() {
			return {
				filters: {
					name: ''
        },
        role:[],
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列
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
			 	  hospital_name: '',
          region_type: '',
					name: '',
					provincecity: '',
          createTime:'',
          meetingTime:''
        },
        //编辑界面数据
				editForm: {
				  hospital_name: '',
          region_type: '',
					name: '',
					provincecity: '',
          createTime:'',
          meetingTime:''
				},
      }
		},
		methods: {
        handleCurrentChange(val) {
          this.page = val;
          this.getHospital();
        },
        //获取医院列表
        getHospital() {
          let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
          let row = JSON.parse(window.localStorage.getItem('row'))
          let para = {
            page: this.page,
            hospitalName: this.filters.name,
             menuId:row.id,
            roleId:userInfo.role_id
          };
          this.listLoading = true;
          getHospitalList(para).then((res) => {
            console.log(res)
            this.role = res.role;
            this.total = res.total;
            this.users = res.datahospital;
            this.listLoading = false;
            //NProgress.done();
          });
        },
        check(status){
          return this.role.includes(status)
        },
        getProvince_city(){
            province = {
            province:'',
            city:''
          }
        },
         onSelected(data) {
         province.province = data.province.value;
         province.city = data.city.value;
        //  console.log(province)
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
            hospital_name: '',
            region_type: '',
            name:'',
            provincecity: ''
          };
          

        },
        // 提交新增数据
        addSubmit: function (ev) {
          var _this = this;
          this.$refs.addForm.validate((valid) => {
            if (valid) {
              this.$confirm('确认提交吗？', '提示', {}).then(() => {
                this.addLoading = true;
                this.addForm.province = province.province;
                this.addForm.city = province.city;
                 let para =  Object.assign({}, this.addForm);
                console.log(para)

                // return false;
                addHospital(para).then(data => {
                  this.addLoading = false;
                  //NProgress.done();
                   let {code, message } = data;


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
                      this.$refs['addForm'].resetFields();
                      this.addFormVisible = false;
                      this.getHospital();
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


                if(province.province!=''){
                     this.editForm.province = province.province
                    this.editForm.city = province.city
                }


                let para = Object.assign({}, this.editForm);
                para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                editHospital(para).then((res) => {
                  this.editLoading = false;
                  //NProgress.done();
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  });
                  this.$refs['editForm'].resetFields();
                  this.editFormVisible = false;
                  this.getHospital();
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
            removeHospital(para).then((res) => {
              this.listLoading = false;
              //NProgress.done();
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getHospital();
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
					batchRemoveHospital(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
					      this.getHospital();
					});
				}).catch(() => {
				});
			}


		},
		mounted() {
      this.getHospital();
      this.getProvince_city();
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

</style>
