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
					<el-button type="primary" v-on:click="getBlogs">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd($event)">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表;-->
		<el-table :data="blog" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" :selectable='checkboxInit' width="55" align="center">
			</el-table-column>

			<el-table-column type="index" label="ID" width="60" align="center">
			</el-table-column>

			<el-table-column prop="title" label="标题" min-width="120" :show-overflow-tooltip="true" sortable align="center">
			</el-table-column>

			<el-table-column prop="description" label="描述" min-width="120"  :show-overflow-tooltip="true" sortable align="center">
			</el-table-column>

            <el-table-column prop="pub_time" label="发布时间" min-width="120" sortable align="center">
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
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="5" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

    <!-- 新增界面; -->
  <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="120px"   ref="addForm">
          <el-form-item label="标题" prop="title" :show-overflow-tooltip="true">
            <el-input v-model="addForm.title" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="描述" prop="description" :show-overflow-tooltip="true">
             
               <el-input type="textarea" v-model="addForm.description"></el-input>
          </el-form-item>
          <el-form-item label="标签" prop="tags" >
             
            <el-select v-model="addForm.tags"  multiple filterable  allow-create default-first-option  size="medium" placeholder="请选择权限按钮">

             <el-option v-for="item in options" :key="item.label" :label="item.label" :value="item.value"></el-option>
            </el-select>
          
          </el-form-item>
        <el-form-item label="文章内容" prop="content">
              <MarkDown  autoSave  :initialValue="addForm.content"  @on-save="handleSave"/>
          </el-form-item>
        
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>
<!--编辑界面;-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px"  ref="editForm">
			 <el-form-item label="标题" prop="title">
                <el-input v-model="editForm.title" auto-complete="off"></el-input>
            </el-form-item>

            <el-form-item label="描述" prop="description">
                
                <el-input type="textarea" v-model="editForm.description"></el-input>
            </el-form-item>
          <el-form-item label="标签" prop="tags" >
             
            <el-select v-model="editForm.tags"  multiple filterable  allow-create default-first-option  size="medium" placeholder="请选择权限按钮">

             <el-option v-for="item in options" :key="item.label" :value="item.value"></el-option>
            </el-select>
          
          </el-form-item>
            <el-form-item label="文章内容" prop="content">
                <MarkDown  autoSave :initialValue="editForm.content"  @on-save="handleSave"/>
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
	import { addBlog, getBlog, editBlog, removeBlog, batchRemoveBlog, markDown} from '../../api/api';
  import VDistpicker from 'v-distpicker';
    import { mapActions, mapGetters } from 'vuex';
    import MarkDown from 'vue-meditor'
  let province;

  let uid;
  const config = {
        print:false // 隐藏掉打印功能
    }
	export default {
		data() {
			return {
				filters: {
          name: '',
          id:'',
         
        }, 
        blog: [],
        content:'',
        tags:[],
        options:[
          {
            label:'请选择',
            value:'请选择'
          }
        ],
        total: 0,
        page: 1,
        listLoading: false,
        sels: [],//列表选中列
        role:'',
        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        addLoading: false,
        addFormVisible: false,
        articleCont:'',
        addFormRules:[],
        //新增界面数据
		  addForm: {
		    title: '',
        description: '',
		    content: '',
         tags:[]
        },
        //编辑界面数据
      editForm: {
        title: '',
        description: '',
        content: '',
        tags:[]
      },
    };
		},
		methods: {
        selsChange(){

        },
        formatSex(){

        },
        // markdown数据
        handleSave(data){
          // console.log(data,"markdown里面的数据")
            this.articleCont = data.markdownValue
            // this.editForm.content = data.markdownValue
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

        handleCurrentChange(val) {
          this.page = val;
          this.getBlogs();
        },
        //获取医院列表
        getBlogs() {
        let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
          let row = JSON.parse(window.localStorage.getItem('row'))
          let para = {
            page: this.page,
            blogName: this.filters.name,
            menuId:row.id,
            roleId:userInfo.role_id
          };
          this.listLoading = true;
          getBlog(para).then((res) => {
            console.log(res);
            this.total = res.total;
            this.blog = res.blog
            this.role = res.role
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
                title: '',
                description: '',
                content: '',
                tags:[]
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
                this.addForm.content = this.articleCont
                 let para =  Object.assign({}, this.addForm);
                console.log(para);
                // return false;
                addBlog(para).then(data => {
                  this.addLoading = false;
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
                      this.getBlogs();
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
          let para = {
            id :row.id
          }
          console.log(row)
          markDown(para).then((res) =>{
              // console.log(res)
              this.editForm.content = res.content
          })
          this.editForm = Object.assign({}, row);
          

        },
        //提交编辑后的数据
        editSubmit: function () {
          this.$refs.editForm.validate((valid) => {
            if (valid) {
              this.$confirm('确认提交吗？', '提示', {}).then(() => {
                this.editLoading = true;
                //NProgress.start();
                this.editForm.content = this.articleCont 
                let para = Object.assign({}, this.editForm);
                console.log(para);
              //  return false;
                editBlog(para).then((res) => {
                  this.editLoading = false;
                  //NProgress.done();
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  });
                  this.$refs['editForm'].resetFields();
                  this.editFormVisible = false;
                  this.getBlogs();
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
            removeBlog(para).then((res) => {
              this.listLoading = false;
              //NProgress.done();
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getBlogs();
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
					batchRemoveBlog(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
					      this.getBlogs();
					});
				}).catch(() => {
				});
			}


		},
	mounted() {
        this.getBlogs()

    },
     computed: {
        ...mapGetters([
        'row',
      ])
     },
    components: { 
        VDistpicker,
        MarkDown 
    }

	}

</script>

<style scoped>
  .el-form{

  }
</style>;
