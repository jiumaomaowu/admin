
'use strict'
import Vue from 'vue'
import { generateTitle } from '@/utils/en'

export default function treeToArray (data, expandAll, parent = null, level = null) {

  let tmp = []
  Array.from(data).forEach(function (record) {
    if (record._expanded === undefined) {
      Vue.set(record, '_expanded', expandAll)
    }
    let _level = 1
    if (level !== undefined && level !== null) {
      _level = level + 1
    }
    if(_level === 1){

      Vue.set(record, 'isIndeterminate', record.isIndeterminate?record.isIndeterminate:false)
      Vue.set(record, 'checkAll', record.checkAll?record.checkAll:false)
      Vue.set(record, 'checked', false)
      if(record.children.length>0){
        Vue.set(record, 'act', '全选')
      }
    }
    Vue.set(record, '_level', _level)
    // 如果有父元素
    if (parent) {
      Vue.set(record, 'parent', parent)
    }
    tmp.push(record)
    if(record.children && record.children.length === 0){
      // let son =[]
      //   record.sonData.forEach(element => {
      //     let obj ={}
      //     obj.label = element
      //     obj.value = record.id+'_'+element
      //     son.push(obj)
      //   })
      //     console.log(son)
      // let sonData = [
      //   // {
      //   //   'description': '浏览',
      //   //   'id':record.id+"_view",
      //   // },{
      //   //   'description': '新增',
      //   //   'id':record.id+"_add",
      //   // },{
      //   //   'description': '编辑',
      //   //   'id':record.id+"_edit",
      //   // },{
      //   //   'description': '删除',
      //   //   'id':record.id+"_delete",
      //   // }
      //   // ,{
      //   //   'type':Number(record._level)+1,
      //   //   'description': '添加权限',
      //   //   'parentId': record.id,
      //   //   'checked': false,
      //   //   'id':record.id+"_pression",
      //   //   'hidden':false
      //   // },{
      //   //   'type':Number(record._level)+1,
      //   //   'description': '添加用户',
      //   //   'parentId': record.id,
      //   //   'checked': false,
      //   //   'id':record.id+"_admin",
      //   //   'hidden':false
      //   // }

      // ]

      // Vue.set(record, 'sonData', sonData)
      Vue.set(record, 'checked', false)
      Vue.set(record, 'checkAll', record.checkAll?record.checkAll:false)
      Vue.set(record, 'isIndeterminate', record.isIndeterminate?record.isIndeterminate:false)

      Vue.set(record,'selectchecked',record.selectchecked?record.selectchecked:[])
    }
    if (record.children && record.children.length > 0) {
      const children = treeToArray(record.children, expandAll, record, _level)
      tmp = tmp.concat(children)
    }
  })
  return tmp
}
