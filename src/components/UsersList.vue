<template>

		<div>
				<!-- модальное окно для добавления телефона -->
				<md-dialog :md-active.sync="showAddPhoneWindowDialog" :md-click-outside-to-close="false">
						<addPhoneWindow :dataObj="{user: userForModal}"
						                @closeAddPhoneWindow="showAddPhoneWindowDialog = false"
						                @updateData="updateData()"
						></addPhoneWindow>
				</md-dialog>

				<md-toolbar class="md-dense" style="text-align: left;background-color: lightblue;margin-bottom: 10px;">
						<h1 class="md-title">Список Контактов</h1>
				</md-toolbar>

				<div style="min-height: 5px;max-height: 5px;margin: 5px 0 0 0;">
						<md-progress-bar md-mode="indeterminate" v-show="loading"></md-progress-bar>
				</div>

				<md-table v-model="usersFiltered" :md-height.sync="tableHeight" md-card md-fixed-header>

						<md-table-toolbar class="md-dense">
								<div style="display: flex;align-items: center;">
										<md-button class="md-dense md-primary md-raised"
										           style="min-width: 120px;margin-right: 20px;font-size: 0.6rem;"
										           @click="$router.push({path: '/create'})"
										>
												Добавить контакт
										</md-button>
										<md-field style="min-width: 300px;" md-clearable>
												<label style="font-size: 0.7rem;">Имя, телефоны</label>
												<md-input placeholder="Поиск..." v-model.trim.lazy="filter" @input="filterUsers()" md-dense></md-input>
										</md-field>
								</div>
						</md-table-toolbar>

						<md-table-empty-state md-label="Контакты не найдены" md-description v-if="!loading"></md-table-empty-state>

						<md-table-row slot="md-table-row" slot-scope="{ item }">
								<md-table-cell md-label="id">{{ item.Id }}</md-table-cell>
								<md-table-cell md-label="Имя">{{ item.LastName }} {{item.FirstName}} {{item.MiddleName}}</md-table-cell>
								<md-table-cell md-label="Телефоны">
										<ul style="list-style: none;padding: 0;margin-bottom: 0;">
												<li style="margin: 5px 0;" v-for="phone of item.Phones" :key="phone.Id">
														<span>{{phone.Number}}</span>
														<span class="delete-number" style="margin-left: 15px;font-size: 15px;" @click="deleteNumber(phone)">
																&times;
																<md-tooltip md-direction="top" md-delay="500">Удалить номер</md-tooltip>
														</span>
												</li>
										</ul>
										<md-button style="font-size: 0.7rem;margin: 0;" class="md-dense md-primary" @click="addPhone(item)">
												Добавить
												<md-tooltip md-direction="top" md-delay="500">Добавить телефон</md-tooltip>
										</md-button>
								</md-table-cell>
								<md-table-cell md-label="Действия">
										<md-button style="font-size: 0.7rem;margin: 0;" class="md-icon-button md-dense md-primary" @click="updateUser(item)">
												<md-icon>edit</md-icon>
												<md-tooltip md-direction="top" md-delay="500">Редактировать контакт</md-tooltip>
										</md-button>
										<md-button style="font-size: 0.7rem;margin: 0;" class="md-icon-button md-dense md-accent" @click="deleteUser(item)">
												<md-icon>delete</md-icon>
												<md-tooltip md-direction="top" md-delay="500">Удалить контакт</md-tooltip>
										</md-button>
								</md-table-cell>
						</md-table-row>
				</md-table>
		</div>

</template>

<script>
	import addPhoneWindow from './addPhoneWindow';
	import {mapGetters} from "vuex";

	export default {
		name: "UsersList",
		components: {addPhoneWindow},
		data: () => ({
			tableHeight: 700,
			usersFiltered: [],
			filter: '',
			loading: true,
			showAddPhoneWindowDialog: false,
			userForModal: {}
		}),
		computed: {
			...mapGetters(['storeUsers'])
		},
		methods: {
			async updateData() {
				return new Promise((async (resolve, reject) => {
					try {
						await this.$store.dispatch('get_users');
						this.usersFiltered = [...this.storeUsers];
						resolve();
					} catch (error) {
						console.error(error);
						this.$store.dispatch('showSnackBar', {snackText: error.message});
						reject();
					} finally {
						this.loading = false;
					}
				}));
			},
			async filterUsers() {
				this.loading = true;
				// await new Promise((resolve => {
				// 	setTimeout(() => {
				// 		resolve()
				// 	}, 1000);
				// }));
				this.usersFiltered = this.storeUsers.filter(user => {
					const userPhones = user.Phones.map(phone => phone.Number).join(' ');
					const str = `${user.FirstName} ${user.LastName} ${user.MiddleName} ${userPhones}`.toLocaleLowerCase();
					return str.indexOf(this.filter.toLocaleLowerCase()) !== -1;
				});
				this.loading = false;
			},
			async addPhone(user) {
				this.userForModal = {...user};
				this.showAddPhoneWindowDialog = true;
			},
			async deleteUser(user) {
				try {
					this.loading = true;
					const response = await this.$http.delete(`https://profit-clicks.herokuapp.com/api/user/${user.Id}`);
					if (response.data.statusCode > 200) {
						console.error(response.data.reasonPhrase);
						this.$store.dispatch("showSnackBar", {snackText: response.data.reasonPhrase});
						return;
					}
				} catch (error) {
					console.error(error);
					this.$store.dispatch('showSnackBar', {snackText: error.message});
				} finally {
					this.loading = false;
					window.dispatchEvent(new Event('resize'));
				}
				this.$store.dispatch("showSnackBar", {snackText: 'Пользователь удален'});
				await this.updateData();
			},
			updateUser(user) {
				this.$router.push({path: `/update/${user.Id}`});
			},
			async deleteNumber(phone) {
				try {
					this.loading = true;
					const response = await this.$http.delete(`https://profit-clicks.herokuapp.com/api/phone/${phone.Id}`);
					if (response.data.statusCode > 200) {
						console.error(response.data.reasonPhrase);
						this.$store.dispatch("showSnackBar", {snackText: response.data.reasonPhrase});
						return;
					}
				} catch (error) {
					console.error(error);
					this.$store.dispatch('showSnackBar', {snackText: error.message});
				} finally {
					this.loading = false;
				}
				this.$store.dispatch("showSnackBar", {snackText: 'Номер удален'});
				await this.updateData();
			}
		},
		created() {

		},
		async mounted() {
			await this.updateData();
		}
	}
</script>

<style scoped>
		.delete-number:hover {
				color: red;
				cursor: pointer;
		}

</style>

<style>
		.md-table-fixed-header {
				width: 100%;
		}

		.md-table-cell-container {
				text-align: left;
		}
</style>
