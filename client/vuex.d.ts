
import User from "@/User";
import { ComponentCustomProperties } from "vue";
import { Store } from "vuex";

declare module "@vue/runtime-core" {
    // declare your own store states
    interface State {
        user: User
    }

    // provide typings for `this.$store`
    interface ComponentCustomProperties {
        $store: Store<State>
    }
}