<template>
  <div
    :key="videoKey"
    :class="['video-player', className]"
  >
    <div class="video-player__wrapper">
      <div
        v-if="!thumbnail || isVideoShown"
        class="video-player__content"
      >
        <div
          v-if="videoType === 'Vimeo'"
          class="video-player__video"
        >
          <vimeo-player
            ref="player"
            :video-id="videoUrl"
            :autoplay="true"
            @ready="vimeoMute"
          />
        </div>
        <div
          v-else-if="videoType === 'Youtube'"
          class="video-player__video"
        >
          <youtube
            ref="youtube"
            :player-vars="{ autoplay: isAutoPlay ? 1 : 0, muted: 1, controls: 1 }"
            :video-id="videoId"
          />
        </div>
        <video
          v-else
          class="video-player__video"
          loop
          playsinline
          muted
          controls
          autoplay
        >
          <source
            :src="videoUrl"
            type="video/mp4"
          >
        </video>
      </div>
      <div
        v-if="thumbnail && !isVideoShown"
        class="video-player__thumbnail"
      >
        <slot v-bind="{ showVideo }" />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueYoutube from 'vue-youtube'
import vueVimeoPlayer from 'vue-vimeo-player'
import { on } from 'lib/dom'
import debounce from 'lodash.debounce'

Vue.use(VueYoutube)
Vue.use(vueVimeoPlayer)

export default {
  props: {
    className: {
      type: String,
      default: ''
    },
    videoUrl: {
      type: String,
      default: ''
    },
    videoType: {
      type: String,
      default: ''
    },
    thumbnail: {
      type: String,
      default: ''
    },
    isAutoPlay: Boolean
  },
  data () {
    return {
      videoKey: 0,
      isVideoShown: false
    }
  },
  computed: {
    videoId () {
      return this.$youtube.getIdFromUrl(this.videoUrl)
    }
  },
  mounted () {
    if (this.$refs.youtube || this.$refs.player) {
      const videoEl = this.$refs.youtube.$root.$el || this.$refs.player.$root.$el
      this.onScroll(videoEl)
      on('scroll', debounce(() => {
        this.onScroll(videoEl)
      }, 500), window)
    }
  },
  methods: {
    vimeoPlay () {
      this.$refs.vimeo.play()
    },
    onScroll (el) {
      const videoPosition = el.getBoundingClientRect()
      if (videoPosition.top < window.innerHeight && this.videoKey === 0) {
        this.play()
        this.videoKey = 1
      }
    },
    showVideo () {
      this.isVideoShown = true
    },
    play () {
      this.$nextTick(() => {
        if (this.videoType === 'Youtube' && this.$refs.youtube) {
          this.$refs.youtube.player.playVideo()
        } else if (this.videoType === 'Vimeo' && this.$refs.vimeo) {
          this.$refs.vimeo.play()
        } else if (this.$refs.mp4) {
          this.$refs.mp4.play()
        }
      })
    }
  }
}

</script>
