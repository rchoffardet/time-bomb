import { useStorage } from "./useStorage";
import { createUser } from "../../src/User";
import { watch, reactive } from "vue";

const { getJson, setJson } = useStorage();
const value = getJson("user", createUser());
const user = reactive(value);

watch(user, (_) => { 
    setJson("user", _)
})

export default function useUser() {
    return { 
        user
    }
}


