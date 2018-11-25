<template>
  <div class="index">
    <div class="f-column">
      <div class="main-header f-row">
        <div class="f-row f-full">
          <div class="main-title f-animate f-row" :style="{width:width+'px'}">
            <img class="app-logo" src="../assets/jira.png">
            <span v-if="!collapsed">{{title}}</span>
          </div>
          <div class="main-bar f-full">
            <span class="main-toggle fa fa-bars" @click="toggle()"></span>
          </div>
        </div>
      </div>
      <div class="f-row f-full">
        <div class="sidebar-body f-animate" :style="{width:width+'px'}">
          <SideMenu
            :data="menus"
            :border="false"
            :collapsed="collapsed"
            :multiple="false"
            @itemClick="onItemClick($event)"
          ></SideMenu>
        </div>
        <div class="main-body f-full">
          <router-view></router-view>
        </div>
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
          state: 'open',
          children: [
            {
              text: 'List All',
              route: 'project_list_all'
            },
            {
              text: 'Wizard'
            },
            {
              text: 'File Upload'
            }
          ]
        },
        {
          text: 'Mail',
          iconCls: 'fa fa-at',
          selected: true,
          children: [
            {
              text: 'Inbox'
            },
            {
              text: 'Sent'
            },
            {
              text: 'Trash',
              children: [
                {
                  text: 'Item1'
                },
                {
                  text: 'Item2'
                }
              ]
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
    }
  },
  async mounted() {
    try {
      let res = await Jira.http.get(`jira_api/${Jira.apis.issue('PROJ-1')}`)
      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }
}
</script>
<style lang="less">
@import './Index.less';
</style>
