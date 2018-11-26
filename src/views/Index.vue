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
            <span class="bar-btn fa fa-sign-out" title="sign out" @click="logout"></span>
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
          iconCls: 'fa fa-wpforms',
          children: [
            {
              text: 'List All',
              route: 'project_list_all'
            }
          ]
        },
        {
          text: 'Issues',
          iconCls: 'fa fa-at',
          state: "open",
          children: [
            {
              selected: true,
              text: 'My Issues',
              route: 'my_issues'
            }
          ]
        },
        {
          text: 'Layout',
          iconCls: 'fa fa-table',
          children: [
            {
              text: 'Panel'
            },
            {
              text: 'Accordion'
            },
            {
              text: 'Tabs'
            }
          ]
        }
      ]
    }
  },
  methods: {
    toggle() {
      this.collapsed = !this.collapsed
      this.width = this.collapsed ? 50 : 200
    },
    onItemClick(item) {
      console.log(item)
      this.$router.push({
        name: item.route
      })
    },
    logout(){
      this.$messager.confirm({
        borderType: "none",
        title: "Confirm",
        msg: "Are you confirm to sign out?",
        result: r => {
          if (r) {
            this.$cookies.remove('user_name')
            this.$router.push({
              name: 'login',
              query: {
                logout: 'true'
              }
            })
          }
        }
      })
    }
  },
  async mounted() {
  }
}
</script>
<style lang="less">
@import './Index.less';
</style>
