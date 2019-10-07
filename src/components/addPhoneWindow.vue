<template>
		<div>
				<md-card style="margin: 10px;width: 400px;height: 250px;">
						<md-card-header>
								<h3>Добавление телефона для контакта</h3>
								<span>{{dataObj.user.LastName}} {{dataObj.user.FirstName}} {{dataObj.user.MiddleName}}</span>
						</md-card-header>

						<md-card-content>
								<div>
										<md-field md-clearable>
												<md-input
																v-model.trim.lazy="number"
																md-counter="11"
																maxlength="11"
												></md-input>
										</md-field>
								</div>
						</md-card-content>

						<md-card-actions>
								<md-button class="md-dense md-primary"
								           @click="save(dataObj.user.Id, number)"
								           :disabled="number.length < 6 || isNaN(number)"
								>
										Сохранить
								</md-button>
								<md-button class="md-dense md-accent" @click="cancel()">Отмена</md-button>
						</md-card-actions>
				</md-card>
		</div>
</template>

<script>
	export default {
		name: "addPhoneWindow",
		data: () => ({
			number: '',
		}),
		props: ['dataObj'],
		methods: {
			addPhone(UserId, Number) {
				return this.$http.post("https://profitclicksapi.azurewebsites.net/api/phone", JSON.stringify({
						Number,
						UserId
					}),
					{headers: {"Content-Type": "application/json"}});
			},
			async save(userId, number) {
				try {
					const response = await this.addPhone(userId, number);
					if (response.data.statusCode > 200) {
						console.error(response.data.reasonPhrase);
						this.$store.dispatch("showSnackBar", {snackText: response.data.reasonPhrase});
						return;
					}
					this.$store.dispatch("showSnackBar", {snackText: `Контакту ${userId} добавлен номер ${number}`});
					this.$emit("updateData");
					this.$emit("closeAddPhoneWindow");
				} catch (error) {
					console.error(error);
					this.$store.dispatch('showSnackBar', {snackText: error.message});
				}
			},
			cancel() {
				this.$emit("closeAddPhoneWindow");
			}
		}
	}
</script>

<style scoped>

</style>
