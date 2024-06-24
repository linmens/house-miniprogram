Component({
  /**
   * 组件的属性列表
   */
  properties: {
    calcForm: Object,
    unitTypes: Array,
    buyTypes: Array,
    areaTypes: Array,
    chanquanTypes: Array,
    userIndex: Number
  },
  options: {
    virtualHost: true
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    initTrack() {
      console.log(this.selectComponent('#areaTabs'), 'areaTabs')
      this.selectComponent('#areaTabs').initTrack()
    },
    onTypesChange(e) {
      this.triggerEvent('typesChange', e.detail);
    },
    onBuyTypesChange(e) {
      this.triggerEvent('buyTypesChange', e.detail);
    },
    onAreaTypesChange(e) {
      this.triggerEvent('areaTypesChange', e.detail);
    },
    onCustomAreaChange(e) {
      this.triggerEvent('onCustomAreaChange', e.detail)
    },
    onChanquanTypesChange(e) {
      this.triggerEvent('onChanquanTypesChange', e.detail);
    },
    onHouseAgeChange(e) {
      this.triggerEvent('houseAgeChange', e.detail);
    },
    showYearPicker() {
      this.triggerEvent('showYearPicker');
    },
    updateChildren() {
      this.selectComponent('#basicGroupRef').updateLastChid()
    }
  }
})