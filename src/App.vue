<template>
  <div class="main-container" :key="refreshKey">
    <div class="shuffle-code-container">{{ scramble.join(' ') }}</div>
    <div id="container"></div>
    <div class="input-button-container">
      <el-radio-group v-model="curType" size="small">
        <el-radio-button label="Corner" value="Corner" >
          <template #default>
            <div :style="{width: curType=='Corner'?'60px':'40px'}">Corner</div>
          </template>
        </el-radio-button>
        <el-radio-button label="Edge" value="Edge">
          <template #default>
            <div :style="{width: curType=='Edge'?'60px':'40px'}">Edge</div>
          </template>
        </el-radio-button>
      </el-radio-group>
      <el-divider style="margin:5px 0px 5px 0px;"></el-divider>
      <el-button-group v-for="j in 8" :key="j" class="button-rows">
        <el-button v-for="i in 3" :key="i" style="width: 50px; background: transparent;" @click="()=>{answer.push(CornerKey[(j-1) * 3 + (i-1)])}">
          {{ CornerKey[(j-1) * 3 + (i-1)] }}
        </el-button>
      </el-button-group>

    </div>
    <div class="input-code-container">
      {{ answer.join(' ') }}
    </div>
    <div class="time-container">
      <Timer v-model="timeCnt" ref="timerRef" class=""/>
    </div>

    <el-button-group
      class="start-button"
    >
      
    <el-button
      @click="console.log('TODO')"
      type="primary"
      round
      v-if="currentState == CurrentState.HANDLING"
      style="width: 60%;"
    >
      Show
    </el-button>
    <el-button
        @click="handleShuffle"
        type="primary"
        round
        :style="{width: currentState == CurrentState.HANDLING?'40%':'100%'}"
      >
        {{ mainBtnStr }}
      </el-button>
    </el-button-group>


  </div>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Rubiks from './rubiks';
import Test from './threeTest/Test.vue';
import Timer from './Timer.vue';
import {ElMessageBox} from 'element-plus'

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
const mainBtnStr = ref('Shuffle')

const FaceList = ['red', 'green', 'yellow']
const curType = ref('Corner')

const currentState = ref<CurrentState>(CurrentState.BEGIN)


function handleShuffle() {
  console.log('btn', rubik);
  if (rubik) {
    switch (currentState.value) {
      case CurrentState.BEGIN: {
        scramble.value = rubik.getScramble();
        mainBtnStr.value = 'Shuffling'
        currentState.value = CurrentState.SHUFFLING;
        rubik.disorder(scramble.value.splice(0, 2)).then(()=>{
          currentState.value = CurrentState.HANDLING;
          mainBtnStr.value = 'Done';
          timerRef.value.start();
        });
        break;
      }
      case CurrentState.HANDLING: {
        window.location.reload();
      }
    }
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
})
</script>


<style scoped lang="scss">
.main-container {
  position: relative;
  width: calc(100vw);
  height: calc(100vh);
  overflow: hidden;
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
    font-family: 'consolas';
    color: black;
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
