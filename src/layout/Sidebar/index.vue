<template>
  <el-aside width="210px">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
          default-active="1"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          class="el-menu-vertical-demo">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-house"></i>
            <span slot="title">
              <router-link class="router-link" to="/dashboard">主页</router-link>
            </span>
          </template>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-user-solid"></i>
            <span slot="title">用户管理</span>
          </template>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-document"></i>
            <span slot="title">卷题管理</span>
          </template>
          <el-menu-item>试卷列表</el-menu-item>
          <el-menu-item>
            <router-link class="router-link" to="/question/list">题目列表</router-link>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span slot="title">任务管理</span>
          </template>
        </el-submenu>
        <el-submenu index="5">
          <template slot="title">
            <i class="el-icon-reading"></i>
            <span slot="title">教育管理</span>
          </template>
        </el-submenu>
        <el-submenu index="6">
          <template slot="title">
            <i class="el-icon-chat-dot-round"></i>
            <span slot="title">成绩管理</span>
          </template>
        </el-submenu>
        <el-submenu index="7">
          <template slot="title">
            <i class="el-icon-message"></i>
            <span slot="title">消息中心</span>
          </template>
        </el-submenu>
        <el-submenu index="8">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span slot="title">日志中心</span>
          </template>
        </el-submenu>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script>

export default {
  name: 'Sidebar',
  computed: {},
  methods: {}
}
</script>

<style>
.router-link {
  color: #bfcbd9;
  text-decoration: none;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: left;
  line-height: 200px;
}

</style>