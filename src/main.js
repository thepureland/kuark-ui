import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import './assets/css/main.css'
import axios from "axios"
import NProgress from 'nprogress'
import * as ElIconModules from '@element-plus/icons'

axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem("token");
    NProgress.start();
    return config;
});

axios.interceptors.response.use(config => {
    NProgress.done();
    return config;
})

// Vue.prototype.$axios = axios

axios.defaults.baseURL = import.meta.env.VITE_APP_URL

window.ajax = function ({url, method = 'get', params={}}) {
    if (method === 'get') return axios.get(`/${url}`, { params }).then(res => res.data);
    if (method === 'post') return axios.post(`/${url}`, params).then(res => res.data);
    if (method === 'delete') return axios.delete(`/${url}`, {params}).then(res => res.data);
    if (method === 'put') return axios.put(`/${url}`, params).then(res => res.data);
};



const app = createApp(App)

// 统一注册Icon图标
for (const iconName in ElIconModules) {
    if (Reflect.has(ElIconModules, iconName)) {
        const item = ElIconModules[iconName]
        app.component(iconName, item)
    }
}

installElementPlus(app)
app.use(store)
    .use(router)
    .mount('#app')