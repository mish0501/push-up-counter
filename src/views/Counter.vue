<template>
  <div class="home">
    <v-card v-if="state === 'workoutDone'">
      <v-card-title class="display-1">Workout done!</v-card-title>

      <v-card-text class="title">Total push-ups: {{ totalDone }}</v-card-text>

      <v-card-actions>
        <v-spacer />
        <SaveData :smoothData="smoothData" :sensorData="sensorData" />
        <v-btn text color="warning" @click="reset">Reset</v-btn>
      </v-card-actions>
    </v-card>

    <v-card v-else>
      <v-card-title>Counter</v-card-title>
      <v-card-text>
        <v-row justify="center">
          <v-col cols="12" sm="8" md="4" xl="2" class="text-center">
            <v-btn
              block
              color="success"
              @click="start"
              :disabled="state !== 'pushup' || settings.timer === null"
              >Start</v-btn
            >
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="6" sm="4" md="2" xl="1" class="text-center">
            <v-btn block color="error" @click="sensorState = 'stop'"
              >Stop</v-btn
            >
          </v-col>
          <v-col cols="6" sm="4" md="2" xl="1" class="text-center">
            <v-btn block color="warning" @click="reset">Reset</v-btn>
          </v-col>
        </v-row>

        <v-row v-if="state === 'rest'">
          <v-col cols="12" class="text-center">
            <vac :end-time="new Date().getTime() + restTime" @finish="restDone">
              <template v-slot:process="{ timeObj }">
                <span class="display-2">
                  {{ `${timeObj.m}:${timeObj.s}` }}
                </span>
              </template>
            </vac>
          </v-col>
        </v-row>

        <PushUpCounter
          :count.sync="count"
          :sensorState="sensorState"
          :reps="parseInt(settings.reps, 10)"
          :total="parseInt(settings.total, 10)"
          :totalDone="totalDone"
          :setsDone="setsDone"
          @setDone="setDone"
          @workoutDone="workoutDone"
          v-else-if="state === 'pushup'"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import PushUpCounter from '@/components/PushUpCounter.vue'
import SaveData from '@/components/SaveData.vue'

export default {
  name: 'Home',

  data: () => ({
    count: 0,
    sensorState: '',

    state: 'pushup',

    setsDone: 0,
    totalDone: 0,

    smoothData: [],
    sensorData: [],

    settings: {},
  }),

  components: {
    PushUpCounter,
    SaveData,
  },

  mounted() {
    this.settings = JSON.parse(localStorage.getItem('settings')) || {}
  },

  computed: {
    restTime() {
      if (this.settings.timer) {
        let time = this.settings.timer.split(':')
        return time[0] * 3600000 + time[1] * 60000 + time[2] * 1000
      }
      return null
    },
  },

  watch: {
    sensorState(newVal) {
      if (newVal === 'start') {
        this.expand = [1]
      }
    },
  },

  methods: {
    setDone({ smoothData, sensorData }) {
      this.setsDone += 1
      this.totalDone += this.count
      this.count = 0
      this.sensorState = 'reset'
      this.state = 'rest'
      this.smoothData = [...this.smoothData, ...smoothData]
      this.sensorData = [...this.sensorData, ...sensorData]

      this.vibrate('set')
    },

    workoutDone({ smoothData, sensorData }) {
      this.totalDone += this.count

      this.smoothData = [...this.smoothData, ...smoothData]
      this.sensorData = [...this.sensorData, ...sensorData]

      this.state = 'workoutDone'
      this.sensorState = 'reset'

      this.vibrate('total')
    },

    vibrate(type) {
      if ('vibrate' in navigator) {
        if (type == 'set') {
          window.navigator.vibrate([200, 100, 300])
        }

        if (type == 'total') {
          window.navigator.vibrate([300, 100, 300])
        }
      }
    },

    start() {
      setTimeout(() => {
        window.navigator.vibrate(500)

        this.sensorState = 'start'
      }, 5000)
    },

    reset() {
      this.count = 0

      this.state = 'pushup'

      this.sensorData = this.smoothData = []

      this.setsDone = this.totalDone = this.endWorkout = 0

      this.sensorState = 'reset'
    },

    restDone() {
      window.navigator.vibrate([300, 100, 300, 100, 300])
      this.state = 'pushup'
    },
  },
}
</script>
