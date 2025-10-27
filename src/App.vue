<template>
  <div id="container"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Rubiks from './rubiks';

onMounted(() => {
  const container = document.getElementById("container");
  const orderChangeEle = document.getElementById("order-select") as HTMLSelectElement;
  const disorderEle = document.getElementById("disorder") as HTMLButtonElement;
  const restore = document.getElementById("restore") as HTMLButtonElement;
  console.log(container);
  if (container) {
    const rubiks = new Rubiks(container);

    orderChangeEle.addEventListener("change", (event) => {
      const value = (event.target! as HTMLSelectElement).value;

      rubiks.setOrder(parseInt(value));
    })

    disorderEle.addEventListener("click", () => {
      rubiks.disorder();
    });

    restore.addEventListener("click", () => {
      const ok = window.confirm("还原后，不可恢复哦！");

      if (ok) {
        rubiks.restore();
      }
    });
  }

})
</script>


<style scoped>
#container {
  width: calc(100vw - 20px);
  height: calc(100vh - 20px);
  background-color: gray;
}

</style>
