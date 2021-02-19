import { useStorage } from "./useStorage";
import User from "./User";
import { ref, watch, toRef, reactive } from "vue";

const { getJson, setJson } = useStorage();
const value = getJson("user", User.fromName(""));
const user = reactive(value);

watch(user, (_) => { 
    setJson("user", _)
})

export default function useUser() {


    return { 
        user
    }
}


