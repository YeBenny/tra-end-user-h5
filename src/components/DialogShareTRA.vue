<script setup>
import { ref, toRefs } from 'vue'
import html2canvas from 'html2canvas'
import Loading from './Loading.vue'
import LazyImage from './LazyImage.vue'

const props = defineProps({
  dialog: {
    type: Boolean,
    required: true
  },
  series: {
    type: Object
  },
  tra: {
    type: Object
  }
})

const { dialog } = toRefs(props)
const emits = defineEmits(['onClose'])
function onClose() {
  emits('onClose')
}

const overlay = ref(false)

const shareViaWebShare = async () => {
  overlay.value = true
  let canvas = await html2canvas(document.querySelector('#share-content'), {
    backgroundColor: 'transparent',
    useCORS: true,
    allowTaint: true,
    imageTimeout: 0
  })
  await canvas.toBlob(async (blob) => {
    let type = blob.type.split('/')[1]
    let files = [new File([blob], `${Date.now()}.${type}`, { type: blob.type })]
    if (navigator.share) {
      navigator.share({
        title: 'Share TRA',
        text: 'Share TRA to your friends!',
        files
      })
    }
    overlay.value = false
  })
}
</script>
<template>
  <v-dialog v-model="dialog" scrollable fullscreen persistent>
    <v-container class="bottom-container pa-0" fluid>
      <v-toolbar class="rounded-t-xl" color="white" :title="series.title" density="comfortable">
        <v-spacer></v-spacer>
        <v-btn icon @click="onClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container class="bg-white" fluid>
        <v-row justify="center">
          <v-col cols="12">
            <v-carousel
              :height="448"
              :continuous="false"
              :show-arrows="false"
              hide-delimiter-background
            >
              <div id="share-content">
                <v-carousel-item v-for="(asset, index) in tra.assetList" :key="index">
                  <v-card class="ma-3">
                    <v-row justify="center">
                      <v-col cols="auto">
                        <LazyImage
                          bg-color="bg-white"
                          :src="tra.traInfo.image"
                          width="218"
                          :aspect-ratio="1"
                          contain
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-card-text>#{{ asset.id }}</v-card-text>
                        <v-chip v-if="asset.value === 0 || asset.writeOff === true">
                          Redeemed
                        </v-chip>
                        <v-card-item>
                          <v-card-title>{{ tra.traInfo.title }}</v-card-title>
                          <v-card-subtitle>{{ tra.traInfo.description }}</v-card-subtitle>
                        </v-card-item>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-carousel-item>
              </div>
            </v-carousel>
          </v-col>
          <v-col cols="10">
            <v-btn
              class="text-capitalize"
              elevation="0"
              color="primary"
              block
              rounded
              @click="shareViaWebShare"
              >Share</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </v-dialog>

  <Loading :overlay="overlay" />
</template>
