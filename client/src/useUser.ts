import { useStorage } from "./useStorage";
import User from "../../src/User";
import { ref, watch, toRef, reactive } from "vue";
import { uid } from "uid";

const { getJson, setJson } = useStorage();
const value = getJson("user", new User(uid(), ""));
const user = reactive(value);

watch(user, (_) => { 
    setJson("user", _)
})

export default function useUser() {
    return { 
        user
    }
}


