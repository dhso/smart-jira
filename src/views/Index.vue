<template>
  <div class="index">
    <div class="main-header">
      <div class="main-title f-animate" :style="{width:width+'px'}">
        <img class="app-logo" src="../assets/jira.png">
        <span v-if="!collapsed">{{title}}</span>
      </div>
      <div class="main-bar">
        <span class="bar-btn fa fa-bars" @click="toggle"></span>
        <div class="right-bar-btn">
          <el-dropdown>
              <span class="bar-btn">
                <img class="user-avatar" :src="getUser().avatarUrls['16x16']" />
                  {{getUser().displayName}}<i class="fa fa-caret-down ml10"></i>
              </span>
              <el-dropdown-menu class="header-dropdown-panel" slot="dropdown">
                <el-dropdown-item>
                    <span title="sign out" @click="logout"><i class="fa fa-sign-out"></i>Sign Out</span>
                  </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
        </div>
      </div>
    </div>
    <div class="main-layout">
      <div class="sidebar-body f-animate" :style="{width:width+'px'}">
        <SideMenu
          :data="menus"
          :border="false"
          :collapsed="collapsed"
          :multiple="false"
          @itemClick="onItemClick($event)"
        ></SideMenu>
      </div>
      <div class="main-body">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Jira from '@/libs/jira'
export default {
  data() {
    return {
      title: 'Smart JIRA',
      width: 200,
      collapsed: false,
      menus: [
        {
          text: 'Projects',
          iconCls: 'fa fa-archive',
          children: [
            {
              text: 'List All',
              route: 'project_list_all'
            }
          ]
        },
        {
          text: 'Issues',
          iconCls: 'fa fa-bug',
          children: [
            {
              text: 'My Issues',
              route: 'my_issues'
            }
          ]
        },
        {
          text: 'Stories',
          iconCls: 'fa fa-sitemap',
          children: [
            {
              text: 'Create Story',
              route: 'create_story'
            },{
              text: 'Bulk Update',
              route: 'bulk_update'
            }
          ]
        },
        {
          text: 'Boards',
          iconCls: 'fa fa-window-maximize',
          children: [
            {
              text: 'Spring Board',
              route: 'spring_board'
            }
          ]
        }
      ]
    }
  },
  methods: {
    getUser(){
       return this.$storejs.get('user_info')
    },
    toggle() {
      this.collapsed = !this.collapsed
      this.width = this.collapsed ? 50 : 200
    },
    onItemClick(item) {
      this.$router.push({
        name: item.route
      })
    },
    logout() {
      this.$confirm('Are you confirm to sign out?', 'Confirm', {
        confirmButtonText: 'Sign Out',
        cancelButtonText: 'Cancel'
      }).then(() => {
        this.$cookies.remove('user_name')
        this.$storejs.clearAll()
        this.$router.push({
          name: 'login',
          query: {
            logout: 'true'
          }
        })
      })
    }
  },
  async mounted() {
    try {
      // let res = await Jira.http.get(`jira_api/${Jira.apis.myself()}`)
      // this.$storejs.set('user_info',res.data)
    } catch (err) {
      console.log(err)
    }
  }
}
</script>
<style lang="less">
@import './Index.less';
</style>
