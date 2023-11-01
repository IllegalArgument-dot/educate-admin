<template>
  <div style="line-height:1.8">
    <!-- 单选题 -->
    <div v-if="qType==1" v-loading="qLoading">
      <div class="q-title" v-html="question.title"/>
      <div class="q-content">
          <span :key="item.id" v-for="item in question.items" class="q-item-contain">
            <span class="q-item-prefix">{{ item.prefix }}.</span>
            <span v-html="item.content" class="q-item-content"></span>
          </span>
      </div>
    </div>
    <!-- 多选题 -->
    <div v-else-if="qType==2" v-loading="qLoading">
      <div class="q-title" v-html="question.title"/>
      <div class="q-content">
          <span :key="item.id" v-for="item in question.items" class="q-item-contain">
            <span class="q-item-prefix">{{ item.prefix }}</span>
            <span v-html="item.content" class="q-item-content"></span>
          </span>
      </div>
    </div>
    <!-- 判断题 -->
    <div v-else-if="qType==3" v-loading="qLoading">
      <div class="q-title" v-html="question.title" style="display: inline;margin-right: 10px"/>
      <span>（</span>
      <span :key="item.id" v-for="item in question.items">
        <span v-html="item.content" class="q-item-content"></span>
       </span>
      <span>）</span>
    </div>
    <!-- 填空题 -->
    <div v-else-if="qType==4" v-loading="qLoading">
      <div class="q-title" v-html="question.title"/>
    </div>
    <!-- 简答题 -->
    <div v-else-if="qType==5" v-loading="qLoading">
      <div class="q-title" v-html="question.title"/>
    </div>
    <div v-else>
    </div>
  </div>

</template>

<script>
export default {
  name: 'QuestionShow',
  props: {
    question: {
      type: Object,
      default: function () {
        return {}
      }
    },
    qLoading: {
      type: Boolean,
      default: false
    },
    qType: {
      type: Number,
      default: 0
    }
  },
  methods: {}
}
</script>

<style>
.q-item-prefix, .q-item-content {
  display: inline-block;
}

.q-item-contain {
  margin-right: 10px;
}
</style>
