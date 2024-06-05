Component({
  /**
   * 组件的属性列表
   */
  properties: {
    calcForm: Object,
    unitTypes: Array,
    buyTypes: Array,
    areaTypes: Array,
    chanquanTypes: Array
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
    onTypesChange(e) {
      this.triggerEvent('typesChange', e.detail);
    },
    onBuyTypesChange(e) {
      this.triggerEvent('buyTypesChange', e.detail);
    },
    onAreaTypesChange(e) {
      this.triggerEvent('areaTypesChange', e.detail);
    },
    onChanquanTypesChange(e) {
      this.triggerEvent('chanquanTypesChange', e.detail);
    },
    onHouseAgeChange(e) {
      this.triggerEvent('houseAgeChange', e.detail);
    },
    showYearPicker() {
      this.triggerEvent('showYearPicker');
    }
  }
})