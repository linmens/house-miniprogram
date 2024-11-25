// app.js
App({
  globalData: {
    theme: 'dark', // system 、dark 、 light
    themeStyle: `
     background: no-repeat var(--global-bg-img) var(--color-bg-b0);
     background-color: var(--color-bg-b0);
    --td-primary-color-1: #1b2f51;
    --td-primary-color-2: #173463;
    --td-primary-color-3: #143975;
    --td-primary-color-4: #103d88;
    --td-primary-color-5: #0d429a;
    --td-primary-color-6: #054bbe;
    --td-primary-color-7: #2667d4;
    --td-primary-color-8: #4582e6;
    --td-primary-color-9: #699ef5;
    --td-primary-color-10: #96bbf8;
    --td-warning-color-1: #4f2a1d;
    --td-warning-color-2: #582f21;
    --td-warning-color-3: #733c23;
    --td-warning-color-4: #a75d2b;
    --td-warning-color-5: #cf6e2d;
    --td-warning-color-6: #dc7633;
    --td-warning-color-7: #e8935c;
    --td-warning-color-8: #ecbf91;
    --td-warning-color-9: #eed7bf;
    --td-warning-color-10: #f3e9dc;
    --td-error-color-1: #472324;
    --td-error-color-2: #5e2a2d;
    --td-error-color-3: #703439;
    --td-error-color-4: #83383e;
    --td-error-color-5: #a03f46;
    --td-error-color-6: #c64751;
    --td-error-color-7: #de6670;
    --td-error-color-8: #ec888e;
    --td-error-color-9: #edb1b6;
    --td-error-color-10: #eeced0;
    --td-success-color-1: #193a2a;
    --td-success-color-2: #1a4230;
    --td-success-color-3: #17533d;
    --td-success-color-4: #0d7a55;
    --td-success-color-5: #059465;
    --td-success-color-6: #43af8a;
    --td-success-color-7: #46bf96;
    --td-success-color-8: #80d2b6;
    --td-success-color-9: #b4e1d3;
    --td-success-color-10: #deede8;
    --td-gray-color-1: #f3f3f3;
    --td-gray-color-2: #eee;
    --td-gray-color-3: #e8e8e8;
    --td-gray-color-4: #ddd;
    --td-gray-color-5: #c6c6c6;
    --td-gray-color-6: #a6a6a6;
    --td-gray-color-7: #8b8b8b;
    --td-gray-color-8: #777;
    --td-gray-color-9: #5e5e5e;
    --td-gray-color-10: #4b4b4b;
    --td-gray-color-11: #383838;
    --td-gray-color-12: #2c2c2c;
    --td-gray-color-13: #242424;
    --td-gray-color-14: #181818;
    --td-font-white-1: rgba(255, 255, 255, 0.9);
    --td-font-white-2: rgba(255, 255, 255, 0.55);
    --td-font-white-3: rgba(255, 255, 255, 0.35);
    --td-font-white-4: rgba(255, 255, 255, 0.22);
    --td-font-gray-1: rgba(0, 0, 0, 0.9);
    --td-font-gray-2: rgba(0, 0, 0, 0.6);
    --td-font-gray-3: rgba(0, 0, 0, 0.4);
    --td-font-gray-4: rgba(0, 0, 0, 0.26);
    --td-brand-color: var(--td-primary-color-8);
    --td-warning-color: var(--td-warning-color-5);
    --td-error-color: var(--td-error-color-6);
    --td-success-color: var(--td-success-color-5);
    --td-brand-color-focus: var(--td-primary-color-1);
    --td-brand-color-active: var(--td-primary-color-9);
    --td-brand-color-disabled: var(--td-primary-color-3);
    --td-brand-color-light: var(--td-primary-color-1);
    --td-brand-color-light-active: var(--td-primary-color-2);
    --td-warning-color-focus: var(--td-warning-color-2);
    --td-warning-color-active: var(--td-warning-color-4);
    --td-warning-color-disabled: var(--td-warning-color-3);
    --td-warning-color-light: var(--td-warning-color-1);
    --td-warning-color-light-active: var(--td-warning-color-2);
    --td-error-color-focus: var(--td-error-color-2);
    --td-error-color-active: var(--td-error-color-5);
    --td-error-color-disabled: var(--td-error-color-3);
    --td-error-color-light: var(--td-error-color-1);
    --td-error-color-light-active: var(--td-error-color-2);
    --td-success-color-focus: var(--td-success-color-2);
    --td-success-color-active: var(--td-success-color-4);
    --td-success-color-disabled: var(--td-success-color-3);
    --td-success-color-light: var(--td-success-color-1);
    --td-success-color-light-active: var(--td-success-color-2);
    --td-mask-active: rgba(0, 0, 0, 0.4);
    --td-mask-disabled: rgba(0, 0, 0, 0.6);
    --td-bg-color-page: var(--td-gray-color-14);
    --td-bg-color-container: var(--td-gray-color-13);
    --td-bg-color-secondarycontainer: var(--td-gray-color-12);
    --td-bg-color-component: var(--td-gray-color-11);
    --td-bg-color-container-active: var(--td-gray-color-12);
    --td-bg-color-secondarycontainer-active: var(--td-gray-color-11);
    --td-bg-color-component-active: var(--td-gray-color-10);
    --td-bg-color-component-disabled: var(--td-gray-color-12);
    --td-bg-color-specialcomponent: transparent;
    --td-text-color-primary: var(--td-font-white-1);
    --td-text-color-secondary: var(--td-font-white-2);
    --td-text-color-placeholder: var(--td-font-white-3);
    --td-text-color-disabled: var(--td-font-white-4);
    --td-text-color-anti: var(--td-font-gray-1);
    --td-text-color-brand: var(--td-primary-color-8);
    --td-text-color-link: var(--td-primary-color-8);
    --td-border-level-1-color: var(--td-gray-color-11);
    --td-component-stroke: var(--td-gray-color-11);
    --td-border-level-2-color: var(--td-gray-color-9);
    --td-component-border: var(--td-gray-color-9);
    --td-shadow-1: 0 4px 6px rgba(0, 0, 0, 0.06), 0 1px 10px rgba(0, 0, 0, 8%), 0 2px 4px rgba(0, 0, 0, 12%);
    --td-shadow-2: 0 8px 10px rgba(0, 0, 0, 0.12), 0 3px 14px rgba(0, 0, 0, 10%), 0 5px 5px rgba(0, 0, 0, 16%);
    --td-shadow-3: 0 16px 24px rgba(0, 0, 0, 0.14), 0 6px 30px rgba(0, 0, 0, 12%), 0 8px 10px rgba(0, 0, 0, 20%);
    --td-shadow-inset-top: inset 0 0.5px 0 #5e5e5e;
    --td-shadow-inset-right: inset 0.5px 0 0 #5e5e5e;
    --td-shadow-inset-bottom: inset 0 -0.5px 0 #5e5e5e;
    --td-shadow-inset-left: inset -0.5px 0 0 #5e5e5e;
    --td-table-shadow-color: rgba(0, 0, 0, 0.55);
    --td-scrollbar-color: rgba(255, 255, 255, 0.1);
    --td-scroll-track-color: #333;
  --semi-grey-9: 249, 249, 249;
    --color-fill-hover: rgba(var(--neutral-100), 0.08);
    --color-text-t0: rgba(var(--white), 1);
    --color-text-t1: rgba(var(--white), 0.9);
    --color-text-t2: rgba(var(--white), 0.75);
    --color-text-t3: rgba(var(--white), 0.6);
    --td-text-card-color: rgb(194, 215, 239);
    --color-line-l3: rgba(var(--white), 0.04);
    --color-bg-b0: rgba(var(--neutral-950), 1);
    --color-bg-b1-white: rgba(var(--neutral-900), 1);
    --color-bg-b2: rgba(var(--neutral-800), 1);
    --color-secondary-default: rgba(var(--neutral-100), 0.08);
    --semi-color-text-2: rgba(var(--semi-grey-9), 0.6);
    --td-tab-bar-active-bg: var(--color-fill-hover);
    --td-tab-bar-bg-color: var(--color-bg-b1-white);
    --td-cell-bg-color: var(--color-bg-b1-white);
    --td-notice-bar-info-bg-color: transparent;
    --td-bg-color-secondarycontainer: var(--color-secondary-default);
    --td-guide-popover-border: 0.5px solid var(--color-line-l3);
    `
  },
  onLaunch() {
    wx.hideTabBar()

    this.checkForUpdates(); // 检查更新
  },
  checkForUpdates() {
    // 获取更新管理器实例
    const updateManager = wx.getUpdateManager();

    // 检测新版本
    updateManager.onCheckForUpdate((res) => {
      console.log('是否有新版本:', res.hasUpdate);
      // 如果需要，也可以在这里自定义逻辑，比如记录日志或更新UI。
    });

    // 监听新版本下载完成
    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已准备好，是否立即重启应用？',
        confirmText: '立即更新',
        cancelText: '稍后',
        success(res) {
          if (res.confirm) {
            // 应用新版本并重启
            updateManager.applyUpdate();
          } else {
            console.log('用户选择稍后更新');
          }
        },
      });
    });

    // 监听新版本下载失败
    updateManager.onUpdateFailed(() => {
      wx.showModal({
        title: '更新失败',
        content: '新版本下载失败，请检查网络连接或稍后重试。',
        showCancel: false, // 不显示取消按钮
        confirmText: '知道了',
      });
    });
  },
  onThemeChange(theme) {
    console.log(theme)
  }
})