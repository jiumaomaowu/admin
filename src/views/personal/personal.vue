<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="80px">
        <el-col :span="14">
            <el-form-item label="用户姓名">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="用户密码">
                <el-input v-model="form.password"  type="password"></el-input>
            </el-form-item>
            <el-form-item label="用户工号">
                <el-input v-model="form.job_number"  type="number"></el-input>
            </el-form-item>
            <el-form-item label="用户头像">
                <el-upload :action= action :before-upload="handleBeforeUpload"  list-type="picture" :data='uploadData' :on-success="handleAvatarSuccess" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img v-if="imageUrl" width="100%" :src="dialogImageUrl" class="avatar" alt>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-dialog>
            </el-form-item>
            
            <el-form-item label="用户性别">
                <el-select v-model="form.gender" placeholder="请选择性别">
                    <el-option label="女" value="0"></el-option>
                    <el-option label="男" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="用户邮箱">
                <el-input v-model="form.mailbox" type="email"></el-input>
            </el-form-item>

            <el-form-item label="手机号码">
                <el-input v-model="form.phone" type="number"></el-input>
            </el-form-item>
             <el-form-item>
                <el-button type="primary" @click.native="editSubmit">完成</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-col>
    </el-form>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { personal, editPersonal } from '@/api/api'
import { mapActions, mapGetters } from 'vuex';
export default {
  data() {
    return {
        form: {
          name: '',
          job_number: '',
          gender: '',
          password: '',
          mailbox: '',         
          phone: '',
          id:''
        },
        action:'api/admin/postImg',
        dialogImageUrl: '',
        dialogVisible: false,
        imageUrl: '',
        uploadData:{
            // url: '', // 图片二进制的data的url
            // articleId: '', // 这个详情的ID 后台与他绑在一起，
            id:''
        }
    }
  },
  methods: {
    editSubmit() {
        this.$refs.form.validate((valid) => {                  
            if (valid) {
              this.$confirm('确认提交吗？', '提示', {}).then(() => {
                let para = Object.assign({}, this.form);
                editPersonal(para).then((res) => {
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  });
                  this.$refs['form'].resetFields();
                  this.getPersonal();
                });
              });
            }
          });
    },
    getPersonal(){
        let para = {
            job_number : getToken()
        }
        personal(para).then((res)=>{
            console.log(res)
            this.form = res.dataPersonal
            this.uploadData.id = this.form.id
        })
    },
     handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
        console.log(this.dialogImageUrl)
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.setAvatar(res)
        
      },
      handleBeforeUpload(file){
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = (e)=> {
            file.url = reader.result;
            // this.uploadData.articleId = this.form.id; 
            // this.uploadData.url = file.url;
            // this.uploadData.id = this.form.id
            // console.log(this.uploadData)
        }
        
      },
       ...mapActions([
        'addMenu',
        'addCount',
        'addUserinfo',
        'loadRoutes',
        'setName',
        'setAvatar'
      ])

  },
  mounted() {
    this.getPersonal();
  },
};
</script>
<style scoped>
.el-select{
 width: 100%;
}
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
