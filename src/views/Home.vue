<template>
  <div class="home">
    <v-expansion-panels multiple :value="expand" tile>
      <v-expansion-panel :disabled="sensorState == 'start'">
        <v-expansion-panel-header>
          Total push-ups calculator
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

            <v-col cols="12" sm="6" class="text-center">
              <v-btn block color="info" @click="total = reps * sets"
                >Calculate total</v-btn
              >
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>Counter</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row justify="center">
            <v-col cols="12" sm="3" class="text-center">
              <v-btn block color="success" @click="start">Start</v-btn>
            </v-col>
            <v-col cols="6" sm="3" class="text-center">
              <v-btn block color="error" @click="sensorState = 'stop'"
                >Stop</v-btn
              >
            </v-col>
            <v-col cols="6" sm="3" class="text-center">
              <v-btn block color="warning" @click="sensorState = 'reset'"
                >Reset</v-btn
              >
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
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    {{ sensorState }} {{ setsDone }} {{ totalDone }}
  </div>
</template>

<script>
import PushUpCounter from '@/components/PushUpCounter.vue'

export default {
  name: 'Home',

  data: () => ({
    count: 0,
    sensorState: '',

    reps: null,
    sets: null,
    total: null,

    setsDone: 0,
    totalDone: 0,

    endWorkout: 0,

    expand: [0, 1],

    smoothData: [],
  }),

  components: {
    PushUpCounter,
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
    setDone({ smoothData }) {
      this.setsDone += 1
      this.totalDone += this.count
      this.count = 0
      this.sensorState = 'reset'
      this.smoothData = [...this.smoothData, ...smoothData]

      this.vibrate('set')
    },

    workoutDone({ smoothData }) {
      this.endWorkout = this.totalDone + this.count

      this.reps = null
      this.sets = null
      this.total = null

      this.setsDone = 0
      this.totalDone = 0
      this.count = 0

      this.expand = [0, 1]

      this.sensorState = 'stop'

      this.smoothData = [...this.smoothData, ...smoothData]

      this.vibrate('total')
      console.log(JSON.stringify(this.smoothData))
    },

    vibrate(type) {
      if ('vibrate' in navigator) {
        if (type == 'set') {
          console.log('200')

          window.navigator.vibrate([200, 100, 300])
        }

        if (type == 'total') {
          console.log('300')

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
  },
}
</script>
