import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueResource from 'vue-resource'

import {
	MdButton,
	MdContent,
	MdTabs,
	MdToolbar,
	MdTable,
	MdCard,
	MdRipple,
	MdField,
	MdEmptyState,
	MdIcon,
	MdTooltip,
	MdProgress,
	MdSnackbar,
	MdDialog,
} from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.use(VueResource);

//подключение компонентов Vue-material
Vue.use(MdButton);
Vue.use(MdContent);
Vue.use(MdTabs);
Vue.use(MdToolbar);
Vue.use(MdTable);
Vue.use(MdCard);
Vue.use(MdRipple);
Vue.use(MdField);
Vue.use(MdEmptyState);
Vue.use(MdIcon);
Vue.use(MdTooltip);
Vue.use(MdProgress);
Vue.use(MdSnackbar);
Vue.use(MdDialog);

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');
