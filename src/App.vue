<template>
		<div id="app">
				<md-toolbar class="md-primary" style="margin-bottom: 30px;">
						<h3 class="md-title">Телефонный справочник</h3>
				</md-toolbar>
				<div style="margin: 0 10px;">
						<router-view/>
				</div>

				<md-snackbar :md-position="snackBar.position" :md-duration="snackBar.isInfinity ? Infinity : snackBar.duration" :md-active.sync="snackBar.showSnackbar"
				             md-persistent>
						<span>{{snackBar.snackText}}</span>
						<md-button class="md-primary" @click="hideSnackbar()">Скрыть</md-button>
				</md-snackbar>
		</div>
</template>
<script>
	export default {
		name: "App",
		computed: {
			snackBar() {
				return this.$store.state.snackBar
			}
		},
		methods: {
			hideSnackbar() {
				this.$store.dispatch('hideSnackbar');
			},
		}
	}
</script>
<style>
		#app {
				height: 100vh;
				max-height: 100vh;
				margin: 0;
		}
</style>
