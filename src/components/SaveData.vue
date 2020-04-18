<template>
  <v-btn text color="pink lighten-2" @click="saveData">Save Data</v-btn>
</template>

<script>
export default {
  name: 'SaveData',

  props: {
    sensorData: {
      type: Array,
      required: true,
    },
    smoothData: {
      type: Array,
      required: true,
    },
  },

  methods: {
    saveData() {
      let raw = this.sensorData.map(({ x, y, z }) => ({
        x,
        y,
        z,
        vector: Math.hypot(x, y, z),
      }))

      let smooth = this.smoothData.map(({ x, y, z }) => ({
        sx: x,
        sy: y,
        sz: z,
        svector: Math.hypot(x, y, z),
      }))

      let data = []

      for (let i = 0; i < raw.length; i++) {
        data[i] = { ...raw[i], ...smooth[i] }
      }

      console.log(raw, smooth, data)

      this.exportCSVFile(data, `data_${new Date().getTime()}`)
    },

    convertToCSV(objArray) {
      var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray
      var str = ''

      for (var i = 0; i < array.length; i++) {
        var line = ''
        for (var index in array[i]) {
          if (line != '') line += ','

          line += array[i][index]
        }

        str += line + '\r\n'
      }

      return str
    },

    exportCSVFile(items, fileTitle) {
      if (this.headers) {
        items.unshift(this.headers)
      }

      // Convert Object to JSON
      var jsonObject = JSON.stringify(items)

      var csv = this.convertToCSV(jsonObject)

      var exportedFilenmae = fileTitle + '.csv' || 'export.csv'

      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae)
      } else {
        var link = document.createElement('a')
        if (link.download !== undefined) {
          // feature detection
          // Browsers that support HTML5 download attribute
          var url = URL.createObjectURL(blob)
          link.setAttribute('href', url)
          link.setAttribute('download', exportedFilenmae)
          link.style.visibility = 'hidden'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
    },
  },
}
</script>

<style></style>
