<template>
  <div>
    <Settings />

    <v-card v-if="!notificationsEnabled && notificationsSupported" class="mt-4">
      <v-card-title>Notifications</v-card-title>
      <v-card-text>
        Enable notifications to see when the timer is done, even if the phone is
        locked.
      </v-card-text>
      <v-card-actions>
        <v-btn text color="success" @click="enableNotification">Enable</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import Settings from '@/components/Settings.vue'

export default {
  name: 'SettingsView',

  data: () => ({
    notificationsEnabled: false,
  }),

  components: {
    Settings,
  },

  mounted() {
    if (Notification.permission === 'granted') this.notificationsEnabled = true
  },

  computed: {
    notificationsSupported() {
      return 'Notification' in window
    },
  },

  methods: {
    enableNotification() {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') this.notificationsEnabled = true
      })
    },
  },
}
</script>

<style></style>
