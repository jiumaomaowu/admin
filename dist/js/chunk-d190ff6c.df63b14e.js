(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-d190ff6c"],{"3a4d":function(e,a,t){"use strict";var o=t("9702"),l=t.n(o);l.a},9702:function(e,a,t){},ff23:function(e,a,t){"use strict";t.r(a);var o=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"app-container"},[t("el-form",{ref:"form",attrs:{model:e.form,"label-width":"80px"}},[t("el-col",{attrs:{span:14}},[t("el-form-item",{attrs:{label:"用户姓名"}},[t("el-input",{model:{value:e.form.name,callback:function(a){e.$set(e.form,"name",a)},expression:"form.name"}})],1),t("el-form-item",{attrs:{label:"用户密码"}},[t("el-input",{attrs:{type:"password"},model:{value:e.form.password,callback:function(a){e.$set(e.form,"password",a)},expression:"form.password"}})],1),t("el-form-item",{attrs:{label:"用户工号"}},[t("el-input",{attrs:{type:"number"},model:{value:e.form.job_number,callback:function(a){e.$set(e.form,"job_number",a)},expression:"form.job_number"}})],1),t("el-form-item",{attrs:{label:"用户头像"}},[t("el-upload",{attrs:{action:e.action,"before-upload":e.handleBeforeUpload,"list-type":"picture",data:e.uploadData,"on-success":e.handleAvatarSuccess,"on-preview":e.handlePictureCardPreview,"on-remove":e.handleRemove}},[t("i",{staticClass:"el-icon-plus"})]),t("el-dialog",{attrs:{visible:e.dialogVisible},on:{"update:visible":function(a){e.dialogVisible=a}}},[e.imageUrl?t("img",{staticClass:"avatar",attrs:{width:"100%",src:e.dialogImageUrl,alt:""}}):t("i",{staticClass:"el-icon-plus avatar-uploader-icon"})])],1),t("el-form-item",{attrs:{label:"用户性别"}},[t("el-select",{attrs:{placeholder:"请选择性别"},model:{value:e.form.gender,callback:function(a){e.$set(e.form,"gender",a)},expression:"form.gender"}},[t("el-option",{attrs:{label:"女",value:"0"}}),t("el-option",{attrs:{label:"男",value:"1"}})],1)],1),t("el-form-item",{attrs:{label:"用户邮箱"}},[t("el-input",{attrs:{type:"email"},model:{value:e.form.mailbox,callback:function(a){e.$set(e.form,"mailbox",a)},expression:"form.mailbox"}})],1),t("el-form-item",{attrs:{label:"手机号码"}},[t("el-input",{attrs:{type:"number"},model:{value:e.form.phone,callback:function(a){e.$set(e.form,"phone",a)},expression:"form.phone"}})],1),t("el-form-item",[t("el-button",{attrs:{type:"primary"},nativeOn:{click:function(a){return e.editSubmit(a)}}},[e._v("完成")]),t("el-button",[e._v("取消")])],1)],1)],1)],1)},l=[],r=t("e4a7"),n=t.n(r),i=t("a98d"),s=t("5f87"),c=t("4ec3"),m=t("52c1"),u={data:function(){return{form:{name:"",job_number:"",gender:"",password:"",mailbox:"",phone:"",id:""},action:"api/admin/postImg",dialogImageUrl:"",dialogVisible:!1,imageUrl:"",uploadData:{id:""}}},methods:Object(i["a"])({editSubmit:function(){var e=this;this.$refs.form.validate(function(a){a&&e.$confirm("确认提交吗？","提示",{}).then(function(){var a=n()({},e.form);Object(c["q"])(a).then(function(a){e.$message({message:"提交成功",type:"success"}),e.$refs["form"].resetFields(),e.getPersonal()})})})},getPersonal:function(){var e=this,a={job_number:Object(s["a"])()};Object(c["H"])(a).then(function(a){console.log(a),e.form=a.dataPersonal,e.uploadData.id=e.form.id})},handleRemove:function(e,a){console.log(e,a)},handlePictureCardPreview:function(e){this.dialogImageUrl=e.url,this.dialogVisible=!0,console.log(this.dialogImageUrl)},handleAvatarSuccess:function(e,a){this.imageUrl=URL.createObjectURL(a.raw),this.setAvatar(e)},handleBeforeUpload:function(e){var a=new FileReader;a.readAsDataURL(e),a.onloadend=function(t){e.url=a.result}}},Object(m["b"])(["addMenu","addCount","addUserinfo","loadRoutes","setName","setAvatar"])),mounted:function(){this.getPersonal()}},d=u,f=(t("3a4d"),t("17cc")),p=Object(f["a"])(d,o,l,!1,null,"79dfb566",null);a["default"]=p.exports}}]);
//# sourceMappingURL=chunk-d190ff6c.df63b14e.js.map