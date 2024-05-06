<script>
import Vue from 'vue'
import VueYoutube from 'vue-youtube'
import { mapGetters } from 'vuex'

Vue.use(VueYoutube)

export default {
  computed: {
    player () {
      return this.$refs.youtube.player
    },
    ...mapGetters('heroCarouselVideo', ['videoId', 'isActive'])
  },
  methods: {
    playVideo () {
      this.player.playVideo()
    },
    deactivate () {
      this.$store.dispatch('heroCarouselVideo/hide')
    }
  }
}
</script>
