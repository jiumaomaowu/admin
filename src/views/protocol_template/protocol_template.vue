<template>
	<section>
    <!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="协议模板名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getProtocol">查 询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd($event)"> 新增</el-button>
				</el-form-item>
			</el-form>  
		</el-col>
  
		<!--列表-->
		<el-table :data="protocol" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55" align="center">
			</el-table-column>
			<el-table-column type="index" label="ID" width="60" align="center">
			</el-table-column>
			<el-table-column prop="protocol_name" label="协议模板名称" min-width="150" sortable align="center">
			</el-table-column>
			<el-table-column prop="protocol_provider" label="协议模板提供方" min-width="100" sortable align="center">
			</el-table-column>
      <el-table-column prop="provider_name" label="协议模板提供方名称" min-width="150" sortable align="center">
			</el-table-column>
      <el-table-column prop="createTime" label="更新时间" min-width="100" sortable align="center">
			</el-table-column>
      <el-table-column label="操作" min-width=""  align="center">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row,$event)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row, $event)">删除</el-button>
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
      <el-dialog title="新增" :visible.sync="addFormProtocol" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="130px" :rules="addFormRules"  ref="addForm">
          <el-form-item label="协议模板名称" prop="protocol_name">
            <el-input v-model="addForm.protocol_name" auto-complete="off" clearable></el-input>
          </el-form-item>

          <el-form-item label="协议模板提供方" prop="protocol_provider">
            <el-radio-group v-model="addForm.protocol_provider" @change="onchange">
              <el-radio label="医院"></el-radio>
              <el-radio label="申办方"></el-radio>
              <el-radio label="smo"></el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 医院++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
          <el-form-item  v-if="(addForm.protocol_provider == row.housptal)?checkState:!checkState" >

            <el-form-item label="所属省/市" prop="provincecity" :class="itemclass">
               <v-distpicker :name="select" id='city' hide-area @selected="onSelected" :province="addForm.provincecity.province" :city="addForm.provincecity.city" :value="select"  v-model="addForm.provincecity" ></v-distpicker>
               <!-- <el-cascader placeholder="试试搜索：" :options="options"  filterable change-on-select></el-cascader> -->
            </el-form-item>
            <el-form-item label="所属医院" prop="provider_name" :class="itemclass">
              <el-select v-model="addForm.provider_name" placeholder="请选择">
                <el-option v-for="item in provider_name" :key="item.value" :value="item.value" :label="item.label">

                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="指定申办方" prop="provider" :class="itemclass">
              <el-select v-model="addForm.provider" placeholder="请选择">
                <el-option v-for="item in provider" :key="item.value" :label="item.label" :value="item.value">

                </el-option>
              </el-select>
            </el-form-item>

          </el-form-item>





          <!-- 申办方+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->
          <el-form-item  v-if="(addForm.protocol_provider == row.applicant)?checkState:!checkState"  >
             <el-form-item label="所属申办方" prop="provider_name" :class="itemclass">
              <el-select v-model="addForm.provider_name" placeholder="请选择">
                <el-option v-for="item in provider" :key="item.value" :label="item.label" :value="item.value">

                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="所属省/市" prop="provincecity" :class="itemclass">
               <v-distpicker hide-area @selected="onSelected" :province="select.province" :city="select.city" :value="select"  v-model="addForm.provincecity" ></v-distpicker>
               <!-- <el-cascader placeholder="试试搜索：" :options="options"  filterable change-on-select></el-cascader> -->
            </el-form-item>
            <el-form-item label="指定医院" prop="provider_name" :class="itemclass">
              <el-select v-model="addForm.provider" placeholder="请选择">
                <el-option v-for="item in provider_name" :key="item.value" :value="item.value" :label="item.label">

                </el-option>
              </el-select>
            </el-form-item>


          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormProtocol = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>



<!--编辑界面-->
		<el-dialog title="编辑"  :visible.sync="editFormProtocol" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="130px" :rules="addFormRules" ref="editForm">
			    <el-form-item label="协议模板名称" prop="protocol_name">
            <el-input v-model="editForm.protocol_name" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="协议模板提供方" prop="protocol_provider">
            <el-radio-group v-model="editForm.protocol_provider" @change="onchange">
              <el-radio label="医院"></el-radio>
              <el-radio label="申办方"></el-radio>
              <el-radio label="smo"></el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 医院++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
          <el-form-item  v-if="(editForm.protocol_provider == row.housptal)?checkState:!checkState" >

            <el-form-item label="所属省/市" prop="provincecity" :class="itemclass">
               <v-distpicker  hide-area  @selected="onSelected"    :province="select.province" :city="select.city"  v-model="editForm.provincecity" ></v-distpicker>
               <!-- <el-cascader placeholder="试试搜索：" :options="options"  filterable change-on-select></el-cascader> -->
            </el-form-item>
            <el-form-item label="所属医院" prop="provider_name" :class="itemclass">
              <el-select v-model="editForm.provider_name" placeholder="请选择">
                <el-option v-for="item in provider_name" :key="item.value" :value="item.value" :label="item.label">

                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="指定申办方" prop="provider" :class="itemclass">
              <el-select v-model="editForm.provider" placeholder="请选择">
                <el-option v-for="item in provider" :key="item.value" :label="item.label" :value="item.value">

                </el-option>
              </el-select>
            </el-form-item>

          </el-form-item>





          <!-- 申办方++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
          <el-form-item  v-if="(editForm.protocol_provider == row.applicant)?checkState:!checkState"  >
            <el-form-item label="所属申办方" prop="provider_name" :class="itemclass">
              <el-select v-model="editForm.provider_name" placeholder="请选择">
                <el-option v-for="item in provider" :key="item.value" :label="item.label" :value="item.value">

                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="所属省/市" prop="provincecity" :class="itemclass">
               <v-distpicker  hide-area @selected="onSelected" :province="select.province" :city="select.city"  v-model="editForm.provincecity" ></v-distpicker>
               <!-- <el-cascader placeholder="试试搜索：" :options="options"  filterable change-on-select></el-cascader> -->
            </el-form-item>
            <el-form-item label="指定医院" prop="provider" :class="itemclass">
              <el-select v-model="editForm.provider" placeholder="请选择">
                <el-option v-for="item in provider_name" :key="item.value" :value="item.value" :label="item.label">

                </el-option>
              </el-select>
            </el-form-item>


          </el-form-item>


			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormProtocol = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit"  :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
import { addProtocol,editProtocol,removeProtocol,batchRemoveProtocol,getProtocollist,getHospitalProtocol,getApplicant} from '../../api/api';
import VDistpicker from 'v-distpicker'
 import { Notification } from 'element-ui';
 let uid;
export default {
  data() {
			return {
				filters: {
          name: ''
        },
        row:{
          housptal:"医院",
          applicant:"申办方",
          smo:"smo"
        },
        role:[],
        protocol_province:'',
        protocol_city:'',
        itemclass:"item-children",
        noneclass:"none",
        currentId:'',
        checkState:true,
				protocol: [],
        flag:'',
        provider_name:"",
        provider:"",
        select: {
        //  province: '',
        //  city: '',
        },
        citys: '', // 传给父组件的值
        cityDetails: '', // 详情的内容
        upNum: 0,
        provider_type: 3,
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormProtocol: false,//编辑界面是否显示
				editLoading: false,
				addLoading: false,
        addFormProtocol: false,
        addFormRules: {
					protocol_name: [
						{ required: true, message: '请输入协议模板名称', trigger: 'blur' }
          ],
          protocol_provider:[
             {  required: true, message: '请选择模板提供方', trigger: 'change' }
          ]
          // hospital_name:[
          //   { type:'string',  required: true, message: '请选择所属医院医院', trigger: 'change' }
          // ],
          // applicant_name:[
          //    { type:'string',  required: true, message: '请选择医院指定申办方', trigger: 'change' }
          // ]


				},
        //新增界面数据
				addForm: {
			 	  protocol_name: '',
          protocol_provider: '',
          provincecity:{
         province: '',
         city: '',
        },
          provider_name:"",
          provider:"",
          protocol_province:'',
          protocol_city:''
        },
        //编辑界面数据
				editForm: {
				  protocol_name: '',
          protocol_provider: '',
          provincecity:{
          province: '',
          city: '',
          },
          provider_name:"",
          provider:"",
          protocol_province:'',
          protocol_city:''
				}
      }
    },
    methods:{
        selsChange(){

        },
        formatSex(){

        },
        onSelected(data) {
          console.log(this.editForm.protocol_provider)
          // let array=[]
          this.protocol_province = data.province.value;
          this.protocol_city = data.city.value;
          let para = {
            province: data.province.value,
            city: data.city.value
          };


              getHospitalProtocol(para).then((res) => {

                if(this.row.applicant==this.editForm.protocol_provider){
                  console.log("申办方指定医院");
                    if(res.length==0){
                            // console.log("空")
                            this.editForm.provider ="";
                    }else if(this.provider_name==""){
                            this.provider_name = res;
                    }else if(this.provider_name[0].value != res[0].value){
                        // console.log("清空数据")
                        this.editForm.provider ="";
                  }

                  this.provider_name = res;
                }else{
                  //  console.log("所属医院");
                      if(res.length==0){
                          // console.log("空")
                                this.editForm.provider_name ="";
                        }else if(this.provider_name==""){
                                this.provider_name = res;
                        }else if(this.provider_name[0].value != res[0].value){
                            // console.log("清空数据")
                            this.editForm.provider_name ="";
                      }

                      this.provider_name = res;
                }


            })
        },
        onchange(value){
            this.currentId=value;
            console.log(value)
        },
        handleCurrentChange(val) {
          this.page = val;
          this.getProtocol()
        },
        // 获取协议管理列表
        getProtocol(){
          let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
          let row = JSON.parse(window.localStorage.getItem('row'))
           let para = {
            page: this.page,
            protocolName: this.filters.name,
            menuId:row.id,
            roleId:userInfo.role_id
          };
          this.listLoading = true;
          //NProgress.start();
          getProtocollist(para).then((res) => {
            // console.log(res)
            this.total = res.data.total;
            this.protocol = res.data.dataProtocol;
            this.listLoading = false;
            this.role = res.data.role
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
            this.addFormProtocol = true;
            this.addForm = {
              protocol_name: '',
              protocol_provider: '',
              provincecity:'',
              hospital_name:"",
              applicant_name:"",
              protocol_province:'',
              protocol_city:''
            }
             this.select= {
              province: '',
              city: '',
              }
              console.log(this.currentId)
            // 获取医院指定申办方
            getApplicant().then((res) => {
              // console.log(res);
              this.provider = res.data;
          })
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
                para.protocol_province = this.protocol_province;
                para.protocol_city = this.protocol_city;
                console.log(para)

                // return false;
                addProtocol(para).then(data => {
                  this.addLoading = false;
                  //NProgress.done();
                   let {code, message } = data;


                    // console.log(data)
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
                      this.addFormProtocol = false;
                      this.getProtocol();
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
          uid = row.id;
				  this.editFormProtocol = true;
          this.editForm = Object.assign({}, row);
          // console.log(row)
          this.select.province = row.protocol_province;
          this.select.city = row.protocol_city;
         // 获取医院指定申办方
            getApplicant().then((res) => {
              // console.log(res);
              this.provider = res.data;
          })
          let para ={
            province: row.protocol_province,
            city: row.protocol_city
          }
          //  获取指定医院
          getHospitalProtocol(para).then((res) => {
              this.provider_name = res;
          });
          this.flag=row.provider_name;

        },
        close (){
            this.select = {};
        },
        // 提交编辑后的数据
        editSubmit: function () {
          this.$refs.editForm.validate((valid) => {
            if (valid) {
              this.$confirm('确认提交吗？', '提示', {}).then(() => {
                this.editLoading = true;
                let para = Object.assign({}, this.editForm);
                para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                editProtocol(para).then((res) => {
                  this.editLoading = false;
                  //NProgress.done();
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  });
                  this.$refs['editForm'].resetFields();
                  this.editFormProtocol = false;
                  this.getProtocol();
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
            removeProtocol(para).then((res) => {
              this.listLoading = false;
              //NProgress.done();
              this.$message({
                message: '删除成功',
                type: 'success'
              });
               this.getProtocol();
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
					batchRemoveProtocol(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
					    this.getProtocol();
					});
				}).catch(() => {
				});
			}
    },
    mounted() {
      this.getProtocol();

    },
    components: { VDistpicker }

}
</script>

<style scoped lang="scss">
.el-form-item .item-children{
  margin-bottom: 22px;
}
.none{
  display: none
}
</style>
