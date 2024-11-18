var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
    d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import {
  SuperComponent,
  wxComponent
} from '../common/src/index';
import config from '../common/config';
import props from './props';
const {
  prefix
} = config;
const name = `${prefix}-card`;

let Card = class Card extends SuperComponent {
  constructor() {
    super(...arguments);
    this.externalClasses = [
      `${prefix}-class`,
      `${prefix}-class-header`,
    ];
    console.log(this.externalClasses)
    this.options = {
      multipleSlots: true,
    };
    this.properties = props;
    this.data = {

    };
  }
}
Card = __decorate([
  wxComponent()
], Card);
export default Card;