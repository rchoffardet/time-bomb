import { createApp } from "vue"
import App from "./App.vue";
import router from "./router"
import logic from "./LogicPlugin"

const app = createApp(App)
app.use(router);
app.use(logic)
app.mount('#app')
