<template>
  <h1>Créer une partie</h1>
  <input type="button" value="Créer la partie" @click="initRoom" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { uid } from "uid";
import { useRouter } from "vue-router";

const Component = defineComponent({
    setup() {        
        const router = useRouter();

        function initRoom() {
            router.push({name: "room", params:{roomId: uid()}})
        }

        return { 
            initRoom
        }
    }
});

export default Component

</script>

<style>
</style>