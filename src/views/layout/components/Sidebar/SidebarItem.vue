<template>
  <div class="menu-wrapper">
    <template v-for="item in routes" v-if="!item.hidden&&item.children">

      <router-link v-if="hasNochildren(item.children) " :to="item.path" :key="item.id">
        <el-menu-item :index="item.path" :class="{'submenu-title-noDropdown':!isNest}">
          <svg-icon v-if="item&&item.icon" :icon-class="item.icon"></svg-icon>
          <span v-if="item&&item.redirect" slot="title">{{generateTitle(item.redirect)}}</span>
        </el-menu-item>
      </router-link>

    <el-submenu v-else :index="item.redirect||item.path" :key="item.id">
        <template slot="title">
          <svg-icon v-if="item.icon" :icon-class="item.icon"></svg-icon>
          <span v-if="item&&item.redirect" slot="title">{{generateTitle(item.redirect)}}</span>
        </template>

        <template v-for="child in item.children" v-if="!child.hidden" >
           
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path">{{child.path}}</sidebar-item>        
         
          <router-link v-else :to="child.path + '?id=' + child.id " :key="child.id">
            <el-menu-item :index="child.path "  @click="handId(child)">
              <svg-icon v-if="child&&child.icon" :icon-class="child.icon"></svg-icon>
              <span v-if="child&&child.childname" slot="title" >{{generateTitle(child.childname)}}</span>
            </el-menu-item>
          </router-link>
        </template> 
      </el-submenu> 

    </template>
    <template v-for="item in routes" v-if="!item.hidden&&!item.children.length<0">

    </template>
  </div>
</template>

<script>
import { generateTitle } from '@/utils/i18n'
  import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      onlyOneChild: null
    }
  },
  methods: {
    handId(child){
      
      // this.setRow(child)
     
    },
    hasNochildren(children) {
    //  console.log(children)
      const noChildren = children.filter(item => {

        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // // When there is only one child router, the child router is displayed by default
      if (noChildren.length === 0) {
        return true
      }

      // // Show parent if there are no child router to display
      // if (showingChildren.length === 0) {
      //   this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
      //   return true
      // }

      return false
    },
    ...mapActions([
        'setRow'

      ]),
    generateTitle
  },
  	mounted() {
    //  console.log('刷新')
    },
}
</script>

