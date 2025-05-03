import { CardInterface } from "./card";
import { IItem, IClickAction } from "../../types";
import { IEvents } from "../base/events";

export interface ICard {
    text: HTMLElement;
    button: HTMLElement;
    render(data: IItem): HTMLElement;
}

export class CardPreviewInterface extends CardInterface implements ICard {
  text: HTMLElement;
  button: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IClickAction) {
    super(template, events, actions);
    this.text = this.cardElement.querySelector('.card__text');
    this.button = this.cardElement.querySelector('.card__button');
    this.button.addEventListener('click', () => { this.events.emit('card:addBasket') });
  }

  checkAvailability(data:IItem) {
    if(data.price) {
      return 'Купить'
    } else {
      this.button.setAttribute('disabled', 'true')
      return 'Не продается'
    }
  }

  render(data: IItem): HTMLElement {
    this.categoryElement.textContent = data.category;
    this.category = data.category;
    this.titleElement.textContent = data.title;
    this.imageElement.src = data.imageUrl;
    this.imageElement.alt = this.titleElement.textContent;
    this.priceElement.textContent = this.formatPrice(data.price);
    this.text.textContent = data.description;
    this.button.textContent = this.checkAvailability(data);
    return this.cardElement;
  }
}