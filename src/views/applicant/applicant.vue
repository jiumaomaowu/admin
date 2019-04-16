<template>
	<section>
    <!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="申办方名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getApplicant">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd($event)">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="applicant" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55" align="center">
			</el-table-column>
			<el-table-column type="index" label="ID" width="60" align="center">
			</el-table-column>
			<el-table-column prop="applicant_name" label="申办方名称" min-width="130" sortable align="center">
			</el-table-column>
			<el-table-column prop="region_type" label="申办方归属地" min-width="130" sortable align="center">
			</el-table-column>
      <el-table-column prop="createTime" label="更新时间" min-width="150" sortable align="center">
			</el-table-column>
      <el-table-column label="操作" min-width="180"  align="center">
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
  <el-dialog title="新增" :visible.sync="addFormApplicant" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="130px" :rules="addFormRules"  ref="addForm">
          <el-form-item label="申办方名称" prop="applicant_name">
            <el-input v-model="addForm.applicant_name" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="申办方归属地" prop="region_type">
            <el-select v-model="addForm.region_type" placeholder="请选择申办方归属地">
              <el-option label="国内" value="国内"></el-option>
              <el-option label="国外" value="国外"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="description">
            <el-input v-model="addForm.description" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormApplicant = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>
<!--编辑界面-->
		<el-dialog title="编辑"  :visible.sync="editFormApplicant" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="130px" :rules="addFormRules" ref="editForm">
			<el-form-item label="申办方名称" prop="applicant_name">
            <el-input v-model="editForm.applicant_name" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="申办方归属地" prop="region_type">
            <el-select v-model="editForm.region_type" placeholder="请选择申办方归属地">
              <el-option label="国内" value="国内"></el-option>
              <el-option label="国外" value="国外"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="备注" prop="description">
            <el-input v-model="editForm.description" auto-complete="off"></el-input>
          </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormApplicant = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
import { addApplicant,getApplicantList ,editApplicant,removeApplicant,batchRemoveApplicant} from '@/api/api';
let uid;
import { Notification } from 'element-ui';
import { mapActions, mapGetters } from 'vuex';
import { getToken, setToken, removeToken, setlocalStorage } from '@/utils/auth'
export default {
  data() {
			return {
				filters: {
					name: ''
				},
				applicant: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列
        role:[],
				editFormApplicant: false,//编辑界面是否显示
				editLoading: false,
				addLoading: false,
        addFormApplicant: false,
        addFormRules: {
					applicant_name: [
						{ required: true, message: '请输入申办方名称', trigger: 'blur' }
          ],
          region_type:[
             { required: true, message: '请选择申办方所属区域', trigger: 'change' }
          ]

				},
        //新增界面数据
				addForm: {
			 	  applicant_name: '',
          region_type: '',
				  description:''
        },
        //编辑界面数据
				editForm: {
				  applicant_name: '',
          region_type: '',
				  description:''
				}
      }
    },
    methods:{
        selsChange(){

        },
        formatSex(){

        },
        handleCurrentChange(val) {
          this.page = val;
          this.getApplicant();
        },
        // 获取申办方列表
        getApplicant(){
          let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
          let row = JSON.parse(window.localStorage.getItem('row'))
          let para = {
            page: this.page,
            applicantName: this.filters.name,
            menuId:row.id,
            roleId:userInfo.role_id
          };
          this.listLoading = true;
          //NProgress.start();
          getApplicantList(para).then((res) => {
            console.log(res)
            this.total = res.data.total;
            this.applicant = res.data.dataApplicant;
            this.role = res.data.role;
            this.listLoading = false;
            //NProgress.done();
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
            this.addFormApplicant = true;
            this.addForm = {
              applicant_name: '',
              region_type: '',
              description:''

            }
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
                console.log(para)

                // return false;
                addApplicant(para).then(data => {
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
                      this.addFormApplicant = false;
                      this.getApplicant();
                    }
                });
              });
            }
          });
        },
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
				  this.editFormApplicant = true;
          this.editForm = Object.assign({}, row);

        },
        // 提交编辑后的数据
        editSubmit: function () {
          this.$refs.editForm.validate((valid) => {
            if (valid) {
              this.$confirm('确认提交吗？', '提示', {}).then(() => {
                this.editLoading = true;
                let para = Object.assign({}, this.editForm);
                para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                editApplicant(para).then((res) => {
                  this.editLoading = false;
                  //NProgress.done();
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  });
                  this.$refs['editForm'].resetFields();
                  this.editFormApplicant = false;
                  this.getApplicant();
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
            removeApplicant(para).then((res) => {
              this.listLoading = false;
              //NProgress.done();
              this.$message({
                message: '删除成功',
                type: 'success'
              });
               this.getApplicant();
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
					batchRemoveApplicant(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
					    this.getApplicant();
					});
				}).catch(() => {
				});
			}
    },
    mounted() {
      this.getApplicant();

    }

}
</script>

<style scoped>

</style>
