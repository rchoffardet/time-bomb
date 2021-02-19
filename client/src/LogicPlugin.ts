import { Plugin } from "vue";

const plugin: Plugin = {
    install: (app, options) => {
        app.config.globalProperties.$app = null 
    }
}

export default plugin