<template>
  <div id="app">
    <router-view></router-view>
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'app',
  data() {
    return {}
  },
  computed: {
    ...mapState({
      loading: state => state.app.loading
    })
  },
  mounted() {
    //  [App.vue specific] When App.vue is finish loading finish the progress bar
    this.$Progress.finish()
  },
  created() {
    //  [App.vue specific] When App.vue is first loaded start the progress bar
    this.$Progress.start()
  },
  watch: {
    loading: function(val, oldVal) {
      switch (val.state) {
        case 'start':
          this.$Progress.start()
          break
        case 'finish':
          this.$Progress.finish()
          break
      }
    }
  }
}
</script>

<style lang="less">
@import 'https://netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css';
@import './App.less';
</style>
