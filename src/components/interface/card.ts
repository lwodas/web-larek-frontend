import { IItem, IClickAction } from "../../types";
import { IEvents } from "../base/events";

export interface ICard {
    render(Data: IItem): HTMLElement;
}

export class CardInterface implements ICard {
    protected cardElement: HTMLElement;
    protected categoryElement: HTMLElement;
    protected titleElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected priceElement: HTMLElement;
    protected categoryColors = <Record<string, string>>{
        "дополнительное": "additional",
        "софт-скил": "soft",
        "кнопка": "button",
        "хард-скил": "hard",
        "другое": "other",
    };

    constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IClickAction) {
        this.cardElement = template.content.querySelector('.card').cloneNode(true) as HTMLElement;
        this.categoryElement = this.cardElement.querySelector('.card__category');
        this.titleElement = this.cardElement.querySelector('.card__title');
        this.imageElement = this.cardElement.querySelector('.card__image');
        this.priceElement = this.cardElement.querySelector('.card__price');

        if (actions?.onClick) {
            this.cardElement.addEventListener('click', actions.onClick);
        }
    }

    protected setElementText(element: HTMLElement, value: unknown): void {
        if (element) {
            element.textContent = String(value);
        }
    }

    set category(value: string) {
        this.setElementText(this.categoryElement, value);
        this.categoryElement.className = `card__category card__category_${this.categoryColors[value]}`;
    }

    protected formatPrice(value: number | null): string {
        if (value === null) {
            return 'Бесценно';
        }
        return `${value} синапсов`;
    }

    render(Data: IItem): HTMLElement {
        this.categoryElement.textContent = Data.category;
        this.category = Data.category;
        this.titleElement.textContent = Data.title;
        this.imageElement.src = Data.imageUrl;
        this.imageElement.alt = this.titleElement.textContent;
        this.priceElement.textContent = this.formatPrice(Data.price);
        return this.cardElement;
    }
}
