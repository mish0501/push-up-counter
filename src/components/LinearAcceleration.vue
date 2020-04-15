<template>
  <div>
    <v-row justify="center">
      <v-col cols="12" sm="3" class="text-center">
        <v-btn block color="success" @click="start">Start</v-btn>
      </v-col>
      <v-col cols="6" sm="3" class="text-center">
        <v-btn block color="error" @click="stop">Stop</v-btn>
      </v-col>
      <v-col cols="6" sm="3" class="text-center">
        <v-btn block color="warning" @click="reset">Reset</v-btn>
      </v-col>
    </v-row>
    <!--
    <v-row class="mt-5" justify="center" v-if="sensorData.length >= 0">
      <v-col cols="11">
        <v-slider
          v-model="slider"
          min="0"
          :max="max"
          thumb-label="always"
        ></v-slider>
      </v-col>
    </v-row>

    <v-row class="text-center" v-if="smoothData.length > 0">
      <v-col v-for="(item, i) in sensorData[slider]" :key="i" cols="4">
        {{ i }}: {{ item }}
      </v-col>
      <v-col cols="4">
        {{ calcVector(sensorData[slider]) }}
      </v-col>
    </v-row> -->

    <v-row class="text-center display-2">
      <v-col cols="12">Count: {{ count }}</v-col>
    </v-row>
  </div>
</template>
<script>
import data from '@/data.json'

export default {
  name: 'Sensor',

  data: () => ({
    sensorData: [],
    sensor: null,
    slider: 0,

    smoothData: [],

    count: 0,

    state: 'falling',
    minMaxDiff: 0,
  }),

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
    max() {
      let len = this.sensorData.length
      return len - 1 > 0 ? len - 1 : 1
    },

    vector() {
      let len = this.smoothData.length
      if (len > 0) {
        let { x, y, z } = this.smoothData[len - 1]

        return this.round(Math.sqrt(x * x + y * y + z * z), 3)
      }
      return null
    },
  },

  methods: {
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
      console.log(JSON.stringify(this.smoothData))
    },

    reset() {
      this.sensor.stop()
      this.sensorData = []
      this.slider = 0
      this.count = 0
      this.smoothData = []
      this.state = 'falling'
      console.clear()
      console.log('reset')
    },

    calcVector(obj) {
      if (obj) {
        let { x, y, z } = obj

        return this.round(Math.sqrt(x * x + y * y + z * z), 3)
      }
    },

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

        this.slider = this.sensorData.length - 1

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
        slider = this.slider

      if (sensorData.length > 2) {
        let { x, y, z } = sensorData[slider]
        let { x: prevX, y: prevY, z: prevZ } = sensorData[slider - 1]

        x = this.exponentialFilter(x, prevX, 0.45)
        x = this.exponentialFilter(x, prevX, 0.45)
        x = this.exponentialFilter(x, prevX, 0.45)
        x = this.exponentialFilter(x, prevX, 0.45)

        y = this.exponentialFilter(y, prevY, 0.45)
        y = this.exponentialFilter(y, prevY, 0.45)
        y = this.exponentialFilter(y, prevY, 0.45)
        y = this.exponentialFilter(y, prevY, 0.45)

        z = this.exponentialFilter(z, prevZ, 0.45)
        z = this.exponentialFilter(z, prevZ, 0.45)
        z = this.exponentialFilter(z, prevZ, 0.45)
        z = this.exponentialFilter(z, prevZ, 0.45)

        this.smoothData.push({
          x: this.round(x, 3),
          y: this.round(y, 3),
          z: this.round(z, 3),
        })
      }
    },

    exponentialFilter(curr, prev, alpha) {
      return alpha * prev + (1 - alpha) * curr
    },

    checkForPushUp() {
      if (this.vector) {
        let diff = this.round(this.vector - 9.8, 3)

        if (this.state == 'falling' && diff <= 1.5 && diff > this.minMaxDiff) {
          this.state = 'standing'
          this.count += 1
        }

        if (this.state == 'standing' && diff >= 1.5 && diff < this.minMaxDiff) {
          this.state = 'falling'
        }

        this.minMaxDiff = diff
      }
    },
  },
}
</script>

<style></style>
