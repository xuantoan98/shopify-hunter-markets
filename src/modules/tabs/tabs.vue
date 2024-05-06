<template>
  <div
    v-cloak
    class="tabs"
  >
    <div
      v-if="useDropdown"
      class="form__select-wrapper form__select-wrapper--tabs tabs__select-wrapper"
    >
      <select
        class="select"
        @change="activateTab($event.target.value)"
      >
        <option
          v-for="(panel, index) in panels"
          :key="index"
          :value="index"
          :selected="index === currentTabIndex"
        >
          {{ panel.label }}
        </option>
      </select>
      <svg
        viewBox="0 0 320 512"
        class="form__select-icon"
      >
        <use
          xmlns:xlink="http://www.w3.org/1999/xlink"
          xlink:href="#icon-caret-down"
          x="0"
          y="0"
        />
      </svg>
    </div>
    <div
      v-else
      class="tabs__list"
      role="tablist"
      :aria-label="title"
    >
      <button
        v-for="(panel, index) in panels"
        :key="index"
        :class="['tabs__button h5', { 'is-active': index === currentTabIndex }]"
        :aria-selected="index === currentTabIndex"
        role="tab"
        @click="activateTab(index)"
      >
        {{ panel.label }}
      </button>
    </div>
    <div class="tabs__panels">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    useDropdown: {
      type: Boolean,
      default: false
    }
  },
  provide () {
    return {
      registerPanel: this.registerPanel.bind(this)
    }
  },
  data () {
    return {
      panels: [],
      currentTabIndex: null
    }
  },
  watch: {
    currentTabIndex: {
      immediate: false,
      handler (newIndex, oldIndex) {
        if (this.panels.length && this.panels[newIndex]) {
          this.panels[newIndex].activate()
          if (this.panels[oldIndex]) {
            this.panels[oldIndex].deactivate()
          }
        }
      }
    }
  },
  methods: {
    activateTab (index) {
      this.currentTabIndex = index
    },
    registerPanel (tab) {
      this.panels.push(tab)

      if (tab.isActive) {
        this.currentTabIndex = this.panels.length - 1
      }
    }
  }
}
</script>
