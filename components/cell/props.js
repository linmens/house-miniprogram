const props = {
  align: {
    type: String,
    value: 'middle',
  },
  arrow: {
    type: null,
    value: false,
  },
  key: {
    type: String
  },
  bordered: {
    type: Boolean,
    value: true,
  },
  description: {
    type: String,
  },
  titleRightIcon: {
    type: String,
  },
  suffix: {
    type: String,
  },
  externalClasses: {
    type: Array,
  },
  hover: {
    type: Boolean,
  },
  image: {
    type: String,
  },
  jumpType: {
    type: String,
    value: 'navigateTo',
  },
  leftIcon: {
    type: null,
  },
  note: {
    type: String,
  },
  required: {
    type: Boolean,
    value: false,
  },
  rightIcon: {
    type: null,
  },
  title: {
    type: String,
  },
  url: {
    type: String,
    value: '',
  },
};
export default props;