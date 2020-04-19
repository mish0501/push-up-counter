<template>
  <div>
    <v-row class="text-center">
      <v-col cols="12">
        <span class="display-2">Count: {{ count }}</span>
      </v-col>
      <v-col cols="6">
        <span class="title">Total: {{ totalDone }}</span>
      </v-col>
      <v-col cols="6">
        <span class="title">Sets done: {{ setsDone }}</span>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  name: 'PushUpCounter',

  data: () => ({
    sensor: null,

    sensorData: [],

    smoothData: [],

    state: 'standing',

    minMaxDiff: 0,
    margin: 0.8,
  }),

  props: {
    count: {
      type: Number,
      default: 0,
    },
    sensorState: {
      type: String,
      required: true,
    },
    reps: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    totalDone: {
      type: Number,
      required: true,
    },
    setsDone: {
      type: Number,
      required: true,
    },
  },

  mounted() {
    if ('Accelerometer' in window) {
      navigator.permissions.query({ name: 'accelerometer' }).then(result => {
        if (result.state === 'granted') {
          this.initSensor()
        } else {
          console.log('No permissions to use Accelerometer.')
        }
      })
    }
  },

  computed: {
    vector() {
      let len = this.smoothData.length
      if (len > 0) {
        let { x, y, z } = this.smoothData[len - 1]

        return this.round(Math.hypot(x, y, z), 3)
      }
      return null
    },
  },

  watch: {
    sensorState(newVal) {
      this[newVal]()
    },

    count(newVal) {
      if (newVal != 0) {
        if (newVal + this.totalDone == this.total) {
          this.$emit('workoutDone', {
            smoothData: this.smoothData,
            sensorData: this.sensorData,
          })

          return
        }

        if (newVal == this.reps) {
          this.$emit('setDone', {
            smoothData: this.smoothData,
            sensorData: this.sensorData,
          })

          return
        }

        if ('vibrate' in navigator) {
          console.log('150')

          window.navigator.vibrate(150)
        }
      }
    },
  },

  methods: {
    initSensor() {
      let sensor = new Accelerometer({ frequency: 20 })
      sensor.onreading = () => {
        const data = {
          x: this.round(sensor.x, 3),
          y: this.round(sensor.y, 3),
          z: this.round(sensor.z, 3),
          timestamp: this.round(sensor.timestamp, 3),
        }

        this.sensorData.push(data)

        this.smooth()

        this.checkForPushUp()
      }

      sensor.onerror = event => {
        if (event.error.name == 'NotReadableError') {
          console.log('Sensor is not available.')
        }
      }
      this.sensor = sensor
    },

    smooth() {
      let sensorData = this.sensorData,
        len = this.sensorData.length,
        alpha = 0.45

      if (len > 2) {
        let { x, y, z } = sensorData[len - 1]
        let { x: prevX, y: prevY, z: prevZ } = sensorData[len - 2]

        for (let i = 0; i < 4; i++) {
          x = this.exponentialFilter(x, prevX, alpha)

          y = this.exponentialFilter(y, prevY, alpha)

          z = this.exponentialFilter(z, prevZ, alpha)

          if (i == 0) {
            let prevSmooth = this.smoothData[this.smoothData.length - 1]

            prevX = prevSmooth.x
            prevY = prevSmooth.y
            prevZ = prevSmooth.z
          }
        }

        this.smoothData.push({
          x: this.round(x, 3),
          y: this.round(y, 3),
          z: this.round(z, 3),
        })

        return
      }

      this.smoothData.push({
        x: this.round(sensorData[len - 1].x, 3),
        y: this.round(sensorData[len - 1].y, 3),
        z: this.round(sensorData[len - 1].z, 3),
      })
    },

    checkForPushUp() {
      if (this.vector) {
        let diff = this.round(this.vector - 9.8, 3)

        if (
          this.state == 'falling' &&
          diff <= this.margin &&
          diff > this.minMaxDiff
        ) {
          this.state = 'standing'
          this.$emit('update:count', this.count + 1)
        }

        if (
          this.state == 'standing' &&
          diff >= this.margin &&
          diff < this.minMaxDiff
        ) {
          this.state = 'falling'
        }

        this.minMaxDiff = diff
      }
    },

    exponentialFilter(curr, prev, alpha) {
      return alpha * prev + (1 - alpha) * curr
    },

    round(number, precision) {
      let factor = 10 ** precision
      return Math.round(number * factor) / factor
    },

    start() {
      this.sensor.start()
      console.log('start')
    },

    stop() {
      this.sensor.stop()
      console.log('stop')
    },

    reset() {
      this.sensor.stop()
      this.sensorData = []
      this.smoothData = []
      this.state = 'standing'
      console.clear()
      console.log('reset')
    },
  },
}
</script>

<style></style>
