<template>
  <div class="home">
    <v-card v-if="state === 'workoutDone'">
      <v-card-title class="display-1">
        Workout done!
      </v-card-title>

      <v-card-text class="title">Total push-ups: {{ totalDone }}</v-card-text>

      <v-card-actions>
        <v-spacer />
        <SaveData :smoothData="smoothData" :sensorData="sensorData" />
        <v-btn text color="warning" @click="reset">Reset</v-btn>
      </v-card-actions>
    </v-card>

    <v-card v-else>
      <v-card-title>
        Counter

        <v-spacer />

        <v-dialog v-model="toggleSettings" scrollable>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" v-if="state === 'pushup'">
              <v-icon>settings</v-icon>
            </v-btn>
          </template>

          <Settings @settingsSaved="saveSettings" />
        </v-dialog>
      </v-card-title>
      <v-divider />
      <v-card-text>
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
          :sensorState="sensorState"
          :reps="parseInt(settings.reps, 10)"
          :total="parseInt(settings.total, 10)"
          :totalDone="totalDone"
          @setDone="setDone"
          @workoutDone="workoutDone"
          v-else-if="state !== 'rest'"
        />

        <v-row class="text-center">
          <v-col cols="6">
            <span class="title">Total: {{ totalDone }}</span>
          </v-col>
          <v-col cols="6">
            <span class="title">Sets done: {{ setsDone }}</span>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-row dense>
          <v-col cols="6" sm="4" lg="2" class="text-center">
            <v-btn block color="success" @click="start" :disabled="canStart">
              {{ state === 'paused' ? 'Continue' : 'Start' }}
            </v-btn>
          </v-col>
          <v-spacer v-if="$vuetify.breakpoint.smAndUp" />
          <v-col
            cols="4"
            sm="2"
            lg="1"
            offset="2"
            offset-sm="0"
            class="text-center"
          >
            <v-btn
              block
              color="info"
              @click="pause"
              v-if="state === 'counting'"
            >
              Pause
            </v-btn>

            <v-btn block color="error" @click="reset" v-else>Stop</v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import PushUpCounter from '@/components/PushUpCounter.vue'
import SaveData from '@/components/SaveData.vue'
import Settings from '@/components/Settings.vue'

export default {
  name: 'Counter',

  data: () => ({
    sensorState: '',

    state: 'pushup',

    setsDone: 0,
    totalDone: 0,

    smoothData: [],
    sensorData: [],

    settings: {},

    toggleSettings: false,
  }),

  components: {
    PushUpCounter,
    SaveData,
    Settings,
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

    canStart() {
      return (
        this.state === 'rest' ||
        this.state === 'counting' ||
        this.settings.timer === undefined
      )
    },
  },

  methods: {
    setDone({ smoothData, sensorData, count }) {
      this.setsDone += 1
      this.totalDone += count
      this.sensorState = 'reset'
      this.state = 'rest'
      this.smoothData = [...this.smoothData, ...smoothData]
      this.sensorData = [...this.sensorData, ...sensorData]

      this.vibrate('set')
    },

    workoutDone({ smoothData, sensorData, count }) {
      this.totalDone += count

      this.smoothData = [...this.smoothData, ...smoothData]
      this.sensorData = [...this.sensorData, ...sensorData]

      this.state = 'workoutDone'
      this.sensorState = 'reset'

      this.vibrate('total')
    },

    restDone() {
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          let url = location.href

          navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification("Time's up!", {
              body: 'Time for the next set.',
              icon: `${url}img/icons/android-chrome-192x192.png`,
              badge: `${url}img/icons/badge.png`,
              vibrate: [300, 50, 300, 50, 300],
              data: {
                url,
              },
            })
          })
        }
      } else {
        window.navigator.vibrate([300, 100, 300, 100, 300])
      }

      this.state = 'pushup'
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

    saveSettings() {
      this.toggleSettings = !this.toggleSettings

      this.settings = JSON.parse(localStorage.getItem('settings')) || {}
    },

    start() {
      setTimeout(() => {
        window.navigator.vibrate(500)

        this.sensorState = 'start'
        this.state = 'counting'
      }, 5000)
    },

    reset() {
      this.count = 0

      this.state = 'pushup'

      this.sensorData = this.smoothData = []

      this.setsDone = this.totalDone = this.endWorkout = 0

      this.sensorState = 'reset'
    },

    pause() {
      this.sensorState = 'stop'

      this.state = 'paused'
    },
  },
}
</script>
