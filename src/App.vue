<template>
  <div class="main-container" :key="refreshKey">
    <div class="shuffle-code-container">{{ scramble.join(' ') }}</div>
    <div id="container"></div>
    <div class="input-button-container">
      <el-button-group v-for="j in 8" :key="j" class="button-rows">
        <el-button v-for="i in 3" :key="i" style="width: 50px; background: transparent;" @click="()=>{answer.push(CornerKey[(j-1) * 3 + (i-1)])}">
          {{ CornerKey[(j-1) * 3 + (i-1)] }}
        </el-button>
      </el-button-group>

      <el-button-group class="button-rows" style="padding-top: 15px;">
        <el-button style="width: 150px; background: transparent;" @click="()=>{answer.splice(answer.length - 1)}">
          backspace
        </el-button>
      </el-button-group>

    </div>
    <div class="input-code-container">
      <div style="font-weight: bold;">Answer</div>
      <div v-for="i in Math.floor(answer.length / 9) + 1" :key="i" class="answer-row">
        <span :style="{backgroundColor: faceColor[i-1]}" class="color-square"></span>
        <span v-for="code in answer.slice((i-1)*9, (i-1)*9+9)" class="code-square">{{ code }}</span>
      </div>
    </div>
    <div class="time-container">
      <Timer v-model="timeCnt" ref="timerRef" class=""/>
    </div>

    <el-button-group
      class="start-button"
    >
      
    <el-button
      @click="handleLeftBtn"
      type="primary"
      round
      v-if="currentState == CurrentState.HANDLING"
      style="width: 60%;"
    >
      {{leftBtnStr}}
    </el-button>
    <el-button
        @click="handleShuffle"
        type="primary"
        round
        :style="{width: currentState == CurrentState.HANDLING?'40%':'100%'}"
      >
        {{ rightBtnStr }}
      </el-button>
    </el-button-group>


  </div>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Rubiks from './rubiks';
import Timer from './Timer.vue';


let rubik: undefined | Rubiks = undefined;

const refreshKey = ref(0)

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

const EdgeKey = ref([
  'A','B',
  'C','D',
  'E','F',
  'G','H',
  'I','J',
  'K','L',
  'M','N',
  'O','P',
  'Q','R',
  'S','T',
  'W','X',
  'Y','Z',
])


const CurrentState = {
  BEGIN: 'BEGIN',
  SHUFFLING: 'SHUFFLING',
  HANDLING: 'HANDLING',
  DONE: 'DONE',
} as const;

type CurrentState = typeof CurrentState[keyof typeof CurrentState];

const timeCnt = ref(0)
const timerRef = ref<InstanceType<typeof Timer> | null>(null)

const answer = ref([])
const scramble = ref([])
const rightBtnStr = ref('Shuffle')
const leftBtnStr = ref('')

const faceColor = ["#ff0000", "#00dd00", "#ffaa00", "#0000ff", "#ffff00", "#ffffff"]

const currentState = ref<CurrentState>(CurrentState.BEGIN)


function handleShuffle() {
  // console.log('btn', rubik);
  if (rubik) {
    switch (currentState.value) {
      case CurrentState.BEGIN: {
        scramble.value = rubik.getScramble();
        rightBtnStr.value = 'Shuffling'
        currentState.value = CurrentState.SHUFFLING;
        // rubik.disorder(scramble.value.splice(0, 2)).then(()=>{
        rubik.disorder(scramble.value).then(()=>{
          currentState.value = CurrentState.HANDLING;
          rightBtnStr.value = 'Done';
          leftBtnStr.value = 'Show';
          timerRef.value.start();
        });
        break;
      }
      case CurrentState.HANDLING: {
        timerRef.value.stop();
        rightBtnStr.value = 'Reset'
        currentState.value = CurrentState.DONE;
        break;
      }
      case CurrentState.DONE: {
        window.location.reload();
        break;
      }
    }
  }
}

function handleLeftBtn() {
  if (rubik) {
    switch (currentState.value) {
      case CurrentState.DONE: {
        window.location.reload();
        break;
      }
      case CurrentState.HANDLING: {
        // showCode 
        rubik.toggleCodeShow();
        break;
      }
    }
  }
}

onMounted(() => {
  const container = document.getElementById("container");
  const orderChangeEle = document.getElementById("order-select") as HTMLSelectElement;
  
  const restore = document.getElementById("restore") as HTMLButtonElement;
  // console.log(container);
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
})
</script>


<style scoped lang="scss">
.main-container {
  position: relative;
  width: calc(100vw);
  height: calc(100vh);
  overflow: hidden;
  font-family: var(--el-font-family);

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
      margin: 5px 0px;
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
    bottom: 20px;
    left: 40%;
    right: 40%;
    height: 50;
    opacity: 0.3;
  }

  .input-code-container {
    position: absolute;
    left: 5px;
    top: 50px;
    font-family: var(--el-font-family);
    color: black;
    
    .answer-row {
      display: flex;
      align-items: center;
      padding: 5px;
      .color-square {
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 5px;
        margin-right: 4px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
        transition: transform 0.1s ease, box-shadow 0.1s ease;
      }

      .code-square {
        display: inline-flex; /* flex 布局可以让内容轻松居中 */
        justify-content: center; /* 水平居中 */
        align-items: center;      /* 垂直居中 */
        font-family: consolas;
        width: 20px;
      }
    }
  }
  
  .time-container {
    position: absolute;
    left: 15px;
    bottom: 35px;
    font-family: 'consolas';
    color: black;
    font-size: 18px;
  }
  
}

#container {
  width: calc(100vw);
  height: calc(100vh);
  background-color: gray;
}

</style>

<style>
html, body {
  background-color: #eeffcc;
  color: white;
  height: 100%;
  margin: 0;
  padding: env(safe-area-inset-top)
           env(safe-area-inset-right)
           env(safe-area-inset-bottom)
           env(safe-area-inset-left);
}
</style>
