let initData = [
  { label: '09-09', count: 140 },
  { label: '09-10', count: 30 },
  { label: '09-11', count: 230 },
  { label: '09-12', count: 280 },
  { label: '09-13', count: 90 },
  { label: '09-14', count: 180 },
  { label: '09-15', count: 200 }
]

new Vue({
  el: '#app',

  data: {
    raw: JSON.stringify(initData, null, 2),
    width: 600,
    height: 400,
    m: { x: 0, v: false }
  },

  template: `
    <div id="app">
      <svg :viewBox="viewBox" @mousemove="move" ref="svg">
        <g v-for="(y, i) in ySteps" :key="i" class="y-line">
          <text :x="42" :y="height - 50 - i * yGap">{{ y }}</text>
          <line :x1="50" :y1="height - 50 - i * yGap" :x2="width - 50" :y2="height - 50 - i * yGap"></line>
        </g>
        <g v-for="(x, i) in counts" :key="i" class="x-line">
          <text :x="50 + (i + 0.5) * xGap" :y="height - 28">{{ x.label }}</text>
          <line :x1="50 + (i + 0.5) * xGap" :y1="height - 50" :x2="50 + (i + 0.5) * xGap" :y2="height - 40"></line>
        </g>
        <line class="m-line" v-show="m.v" :x1="m.x" y1="50" :x2="m.x" :y2="height - 50"></line>
        <path class="v-path" :d="d"></path>
        <g v-for="(p, i) in points" :key="i" class="v-point">
          <circle :cx="p.x" :cy="p.y"></circle>
          <rect :x="p.x + 10" :y="p.y - 9" width="30" height="16" rx="2" ry="2"></rect>
          <text :x="p.x + 25" :y="p.y">{{ p.v }}</text>
        </g>
      </svg>
      <textarea v-model="raw"></textarea>
    </div>
  `,

  computed: {
    viewBox () {
      return `0 0 ${this.width} ${this.height}`
    },

    counts () {
      return JSON.parse(this.raw)
    },

    max () {
      return Math.max(...this.counts.map(day => day.count))
    },

    min () {
      return Math.min(...this.counts.map(day => day.count))
    },

    xGap () {
      return Math.floor((this.width - 100) / this.counts.length)
    },

    yGap () {
      let steps = Math.ceil(this.max / 50)
      return Math.floor((this.height - 100) / steps)
    },

    ySteps () {
      let len = Math.ceil(this.max / 50)
      return Array(len + 1).fill().map((e, i) => {
        return i * 50
      })
    },

    points () {
      let upper = Math.ceil(this.max / 50) * 50
      return this.counts.map((day, i) => {
        return {
          x: 50 + (i + 0.5) * this.xGap,
          y: this.height - 50 - day.count * this.yGap / 50,
          v: day.count
        }
      })
    },

    d () {
      return this.points.reduce((s, p) => `${s} ${p.x},${p.y}`, 'M')
    },

    area () {
      let { top, left, right, bottom } = this.$refs.svg.getBoundingClientRect()
      return {
        top: top + 50,
        left: left + 50,
        right: right - 50,
        bottom: bottom - 50
      }
    }
  },

  methods: {
    move (e) {
      let { top, left, right, bottom } = this.area
      let { clientX: x, clientY: y } = e
      if (x > left && x < right && y > top && y < bottom) {
        this.m.x = x - left + 50
        this.m.v = true
      } else {
        this.m.v = false
      }
    }
  }
})
