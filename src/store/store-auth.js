import { firebaseAuth } from 'boot/firebase'
import { LocalStorage, Loading } from 'quasar'
import { showErrorMessage } from 'src/functions/function-show-error-message'

const state = {
    loggedIn:false,
    username: ''
}

const mutations = {
	setLoggedIn(state,value){
		state.loggedIn = value
	},
	setUsername(state,value){
		state.username = value
	}
}

const actions = {
	registerUser({},payload){
		Loading.show()
		firebaseAuth.createUserWithEmailAndPassword(payload.email, payload.password)
		.then(response => {
        console.log("TCL: registerUser -> response", response)
		})
		.catch(error => {
			showErrorMessage(error.message)
        console.log("TCL: registerUser -> error", error.message)
		})
	},
	loginUser({},payload){
		Loading.show()
		firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password)
		.then(response => {
		console.log("TCL: loginUser -> response", response)
		})
		.catch(error => {
			showErrorMessage(error.message)
		console.log("TCL: loginUser -> error", error.message)
		})
	},
	logoutUser({},payload){
		console.log('logout user')
		firebaseAuth.signOut()
	},
	handleAuthStateChange({commit,dispatch}){
		firebaseAuth.onAuthStateChanged(user=> {
            Loading.hide()
            console.log('masuk handle')
			if (user) {
                console.log('telah login')
				commit('setLoggedIn',true)
				commit('setUsername',user.email)
				LocalStorage.set('loggedIn', true)
				this.$router.push('/')
				dispatch('foods/fbReadData', null, { root: true })
			}else{
                console.log('telah logout')
				commit('foods/clearFoods', null, { root: true })
				commit('foods/setFoodsDownloaded', false, { root: true })
				commit('setLoggedIn', false)
				commit('setUsername', null)
				LocalStorage.set('loggedIn', false)
				this.$router.replace('/auth')
			}
		});
	}
}

const getters = {
 
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}