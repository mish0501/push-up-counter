<template>
  <v-card>
    <v-card-title color="grey lighten-3">Settings</v-card-title>
    <v-divider />
    <v-card-text>
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
            v-model="timer"
            use-seconds
            format="24hr"
            color="green"
            full-width
            ref="timePicker"
          />
        </v-col>
      </v-row>
    </v-card-text>

    <v-divider />

    <v-card-actions>
      <v-btn color="success" block @click="saveSettings">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'Settings',

  data: () => ({
    reps: null,
    sets: null,
    total: null,

    timer: null,
  }),

  mounted() {
    let settings = JSON.parse(localStorage.getItem('settings')) || ''

    if (settings !== '') {
      Object.assign(this.$data, settings)
    }

    this.$refs.timePicker.inputHour = 0
    this.$refs.timePicker.selecting = 2
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
  },

  beforeDestroy() {
    this.saveSettings()
  },

  methods: {
    saveSettings() {
      let settings = {
        reps: this.reps,
        sets: this.sets,
        total: this.total,
        timer: this.timer,
      }

      Object.keys(settings).forEach(
        k => !settings[k] && settings[k] !== undefined && delete settings[k],
      )

      localStorage.setItem('settings', JSON.stringify(settings))

      this.$emit('settingsSaved')
    },
  },
}
</script>

<style></style>
