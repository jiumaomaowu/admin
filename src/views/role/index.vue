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
					<el-button type="primary" v-on:click="toggleSelection(usermultipleSelection)">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表;-->
		<el-table :data="users" tooltip-effect="dark" ref="multipleTable"  v-loading="listLoading" @select="handleSelectionChange"  :row-key="getRowKeys" style="width: 100%;">
			<el-table-column type="selection" :reserve-selection="true"  width="55" align="center">
			</el-table-column>

			<el-table-column type="index" label="ID" width="60" align="center">
			</el-table-column>

			<el-table-column prop="job_number" label="工号" min-width="80" sortable align="center">
			</el-table-column>

			<el-table-column prop="name" label="姓名" min-width="80" sortable align="center">
			</el-table-column>

			<el-table-column prop="mailbox" label="邮箱" min-width="90" sortable align="center">
			</el-table-column>
		</el-table>
     <!--工具条;-->
		<el-col :span="24" class="toolbar">

			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
	</section>
</template>

<script>

	import { getAdminlist,getUse} from '../../api/api';
  import VDistpicker from 'v-distpicker';
  import store from '@/store'
  import { mapActions, mapGetters } from 'vuex';
  import _ from 'lodash'
  let uid;
  let log = console.log.bind(console);
	export default {
    
		data() {
			return {
				filters: {
          name: '',
          id:''
        },
				users: [],
        multipleSelection:[] ,//保存当前页面选中数据
        usermultipleSelection:[],
        unmultipleSelection:[],//保存 选中的所有数据
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列
        currentPage:[],
        selectedData: [],
        getRowKeys(row) {
            return row.id;
        },
        select_order_number:'',
        select_Id:[]
      };
    },

		methods: {
      ...mapActions([
        'addSelection',
      ]),
        handleCurrentChange(val) {
          this.page = val;

          if(this.allSelection.length>0){
            this.unmultipleSelection = this.allSelection
          }


          this.getAdmin(this.unmultipleSelection);
        },
        handleSelectionChange(rows,index) {
          let Selection = [];
          console.log(rows,index)

          this.unmultipleSelection.forEach(element => {
            if(element.id == index.id){
             this.unmultipleSelection.splice(this.unmultipleSelection.findIndex(item => item.id === index.id), 1)
            }
          })
          let unSelection = Selection.concat(this.unmultipleSelection,rows) // 合并数组
          let obj = {};
          unSelection = unSelection.reduce((cur,next) => {    //数组内对象去重
              obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
              return cur;
          },[])
          this.addSelection(unSelection)
          this.$emit('childByValue',unSelection)

      },
      MergeArray(arr1, arr2){
          let _arr = new Array();
          for (let i = 0; i < arr1.length; i++) {
              if (arr1[i] != "") {
                  _arr.push(arr1[i]);
              }
          }
          for (let i = 0; i < arr2.length; i++) {
              let flag = true;
              for (let j = 0; j < arr1.length; j++) {
                  if (arr2[i].id == arr1[j].id) {
                      flag = false;
                      break;
                  }
              }
              if (flag && arr2[i] != "") {
                  _arr.push(arr2[i]);
              }
          }
          return _arr;
      },
      getAdmin(rows){
          console.log(rows)
          this.addSelection([])
          console.log('vuex',this.allSelection)
          this.unmultipleSelection = Array.from(new Set(rows))
          this.$emit('childByValue',this.unmultipleSelection)
          //获取医院列表
          let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
          let row = JSON.parse(window.localStorage.getItem('row'))
          let para = {
            page: this.page,
            adminName: this.filters.name,
             menuId:row.id,
            roleId:userInfo.role_id
          };
          this.listLoading = true;
          getAdminlist(para).then((res) => {
            this.total = res.data.total;
            this.users = res.data.dataAdmin;
            this.listLoading = false;
            if(rows.length>0){
              rows.forEach(row => {
                this.users.forEach((element,v) => {
                  if(row.id==element.id){
                    // console.log(v)
                    this.$nextTick(() => {
                      this.$refs.multipleTable.toggleRowSelection(this.users[v],true);
                    })
                  }else{
                    // console.log("全部取消")
                    this.$refs.multipleTable.clearSelection();
                  }
                });
              });
            }else{
              this.$refs.multipleTable.clearSelection();
            }






          });
      },
       toggleSelection(rows) {
        //  console.log(rows)
        // this.usermultipleSelection = rows
        //  //获取医院列表s
        //   let para = {
        //     page: this.page,
        //     adminName: this.filters.name,
        //     adminId: this.filters.id
        //   };
        //   this.listLoading = true;
        //   getAdminlist(para).then((res) => {
        //     this.total = res.data.total;
        //     this.users = res.data.dataAdmin;
        //     this.listLoading = false;
        //     rows.forEach(row => {
        //       this.users.forEach((element,v) => {
        //         if(row.id==element.id){
        //           console.log(v)
        //           this.$nextTick(() => {
        //             this.$refs.multipleTable.toggleRowSelection(this.users[v],true);
        //           })
        //         }
        //       });
        //     });
        //   });
      },
    },
    created(){

    },
		mounted() {

    },
    computed:{
      ...mapGetters([
        'allSelection'
      ])
    },
    components: { VDistpicker}

	}

</script>

<style scoped>
  .el-form{

  }
</style>;
