import Vue from 'vue'
import { uid, Notify } from 'quasar'
import { firebaseDb, firebaseAuth } from 'boot/firebase'
import { showErrorMessage } from 'src/functions/function-show-error-message'


const state = {
	foods: {
		// 'id1': {
		// 	name: 'Burger',
		// 	description: 'A burger is a sandwich consisting of one or more cooked patties of ground meat, usually beef, placed inside a sliced bread roll or bun.',
		// 	imageUrl: 'https://i.imgur.com/0umadnY.jpg',
		// 	rating: 4
		// },
		// 'id2': {
		// 	name: 'Pizza',
		// 	description: 'Pizza is a savory dish of Italian origin, consisting of a usually round, flattened base of leavened wheat-based dough.',
		// 	imageUrl: 'https://i.imgur.com/b9zDbyb.jpg',
		// 	rating: 5
		// },
		// 'id3': {
		// 	name: 'Sprouts',
		// 	description: 'The Brussels sprout is a member of the Gemmifera Group of cabbages, grown for its edible buds.',
		// 	imageUrl: 'https://i.imgur.com/RbKjUjB.jpg',
		// 	rating: 1
		// }	
	},
	foodsDownloaded:false
}

const mutations = {
	deleteFood(state, id) {
		Vue.delete(state.foods, id)
	},
	addFood(state, payload) {
        console.log("TCL: addFood -> payload", payload)
		
		Vue.set(state.foods, payload.id, payload.food)
	},
	updateFood(state, payload) {
		Object.assign(state.foods[payload.id], payload.updates)
	},
	setFoodsDownloaded(state,value){
		state.foodsDownloaded = value
	},
	clearFoods(state){
		state.foods = {}
	},
}

const actions = {
	deleteFood({ dispatch }, id) {
		// commit('deleteFood', id)
		dispatch('fbDeleteFood', id)
	},
	addFood({ dispatch }, food) {
		let newId = uid()
		let payload = {
			id: newId,
			food: food
		}
		// commit('addFood', payload)
		dispatch('fbAddFood', payload)
	},
	updateFood({ dispatch }, payload) {
		// commit('updateFood', payload)
		dispatch('fbUpdateFood', payload)
	},
	fbReadData({commit}){
		let userId = firebaseAuth.currentUser.uid
		// userId = 'Uw7QiauNNrNXzsZtC9wiCbXyqN93'
		let userFoods = firebaseDb.ref('foods/'+userId)
        console.log("TCL: fbReadData -> userFoods", userFoods)
		
		
		// initial check for data
		userFoods.once('value',snapshop=>{
			commit('setFoodsDownloaded',true)
		},error=>{
        	showErrorMessage(error.message)
			this.$router.replace('/auth')
		})
		
		// child added
		userFoods.on('child_added',snapshot=>{
			let food = snapshot.val()
			let payload = {
				id:snapshot.key,
				food:food
			}
			commit('addFood',payload)
		},error=>{
        	console.log("TCL: fbReadData -> error", error)
		})

		// child changed
		userFoods.on('child_changed',snapshot=>{
			let food = snapshot.val()
			let payload = {
				id:snapshot.key,
				updates:food
			}
			commit('updateFood',payload)
		},error=>{
        	console.log("TCL: fbReadData -> error", error)
		})

		// child removed
		userFoods.on('child_removed',snapshot=>{
			let foodId = snapshot.key
			commit('deleteFood',foodId)
		},error=>{
        	console.log("TCL: fbReadData -> error", error)
		})
	},
	fbAddFood({},payload){
		let userId = firebaseAuth.currentUser.uid
		// userId = 'Uw7QiauNNrNXzsZtC9wiCbXyqN93'
		let foodRef = firebaseDb.ref('foods/'+userId+'/'+payload.id)
		foodRef.set(payload.food,error=>{
			if(error){
                showErrorMessage(error.message)
			}
			else{
				Notify.create('Food added!')
			}
		})
	},
	fbUpdateFood({},payload){
		let userId = firebaseAuth.currentUser.uid
		// userId = 'Uw7QiauNNrNXzsZtC9wiCbXyqN93'
		let foodRef = firebaseDb.ref('foods/'+userId+'/'+payload.id)
		foodRef.update(payload.updates,error=>{
			if(error){
                showErrorMessage(error.message)
			}
			else{
				let keys = Object.keys(payload.updates)
                console.log("TCL: fbUpdateFood -> keys", keys)
				if(!(keys.includes('completed') && keys.length==1)){
					Notify.create('Food updated!')
				}
			}
		})
	},
	fbDeleteFood({},foodId){
		let userId = firebaseAuth.currentUser.uid
		// userId = 'Uw7QiauNNrNXzsZtC9wiCbXyqN93'
		let foodRef = firebaseDb.ref('foods/'+userId+'/'+foodId)
		foodRef.remove(error=>{
			if(error){
                showErrorMessage(error.message)
			}
			else{
				Notify.create('Food deleted!')
			}
		})
	}
}

const getters = {
	foods: (state) => {
		return state.foods
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}