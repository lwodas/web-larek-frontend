import { IEvents } from '../base/events';
import { IOrderFormErrors } from '../../types/index'

export interface IFormModel {
    paymentMethod: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
    setAddress(field: string, value: string): void
    validateAddress(): boolean;
    setContactInfo(field: string, value: string): void
    validateContactInfo(): boolean;
    getOrderData(): object;
}

export class FormModel implements IFormModel {
    paymentMethod: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
    formErrors: IOrderFormErrors = {};

    constructor(protected events: IEvents) {
        this.paymentMethod = '';
        this.email = '';
        this.phone = '';
        this.address = '';
        this.total = 0;
        this.items = [];
    }

    setAddress(field: string, value: string) {
        if (field === 'address') {
            this.address = value;
        }

        if (this.validateAddress()) {
            this.events.emit('order:ready', this.getOrderData());
        }
    }

    validateAddress() {
        const addressRegex = /^[а-яА-ЯёЁa-zA-Z0-9\s\/.,-]{7,}$/;
        const errors: typeof this.formErrors = {};

        if (!this.address) {
            errors.address = 'Необходимо указать адрес';
        } else if (!addressRegex.test(this.address)) {
            errors.address = 'Укажите настоящий адрес';
        } else if (!this.paymentMethod) {
            errors.payment = 'Выберите способ оплаты';
        }


        this.formErrors = errors;
        this.events.emit('formErrors:address', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    setContactInfo(field: string, value: string) {
        if (field === 'email') {
            this.email = value;
        } else if (field === 'phone') {
            this.phone = value;
        }

        if (this.validateContactInfo()) {
            this.events.emit('order:ready', this.getOrderData());
        }
    }

    validateContactInfo() {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const phoneRegex = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{10}$/;
        const errors: typeof this.formErrors = {};

        if (!this.email) {
            errors.email = 'Необходимо указать email';
        } else if (!emailRegex.test(this.email)) {
            errors.email = 'Некорректный адрес электронной почты';
        }

        if (this.phone.startsWith('8')) {
            this.phone = '+7' + this.phone.slice(1);
        }

        if (!this.phone) {
            errors.phone = 'Необходимо указать телефон';
        } else if (!phoneRegex.test(this.phone)) {
            errors.phone = 'Некорректный формат номера телефона';
        }

        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    getOrderData() {
        return {
            payment: this.paymentMethod,
            email: this.email,
            phone: this.phone,
            address: this.address,
            total: this.total,
            items: this.items,
        }
    }
}