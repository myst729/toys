let initData = [
  { name: 'chrome', count: 300, color: 'hsl(0, 100%, 50%)' },
  { name: 'ie', count: 180, color: 'hsl(30, 100%, 50%)' },
  { name: 'edge', count: 120, color: 'hsl(60, 100%, 50%)' },
  { name: 'firefox', count: 80, color: 'hsl(120, 100%, 50%)' },
  { name: 'safari', count: 50, color: 'hsl(180, 100%, 50%)' },
  { name: 'opera', count: 30, color: 'hsl(240, 100%, 50%)' },
  { name: 'others', count: 40, color: 'hsl(300, 100%, 50%)' }
]

new Vue({
  el: '#app',

  data: {
    raw: JSON.stringify(initData, null, 2),
    initialized: initData.length - 1,
    selected: -2,
    width: 800
  },

  template: `
    <div id="app">
      <div class="chart">
        <div
          v-for="(browser, i) in browsers"
          :key="i"
          :class="{ browser: true, [browser.name]: true, highlight: i === selected }"
          :style="getBrowserStyle(browser)"
          @click="select(i)">
          <div
            :class="{ slice: true, front: true, initialized: i > initialized }"
            :style="getSliceStyle(browser, 'front')">
          </div>
          <div
            :class="{ slice: true, left: true, initialized: i > initialized }"
            :style="getSliceStyle(browser, 'left')">
          </div>
          <div
            :class="{ slice: true, top: true, initialized: i > initialized }"
            :style="getSliceStyle(browser, 'top')">
          </div>
        </div>
      </div>
      <div class="highlighted">{{ highlighted }}&nbsp;</div>
      <textarea v-model="raw"></textarea>
    </div>
  `,

  computed: {
    browsers () {
      return JSON.parse(this.raw).reverse()
    },

    total () {
      return this.browsers.reduce((count, browser) => {
        return count + browser.count
      }, 0)
    },

    highlighted () {
      if (this.selected > -1) {
        let { name, count, percent } = this.browsers[this.selected]
        return { name, count, percent }
      }
    }
  },

  methods: {
    getBrowserStyle (browser) {
      let proportion = browser.count / this.total
      browser.percent = (100 * proportion).toFixed(2) + '%'
      return {
        width: (proportion * this.width) + 'px'
      }
    },

    getSliceStyle (browser, slice) {
      let light = browser.color.replace(', 50%)', ', 60%)')
      let lighter = browser.color.replace(', 50%)', ', 70%)')
      let lightest = browser.color.replace(', 50%)', ', 80%)')
      switch (slice) {
        case 'front':
          return { 'background-color': browser.color }
        case 'left':
          return { 'background-image': `linear-gradient(${lighter}, ${browser.color})` }
        case 'top':
          // return { 'background-color': light }
          return { 'background-image': `linear-gradient(125deg, ${lighter}, ${light})` }
      }
    },

    select (i) {
      this.selected = (this.selected === i) ? -1 : i
      // this.$emit('stack-select')
    },

    appear () {
      this.initialized -= 1
      if (this.initialized > -1) {
        setTimeout(this.appear, 200)
      }
    }
  },

  mounted () {
    setTimeout(this.appear, 50)

    setTimeout(() => {
      if (this.selected === -2) {
        this.selected = this.browsers.length - 1
      }
    }, 2000)
  }
})
