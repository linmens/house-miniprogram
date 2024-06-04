import {
  getRect,
} from '../../utils/util';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new(P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
Component({
  lifetimes: {
    created() {
      this.children = this.children || [];
    },
    attached() {
      this.initTrack()
    },
  },
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,

    },
    currentIndex: {
      type: Number,
      value: -1,
    },
    // 是否取消圆角
    roundless: {
      type: Boolean,
      value: false
    }
  },
  observers: {

  },
  options: {
    multipleSlots: true,
    virtualHost: true
  },
  /**
   * 组件的初始数据
   */
  data: {
    offset: 0,
    scrollLeft: 0,
    containerWidth: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initTrack() {
      getRect(this, `.l-tabs`).then((rect) => {

        this.setData({
          containerWidth: rect.width
        })
        wx.nextTick(async () => {
          this.setTrack();

        });
      });
    },
    onScroll(e) {
      const {
        scrollLeft
      } = e.detail;
      this.setData({
        scrollLeft,
      });
    },
    changeIndex(index) {

      const currentTab = this.data.list[index];
      const {
        value,
        label
      } = currentTab;

      if (!(currentTab === null) && index !== this.data.currentIndex) {
        this.triggerEvent('change', {
          index,
          value,
          label
        });
      }
      this.triggerEvent('click', {
        index,
        value,
        label
      });
      this.setData({
        currentIndex: index
      })
      this.setTrack();
    },
    tapOnItem(event) {
      const {
        index
      } = event.currentTarget.dataset;
      this.changeIndex(index);
    },
    setTrack() {
      return __awaiter(this, void 0, void 0, function* () {
        const {
          children
        } = this;

        if (!children)
          return;
        const {
          currentIndex,
          containerWidth
        } = this.data;
        if (currentIndex <= -1)
          return;
        try {
          const res = yield getRect(this, `.l-tabs__item`, true);

          const rect = res[currentIndex];
          if (!rect)
            return;
          let count = 0;
          let distance = 0;
          let totalSize = 0;
          res.forEach((item) => {
            if (count < currentIndex) {
              distance += item.width;
              count += 1;
            }
            totalSize += item.width;
          });
          if (containerWidth) {

            const maxOffset = res.reduce((acc, item) => acc + item.width, 0) - containerWidth;
            this.setData({
              offset: Math.min(Math.max(distance, 0), maxOffset),
            });
          }

          this.setData({
            trackStyle: `-webkit-transform: translateX(${distance}px);
            transform: translateX(${distance}px);
          `,
          });
        } catch (err) {
          this.triggerEvent('error', err);
        }
      });
    },

  }
})