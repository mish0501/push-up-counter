<template>
  <div class="home">
    <v-card v-if="state === 'workoutDone'">
      <v-card-title class="display-1">Workout done!</v-card-title>

      <v-card-text class="title">Total push-ups: {{ endWorkout }}</v-card-text>

      <v-card-actions>
        <v-spacer />
        <SaveData :smoothData="smoothData" :sensorData="sensorData" />
        <v-btn text color="warning" @click="reset">Reset</v-btn>
      </v-card-actions>
    </v-card>

    <v-expansion-panels multiple :value="expand" tile v-else>
      <v-expansion-panel :disabled="sensorState == 'start'">
        <v-expansion-panel-header>
          Workout settings
        </v-expansion-panel-header>

        <v-expansion-panel-content color="grey lighten-4">
          <v-row justify="center">
            <v-col cols="6">
              <v-text-field
                type="number"
                label="Number of reps"
                hint="10, 15, 20, ..."
                v-model="reps"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                type="number"
                label="Number of sets"
                hint="1, 2, 3, ..."
                v-model="sets"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                type="number"
                label="Total push-ups"
                hint="20, 30, 50, 100, ..."
                v-model="total"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="8" md="4" lg="3" xl="2" class="text-center">
              <v-btn block color="info" @click="total = reps * sets"
                >Calculate total</v-btn
              >
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <v-row justify="center">
            <v-col cols="12" class="text-center">
              <span class="display-1 font-weight-medium">
                Rest time:
              </span>
            </v-col>
            <v-col cols="12" sm="8" md="4" lg="3" xl="2">
              <v-time-picker
                v-model="picker"
                use-seconds
                format="24hr"
                color="green"
                full-width
              />
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>Counter</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row justify="center">
            <v-col cols="12" sm="8" md="4" xl="2" class="text-center">
              <v-btn
                block
                color="success"
                @click="start"
                :disabled="state !== 'pushup' || picker === null"
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
              <vac
                :end-time="new Date().getTime() + restTime"
                @finish="restDone"
              >
                <template v-slot:process="{ timeObj }">
                  <span class="display-1 font-weight-medium">
                    {{ ` ${timeObj.m}:${timeObj.s}` }}
                  </span>
                </template>
              </vac>
            </v-col>
          </v-row>

          <PushUpCounter
            :count.sync="count"
            :sensorState="sensorState"
            :reps="parseInt(reps, 10)"
            :total="parseInt(total, 10)"
            :totalDone="totalDone || endWorkout"
            @setDone="setDone"
            @workoutDone="workoutDone"
            v-else-if="state === 'pushup'"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
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

    reps: null,
    sets: null,
    total: null,

    setsDone: 0,
    totalDone: 0,

    endWorkout: 0,

    expand: [0, 1],

    smoothData: [],
    sensorData: [],

    picker: null,

    headers: {
      x: 'X',
      y: 'Y',
      z: 'Z',
      vector: 'Vector',
      sx: 'X Smooth',
      sy: 'Y Smooth',
      sz: 'Z Smooth',
      svector: 'Vector Smooth',
    },
  }),

  components: {
    PushUpCounter,
    SaveData,
  },

  computed: {
    restTime() {
      if (this.picker) {
        let time = this.picker.split(':')
        return time[0] * 3600000 + time[1] * 60000 + time[2] * 1000
      }
      return null
    },
  },

  watch: {
    reps(newVal) {
      if (this.sets > 0 && !(this.total > 0)) {
        this.total = Math.floor(newVal * this.sets)
      }

      if (!(this.sets > 0) && this.total > 0) {
        this.sets = Math.round(this.total / newVal)
      }
    },

    sets(newVal) {
      if (this.reps > 0 && !(this.total > 0)) {
        this.total = Math.floor(newVal * this.reps)
      }

      if (!(this.reps > 0) && this.total > 0) {
        this.reps = Math.round(this.total / newVal)
      }
    },

    total(newVal) {
      if (this.reps > 0 && !(this.set > 0)) {
        this.sets = Math.round(newVal / this.reps)
      }

      if (!(this.reps > 0) && this.sets > 0) {
        this.reps = Math.round(newVal / this.sets)
      }
    },

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
      let endWorkout = this.totalDone + this.count

      smoothData = [...this.smoothData, ...smoothData]
      sensorData = [...this.sensorData, ...sensorData]

      this.reset()

      this.endWorkout = endWorkout
      this.smoothData = smoothData
      this.sensorData = sensorData

      this.state = 'workoutDone'

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

      this.reps = this.sets = this.total = this.picker = null

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
