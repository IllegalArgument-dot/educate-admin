import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/question/list'
    },
    {
        path: '/dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: {title: '主页', icon: 'home', affix: true}
    },
    {
        path: '/question/list',
        component: () => import('@/views/exam/question/QuestionList.vue'),
        name: 'ExamQuestionPageList',
        meta: {title: '题目列表', noCache: true}
    },
    {
        path: '/exam/question/edit/singleChoice',
        component: () => import('@/views/exam/question/edit/single-choice.vue'),
        name: 'singleChoicePage',
        meta: {title: '单选题编辑', noCache: true, activeMenu: '/exam/question/list'},
        hidden: false
    }
]

const router = new VueRouter({
    routes
})

export default router
