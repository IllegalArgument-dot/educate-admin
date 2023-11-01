import Vue from 'vue'
import Vuex from 'vuex'
import enumItem from './modules/enumItem'
import exam from './modules/exam'
import app from './modules/app'
import tagsView from "@/store/modules/tagsView";

import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        enumItem,
        exam,
        app,
        tagsView
    },
    getters
})

export default store