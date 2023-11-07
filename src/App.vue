<script setup>
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useConfigStore } from './stores/config'
import Loading from './components/Loading.vue'
import router from '@/router'
import { getToken } from './axios'

const i18n = useI18n()
const isReady = ref(false)
const overlay = ref(false)

const getData = async (upstreamUserId, appId, signature, timestamp) => {
  let data
  try {
    overlay.value = true
    data = await getToken(upstreamUserId, appId, signature, timestamp)
    return data
  } catch (err) {
    console.log(err)
    return data
  } finally {
    overlay.value = false
  }
}

onMounted(async () => {
  await router.isReady()
  let store = useConfigStore()
  let { config } = storeToRefs(store)
  let { webTraBaseUrl, upstreamUserId, appId, signature, timestamp } =
    router.currentRoute.value.query
  if (webTraBaseUrl) {
    config.value.webTraBaseUrl = webTraBaseUrl
  }
  if (upstreamUserId) {
    config.value.upstreamUserId = upstreamUserId
  }
  if (appId) {
    config.value.appId = appId
  }
  if (timestamp) {
    config.value.timestamp = timestamp
  }
  if (signature) {
    config.value.signature = signature
  }
  i18n.locale.value = config.value.locale ?? i18n.locale.value

  let webTraAccessToken = await getData(upstreamUserId, appId, signature, timestamp)
  if (webTraAccessToken) {
    config.value.webTraAccessToken = webTraAccessToken
  }
  isReady.value = true
})
</script>

<template>
  <router-view v-if="isReady" v-slot="{ Component, route }">
    <component :is="Component" :key="route.fullPath" />
  </router-view>

  <Loading :overlay="overlay" />
</template>
