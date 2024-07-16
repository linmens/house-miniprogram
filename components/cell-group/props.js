const props = {
  bordered: {
    type: Boolean,
  },
  externalClasses: {
    type: Array,
  },
  theme: {
    type: String,
    value: 'default',
  },
  title: {
    type: String,
    value: '',
  },
  hasBackground: {
    type: Boolean,
    value: false
  },
  rightConfig: {
    type: Object,
  }
};
export default props;