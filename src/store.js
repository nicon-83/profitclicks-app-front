import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		snackBar: {
			showSnackbar: false,
			position: 'center',
			duration: 4000,
			isInfinity: false,
			snackText: ''
		},
		store_users: []
	},
	getters: {
		storeUsers: state => {
			return state.store_users;
		},
	},
	mutations: {
		set(states, {type, data}) {
			states[type] = data;
		},
		setField(states, {type, field, data}) {
			states[type][field] = data;
		},
		set_users: (state, data) => {
			state.store_users = data;
		}
	},
	actions: {
		/* Блок снекбара */
		showSnackBar({commit}, data) {
			const snackBarData = {
				showSnackbar: data['showSnackbar'] ? data['showSnackbar'] : true,
				position: data['position'] ? data['position'] : 'center',
				duration: data['duration'] ? data['duration'] : 4000,
				isInfinity: data['isInfinity'] ? data['isInfinity'] : false,
				snackText: data['snackText']
			};
			commit('set', {type: 'snackBar', data: snackBarData})
		},
		hideSnackbar({commit}) {
			commit('setField', {type: 'snackBar', field: 'showSnackbar', data: false})
		},

		async get_users({commit}, data) {
			try {
				const response = await Vue.http.get("https://profitclicksapi.azurewebsites.net/api/user");
				commit('set_users', response.body);
			} catch (error) {
				console.error(error);
				store.dispatch('showSnackBar', {snackText: error.message});
			}
		}
	}
})
