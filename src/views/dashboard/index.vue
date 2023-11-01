<template>
  <div class="app-container">
    <el-container>
      <sidebar/>
    </el-container>
  </div>
</template>

<script>

import {defineComponent} from "vue";
import Sidebar from "@/layout/Sidebar/index.vue";

export default defineComponent({
  components: {Sidebar}
})
</script>