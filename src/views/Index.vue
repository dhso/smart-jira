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
              <!-- <img class="user-avatar" :src="getUserAvatar()"> -->
              {{userName}}
              <i class="fa fa-caret-down ml10"></i>
            </span>
            <el-dropdown-menu class="header-dropdown-panel" slot="dropdown">
              <el-dropdown-item>
                <span title="sign out" @click="logout">
                  <i class="fa fa-sign-out"></i>Sign Out
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="main-layout">
      <div class="sidebar-body f-animate" :style="{width:width+'px'}">
        <SideMenu
          :data="sideMenus"
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
      userName: this.$storejs.get('user_name'),
      menus: [
        {
          text: 'Stories',
          iconCls: 'fa fa-sitemap',
          children: [
            {
              text: 'Create Story',
              route: 'create_story'
            },
            {
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
              text: 'Sprint Board',
              route: 'sprint_board'
            },
            {
              text: 'Sprint Bug Summary',
              route: 'sprint_bug_summary'
            }
          ]
        }
      ]
    }
  },
  computed: {
    sideMenus: function() {
      for (let menu of this.menus) {
        for (let menu_children of menu.children) {
          if (menu_children.route === this.$route.name) {
            menu.state = 'open'
            break
          }
        }
      }
      return this.menus
    }
  },
  methods: {
    getUserAvatar() {
      return Jira.fixHost(this.userInfo.avatarUrls['24x24'])
    },
    toggle() {
      this.collapsed = !this.collapsed
      this.width = this.collapsed ? 50 : 200
      this.$storejs.set('ui_sidemenu_collapsed', this.collapsed)
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
      })
        .then(() => {
          this.$cookies.remove('user_name')
          this.$storejs.clearAll()
          this.$router.push({
            name: 'login',
            query: {
              logout: 'true'
            }
          })
        })
        .catch(() => {})
    }
  },
  async mounted() {
    setTimeout(() => {
      // init sidemenu and collapse status
      let menuElements = document.querySelectorAll(
        '.sidemenu .accordion .panel .accordion-body .tree .tree-title'
      )
      for (let menuElement of menuElements) {
        if (menuElement.innerText === this.$route.meta.name) {
          let _parentNode = menuElement.parentNode
          if (_parentNode.fireEvent) {
            _parentNode.fireEvent('click')
          } else {
            let htmlEvents = document.createEvent('HTMLEvents')
            htmlEvents.initEvent('click', false, true)
            _parentNode.dispatchEvent(htmlEvents)
          }
          break
        }
      }
      this.collapsed = this.$storejs.get('ui_sidemenu_collapsed') || false
      this.width = this.collapsed ? 50 : 200
    }, 200)
  }
}
</script>
<style lang="less">
@import './Index.less';
</style>
