import { createElement } from "../../utils/utils";
import { IEvents } from "../base/events";

export interface IBasket {
    basketElement: HTMLElement;
    titleElement: HTMLElement;
    productListElement: HTMLElement;
    checkoutButton: HTMLButtonElement;
    totalPriceElement: HTMLElement;
    headerBasketButton: HTMLButtonElement;
    headerBasketCounter: HTMLElement;
    updateHeaderCartCounter(count: number): void;
    updateTotalPrice(total: number): void;
    render(): HTMLElement;
}
  
export class BasketInterface implements IBasket {
    basketElement: HTMLElement;
    titleElement: HTMLElement;
    productListElement: HTMLElement;
    checkoutButton: HTMLButtonElement;
    totalPriceElement: HTMLElement;
    headerBasketButton: HTMLButtonElement;
    headerBasketCounter: HTMLElement;
  
    constructor(template: HTMLTemplateElement, protected eventManager: IEvents) {
        this.basketElement = template.content.querySelector('.basket').cloneNode(true) as HTMLElement;
        this.titleElement = this.basketElement.querySelector('.modal__title');
        this.productListElement = this.basketElement.querySelector('.basket__list');
        this.checkoutButton = this.basketElement.querySelector('.basket__button');
        this.totalPriceElement = this.basketElement.querySelector('.basket__price');
        this.headerBasketButton = document.querySelector('.header__basket');
        this.headerBasketCounter = document.querySelector('.header__basket-counter');
    
        this.checkoutButton.addEventListener('click', () => { this.eventManager.emit('order:open') });
        this.headerBasketButton.addEventListener('click', () => { this.eventManager.emit('basket:open') });
    
        this.basketItems = [];
    }
  
    set basketItems(items: HTMLElement[]) {
        if (items.length) {
            this.productListElement.replaceChildren(...items);
            this.checkoutButton.removeAttribute('disabled');
        } else {
            this.checkoutButton.setAttribute('disabled', 'disabled');
            this.productListElement.replaceChildren(createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' }));
        }
    }
  
    updateHeaderCartCounter(count: number) {
        this.headerBasketCounter.textContent = String(count);
    }
  
    updateTotalPrice(total: number) {
        this.totalPriceElement.textContent = `${total} синапсов`;
    }
  
    render() {
        this.titleElement.textContent = 'Корзина';
        return this.basketElement;
    }
}