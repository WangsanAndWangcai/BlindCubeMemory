<template>
  <div class="main-container">
    <div class="shuffle-code-container">D' F U2 B L' R B' F R' U D2 L2 F B D2 L' U2 F' D2 R'</div>
    <div id="container"></div>
    <div class="input-button-container">
      <div v-for="j in 8" :key="j" class="button-rows">
        <div v-for="i in 3" :key="i" class="button-cols">
          <span>
            {{ CornerKey[(j-1) * 3 + (i-1)] }}
          </span>
        </div>
      </div>
    </div>
    <div class="input-code-container">
      <div>A1</div>
      <div>D2</div>
      <div>F3</div>
      <div>J4</div>
      <div>X5</div>
      <div>P6</div>
      <div>R7</div>
      <div>R8</div>
      <div>R9</div>
    </div>

    <div class="start-button" @click="handleShuffle">Start</div>
  </div>
  <!-- <Test/> -->
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Rubiks from './rubiks';
import Test from './threeTest/Test.vue';

let rubik: undefined | Rubiks = undefined;

const CornerKey = ref([
  'A','B','C',
  'D','E','F',
  'G','H','I',
  'J','K','L',
  'W','M','N',
  'O','P','Q',
  'R','S','T',
  'X','Y','Z',
])

function handleShuffle() {
  console.log('btn', rubik);
  if (rubik) {
    rubik.disorder();
  }
}

onMounted(() => {
  const container = document.getElementById("container");
  const orderChangeEle = document.getElementById("order-select") as HTMLSelectElement;
  
  const restore = document.getElementById("restore") as HTMLButtonElement;
  console.log(container);
  if (container) {
    rubik = new Rubiks(container);

    // orderChangeEle.addEventListener("change", (event) => {
    //   const value = (event.target! as HTMLSelectElement).value;

    //   rubiks.setOrder(parseInt(value));
    // })

    // restore.addEventListener("click", () => {
    //   const ok = window.confirm("还原后，不可恢复哦！");

    //   if (ok) {
    //     rubiks.restore();
    //   }
    // });
  }


  // TODO
  // 1. shuffle
  // 2. Gen Code


})
</script>


<style scoped lang="scss">
.main-container {
  position: relative;

  .shuffle-code-container {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 999;
    color: black;
  }

  .input-button-container {
    position: absolute;
    right: 20px;
    top: 20px;
    z-index: 999;

    .button-rows {
      margin: 5px;
      padding: 5px;
      display: flex;
      flex-direction: row;
    }

    .button-cols {
      padding-right: 5px;
      background: gray;
      width: 50px;
      height: 50px;
      span {
        margin: auto;
      }
    }
  }

  .start-button {
    position: absolute;
    bottom: 50px;
    left: 40%;
    right: 40%;
    background-color: gray;
    width: 50;
    height: 50;
    border: 1px solid red;
  }

  .input-code-container {
    position: absolute;
    left: 5px;
    top: 50px;
  }
}

#container {
  width: calc(100vw);
  height: calc(100vh);
  background-color: gray;
}

</style>

<style>

</style>
