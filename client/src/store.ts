import { createStore } from 'vuex'
import User from './User'
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
    storage: window.localStorage
  })

const store = createStore({
    state() {
        return {
            user: User.fromName("")
        }
    },
    
  plugins: [vuexLocal.plugin]
})