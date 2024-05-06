<template>
  <div>
    {{ isText }}
  </div>
</template>

<script>
const filter = (text, length, clamp) => {
  clamp = clamp || '...'
  return text.length > length ? text.slice(0, length) + clamp : text
}
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    length: {
      type: Number,
      default: 20
    },
    clamp: {
      type: String,
      default: '...'
    }
  },
  data () {
    return {
      isText: this.text
    }
  },
  mounted () {
    this.isText = filter(this.isText, this.length)
  }
}
</script>
