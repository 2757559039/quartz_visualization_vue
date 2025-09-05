import { createStore } from 'vuex';

const state = {
    // 动态后端地址,页面刷新防丢失
    baseURL: localStorage.getItem('baseURL') || import.meta.env.VITE_API_BASE_URL
};

const getters = {
    getBaseURL: (state) => state.baseURL
};

const mutations = {
    setBaseURL: (state, newIP) => {
        state.baseURL = newIP;
        localStorage.setItem('baseURL', newIP);
    }
};

const actions = {
    updateBaseURL({ commit }, newIP) {
        commit('setBaseURL', newIP);
    }
};

const store = createStore({
    state,
    getters,
    mutations,
    actions
});

export default store;