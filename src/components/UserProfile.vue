<template>
		<div>

				<md-toolbar v-if="!userId" class="md-dense" style="text-align: left;background-color: lightblue;margin-bottom: 10px;">
						<h1 class="md-title">Добавление контакта</h1>
				</md-toolbar>
				<md-toolbar v-else class="md-dense" style="text-align: left;background-color: lightblue;margin-bottom: 10px;">
						<h1 class="md-title">Редактирование контакта</h1>
				</md-toolbar>

				<div style="width: 500px;margin: auto;">
						<md-card>
								<md-card-content>
										<md-field :class="lastNameClass" @md-clear="lastNameHasErrors = false" md-clearable>
												<label>Фамилия</label>
												<md-input
																placeholder="Фамилия"
																v-model.trim.lazy="lastName"
																@change="validateInputs()"
												></md-input>
												<span class="md-error">Поле заполнено неверно</span>
										</md-field>
										<md-field :class="firstNameClass" @md-clear="firstNameHasErrors = false" md-clearable>
												<label>Имя</label>
												<md-input
																placeholder="Имя"
																v-model.trim.lazy="firstName"
																@change="validateInputs()"
												></md-input>
												<span class="md-error">Поле заполнено неверно</span>
										</md-field>
										<md-field :class="middleNameClass" @md-clear="middleNameHasErrors = false" md-clearable>
												<label>Отчество</label>
												<md-input
																placeholder="Отчество"
																v-model.trim.lazy="middleName"
																@change="validateInputs()"
												></md-input>
												<span class="md-error">Поле заполнено неверно</span>
										</md-field>
								</md-card-content>

								<md-card-actions>
										<md-button class="md-dense md-primary"
										           :disabled="lastNameHasErrors || firstNameHasErrors || middleNameHasErrors || !lastName || !firstName || !middleName"
										           @click="save()"
										           v-if="!userId"
										>
												Сохранить
										</md-button>
										<md-button class="md-dense md-primary"
										           :disabled="lastNameHasErrors || firstNameHasErrors || middleNameHasErrors || !lastName || !firstName || !middleName"
										           @click="update(userId)"
										           v-else
										>
												Сохранить
										</md-button>
										<md-button class="md-dense md-accent" @click="$router.push({path: '/'})">Вернуться к списку контактов</md-button>
								</md-card-actions>
						</md-card>
				</div>
		</div>
</template>

<script>
	import {mapGetters} from "vuex";

	export default {
		name: "UserProfile",
		data: () => ({
			lastName: '',
			firstName: '',
			middleName: '',
			lastNameHasErrors: false,
			firstNameHasErrors: false,
			middleNameHasErrors: false,
			userId: undefined
		}),
		computed: {
			...mapGetters(['storeUsers']),
			lastNameClass() {
				return {
					'md-invalid': this.lastNameHasErrors
				}
			},
			firstNameClass() {
				return {
					'md-invalid': this.firstNameHasErrors
				}
			},
			middleNameClass() {
				return {
					'md-invalid': this.middleNameHasErrors
				}
			}
		},
		methods: {
			validateInputs() {
				if (this.lastName) {
					this.lastNameHasErrors = !this.lastName || !isNaN(this.lastName);
				}
				if (this.firstName) {
					this.firstNameHasErrors = !this.firstName || !isNaN(this.firstName);
				}
				if (this.middleName) {
					this.middleNameHasErrors = !this.middleName || !isNaN(this.middleName);
				}
			},
			saveUser() {
				return this.$http.post("https://profit-clicks.herokuapp.com/api/user", JSON.stringify({
						FirstName: this.firstName,
						LastName: this.lastName,
						MiddleName: this.middleName
					}),
					{headers: {"Content-Type": "application/json"}});
			},
			updateUser(userId) {
				return this.$http.put(`https://profit-clicks.herokuapp.com/api/user/${userId}`, JSON.stringify({
						FirstName: this.firstName,
						LastName: this.lastName,
						MiddleName: this.middleName
					}),
					{headers: {"Content-Type": "application/json"}});
			},
			async save() {
				try {
					const response = await this.saveUser();
					if (response.data.statusCode > 200) {
						console.error(response.data.reasonPhrase);
						this.$store.dispatch("showSnackBar", {snackText: response.data.reasonPhrase});
						return;
					}
				} catch (error) {
					console.error(error);
					this.$store.dispatch('showSnackBar', {snackText: error.message});
				}
				this.$store.dispatch("showSnackBar", {snackText: 'Новый контакт создан!'});
				this.$router.push({path: '/'});
			},
			async update(userId) {
				try {
					const response = await this.updateUser(userId);
					if (response.data.statusCode > 200) {
						console.error(response.data.reasonPhrase);
						this.$store.dispatch("showSnackBar", {snackText: response.data.reasonPhrase});
						return;
					}
				} catch (error) {
					console.error(error);
					this.$store.dispatch('showSnackBar', {snackText: error.message});
				}
				this.$store.dispatch("showSnackBar", {snackText: 'Контакт изменен!'});
				this.$router.push({path: '/'});
			}
		},
		async mounted() {
			this.userId = this.$route.params.id;

			if (this.userId) {
				if (this.storeUsers.length === 0) await this.$store.dispatch('get_users');
				const user = this.storeUsers.find(x => +x.Id === +this.userId);
				if (!user) {
					this.$store.dispatch('showSnackBar', {snackText: `Не найден контакт с id ${this.userId}`});
					this.$router.push({path: '/create'});
				} else {
					this.firstName = user.FirstName;
					this.lastName = user.LastName;
					this.middleName = user.MiddleName;
				}
			}
		}
	}
</script>

<style scoped>

</style>
