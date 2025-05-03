import { IEvents } from "../base/events";

export interface IForm {
    orderForm: HTMLFormElement;
    paymentButtons: HTMLButtonElement[];
    selectedPaymentMethod: string;
    errorContainer: HTMLElement;
    render(): HTMLElement;
}

export class FormInterface implements IForm {
    orderForm: HTMLFormElement;
    paymentButtons: HTMLButtonElement[];
    submitButton: HTMLButtonElement;
    errorContainer: HTMLElement;

    constructor(template: HTMLTemplateElement, protected events: IEvents) {
        this.orderForm = template.content.querySelector('.form').cloneNode(true) as HTMLFormElement;
        this.paymentButtons = Array.from(this.orderForm.querySelectorAll('.button_alt'));
        this.submitButton = this.orderForm.querySelector('.order__button');
        this.errorContainer = this.orderForm.querySelector('.form__errors');

        this.paymentButtons.forEach(item => {
        item.addEventListener('click', () => {
            this.selectedPaymentMethod = item.name;
            events.emit('order:paymentSelection', item);
        });
        });

        this.orderForm.addEventListener('input', (event: Event) => {
            const target = event.target as HTMLInputElement;
            const field = target.name;
            const value = target.value;
            this.events.emit(`order:changeAddress`, { field, value });
        });

        this.orderForm.addEventListener('submit', (event: Event) => {
        event.preventDefault();
        this.events.emit('contacts:open');
        });
    }

    set selectedPaymentMethod(paymentMethod: string) {
        this.paymentButtons.forEach(item => {
        item.classList.toggle('button_alt-active', item.name === paymentMethod);
        })
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    render() {
        return this.orderForm;
    }
}