import { IItem, IClickAction } from "../../types";
import { IEvents } from "../base/events";

export interface IBasketItem {
    basketItem: HTMLElement;
    basketItemIndex:HTMLElement;
	basketItemTitle: HTMLElement;
	basketItemPrice: HTMLElement;
	buttonDelete: HTMLButtonElement;
	render(data: IItem, item: number): HTMLElement;
}

export class BasketItemInterface implements IBasketItem {
    basketItem: HTMLElement;
	basketItemIndex:HTMLElement;
	basketItemTitle: HTMLElement;
	basketItemPrice: HTMLElement;
	buttonDelete: HTMLButtonElement;

    constructor (template: HTMLTemplateElement, protected events: IEvents, actions?: IClickAction) {
        this.basketItem = template.content.querySelector('.basket__item').cloneNode(true) as HTMLElement;
        this.basketItemIndex = this.basketItem.querySelector('.basket__item-index');
        this.basketItemTitle = this.basketItem.querySelector('.card__title');
        this.basketItemPrice = this.basketItem.querySelector('.card__price');
        this.buttonDelete = this.basketItem.querySelector('.basket__item-delete');

        if (actions?.onClick) {
            this.buttonDelete.addEventListener('click', actions.onClick);
        }
    }

	protected setPrice(value: number | null) {
        if (value === null) {
            return 'Бесценно'
        }
        return String(value) + ' синапсов'
    }

	render(data: IItem, item: number) {
		this.basketItemIndex.textContent = String(item);
		this.basketItemTitle.textContent = data.title;
		this.basketItemPrice.textContent = this.setPrice(data.price);
		return this.basketItem;
	}
}