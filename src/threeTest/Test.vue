<template>
    <canvas id="three-container">123</canvas>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import ThreeTest from '.';




onMounted(()=>{
    const canvas = document.querySelector('#three-container');
    if (canvas) {
        new ThreeTest();
    }
})

</script>

<style lang="scss"></style>