<template>
  <v-app>
    <!-- <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item link :to="{ name: 'counter' }" exact>
          <v-list-item-action>
            <v-icon>timer</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Counter</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{ name: 'settings' }">
          <v-list-item-action>
            <v-icon>settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->

    <v-app-bar app color="green" dark>
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer" /> -->
      <v-toolbar-title>Push-up counter</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <v-alert
          :type="alert.type !== '' ? alert.type : undefined"
          dismissible
          v-model="alertToggle"
        >
          {{ alert.text }}
        </v-alert>
        <router-view />
      </v-container>

      <v-snackbar v-model="snackWithButtons" :timeout="timeout" bottom>
        {{ snackWithBtnText }}
        <v-spacer />
        <v-btn text color="lime " @click.stop="refreshApp">
          {{ snackBtnText }}
        </v-btn>
        <v-btn dark icon @click="snackWithButtons = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-snackbar>
    </v-content>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',

  data: () => ({
    drawer: false,

    alertToggle: false,

    refreshing: false,
    registration: null,
    snackBtnText: '',
    snackWithBtnText: '',
    snackWithButtons: false,
    timeout: 0,
  }),

  created() {
    // Listen for swUpdated event and display refresh snackbar as required.
    document.addEventListener('swUpdated', this.showRefreshUI, { once: true })
    // Refresh all open app tabs when a new service worker is installed.
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (this.refreshing) return
      this.refreshing = true
      window.location.reload()
    })
  },

  mounted() {
    this.$store.dispatch('settings/setSettings')

    this.$store.subscribeAction({
      after: ({ type }) => {
        if (type === 'alert/alert') {
          this.alertToggle = true
        }
      },
    })
  },

  computed: {
    ...mapState('alert', {
      alert: state => state,
    }),
  },

  methods: {
    showRefreshUI(e) {
      // Display a snackbar inviting the user to refresh/reload the app due
      // to an app update being available.
      // The new service worker is installed, but not yet active.
      // Store the ServiceWorkerRegistration instance for later use.
      this.registration = e.detail
      this.snackBtnText = 'Refresh'
      this.snackWithBtnText = 'New version available!'
      this.snackWithButtons = true
    },
    refreshApp() {
      this.snackWithButtons = false
      // Protect against missing registration.waiting.
      if (!this.registration || !this.registration.waiting) {
        return
      }
      this.registration.waiting.postMessage('skipWaiting')
    },
  },
}
</script>
