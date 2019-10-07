<template>
		<div class="wrapper">
				<div class="content">
						<md-card>
								<md-card-header>
										<div class="md-title"><span class="md-display-2">Ошибка 404</span></div>
								</md-card-header>

								<md-card-content>
										<span class="md-headline">Адрес страницы куда вы пытаетесь перейти, не найден.</span>
								</md-card-content>

								<md-card-actions>
										<md-button class="md-raised md-primary" @click="back()">Вернуться на главную</md-button>
								</md-card-actions>
						</md-card>
				</div>
		</div>
</template>


<script>

	export default {
		name: 'NotFound',
		methods: {
			back() {
				this.$router.push('/');
			}
		}
	}
</script>


<style scoped>

		.wrapper {
				display: flex;
				flex-direction: column;
				flex: 1;
		}

		.content {
				display: flex;
				flex-direction: row;
		}

		.md-card {
				width: 800px;
				padding: 60px;
				margin-top: 200px;
		}

		.content:before, .content:after, .wrapper:before, .wrapper:after {
				content: '';
				flex: 1;
		}
</style>
