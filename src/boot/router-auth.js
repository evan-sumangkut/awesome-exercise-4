import { LocalStorage } from 'quasar'

export default async ({ router }) => {
  router.beforeEach((to, from, next) => {
    let loggedIn = LocalStorage.getItem('loggedIn')
    if(!loggedIn && to.path !== '/auth'){
      // next('/auth')
      console.log('not login didalam boot')
    }else{
      // if(to.path === '/auth'){
      //   next('/')
      // }else{
        // next()
      // }
      console.log('login didalam boot')
    }
  })
}
