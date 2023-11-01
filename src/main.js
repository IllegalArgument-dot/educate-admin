import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'


Vue.use(Element, {
    size: 'medium' // set element-ui default size
})
Vue.config.productionTip = false // 关闭生产环境的提示信息

NProgress.configure({showSpinner: false}) // NProgress Configuration

router.beforeEach(async (to, from, next) => {
    // start progress bar
    NProgress.start()
    if (to.meta.title !== undefined) {
        document.title = to.meta.title
    } else {
        document.title = '\u200E'
    }
    // store.commit('router/initRoutes')

    if (to.path) {
        // eslint-disable-next-line no-undef
        _hmt.push(['_trackPageview', '/#' + to.fullPath])
    }

    next()
})

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})

Vue.prototype.$$router = router

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')