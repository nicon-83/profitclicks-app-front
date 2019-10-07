import Vue from 'vue'
import Router from 'vue-router'
import UsersList from './components/UsersList'
import UserProfile from './components/UserProfile'
import NotFound from './components/NotFound'

Vue.use(Router);

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'UsersList',
			component: UsersList
		},
		{
			path: '/create',
			name: 'createUser',
			component: () => import('./components/UserProfile.vue')
		},
		{
			path: '/update/:id/',
			name: 'updateUser',
			component: () => import('./components/UserProfile.vue')
		},

		/* 404 */
		{
			path: '/404',
			name: '404',
			component: () => import('./components/NotFound.vue'),
			meta: {
				title: 'Ошибка 404: Страница не найденна'
			}
		},
		{
			path: '*',
			redirect: '/404'
		}
	]
})
