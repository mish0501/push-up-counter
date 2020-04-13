<template>
  <div></div>
</template>

<script>
export default {
  name: 'Home',

  data: () => ({
    sensorData: [],
    sensor: null,
  }),

  mounted() {
    if ('LinearAccelerationSensor' in window) {
      navigator.permissions.query({ name: 'accelerometer' }).then(result => {
        if (result.state === 'granted') {
          this.initSensor()
        } else {
          console.log('No permissions to use AbsoluteOrientationSensor.')
        }
      })
    }
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
    },

    initSensor() {
      let sensor = new LinearAccelerationSensor({ frequency: 1 })
      sensor.onreading = () => {
        this.sensorData.push({
          x: this.round(sensor.x, 3),
          y: this.round(sensor.y, 3),
          z: this.round(sensor.z, 3),
          // timestamp: this.round(sensor.timestamp, 3),
        })
      }

      sensor.onerror = event => {
        if (event.error.name == 'NotReadableError') {
          console.log('Sensor is not available.')
        }
      }
      // sensor.start()
      this.sensor = sensor
    },
  },
}
</script>

<style></style>
