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

  constructor(
    template: HTMLTemplateElement,
    protected events: IEvents,
    actions?: IClickAction
  ) {
    super(template, events, actions);
    this.text = this.cardElement.querySelector(".card__text");
    this.button = this.cardElement.querySelector(".card__button");
    this.button.addEventListener("click", () => {
      if (!this.button.hasAttribute("disabled")) {
        this.events.emit("card:addBasket");
      }
    });
  }

  private getButtonState(data: IItem): { text: string; disabled: boolean } {
    if ((data as any).inBasket) {
      return { text: "Уже в корзине", disabled: true };
    }
    if (!data.price) {
      return { text: "Не продается", disabled: true };
    }
    return { text: "Купить", disabled: false };
  }

  render(data: IItem): HTMLElement {
    this.categoryElement.textContent = data.category;
    this.category = data.category;
    this.titleElement.textContent = data.title;
    this.imageElement.src = data.imageUrl;
    this.imageElement.alt = this.titleElement.textContent;
    this.priceElement.textContent = this.formatPrice(data.price);
    this.text.textContent = data.description;

    const { text, disabled } = this.getButtonState(data);
    this.button.textContent = text;
    if (disabled) {
      this.button.setAttribute("disabled", "true");
    } else {
      this.button.removeAttribute("disabled");
    }

    return this.cardElement;
  }
}
