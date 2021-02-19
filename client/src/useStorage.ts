
function get(key: string) {
    localStorage.getItem(key);
}

function getJson<ElementType>(key: string, defaultValue:ElementType) {
    const payload = localStorage.getItem(key) || "";
    try
    {
        return  JSON.parse(payload) as ElementType
    }
    catch(error)
    {
        return defaultValue;
    }
}

function set(key: string, value: string) {
    localStorage.setItem(key, value);
}

function setJson(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
}


export function useStorage() {
    return {
        get, set, getJson, setJson
    }
}
