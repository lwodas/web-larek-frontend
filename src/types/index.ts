import { ApiPostMethods } from "../components/base/api";
import { Api } from "../components/base/api"
import { ApiListResponse } from "../components/base/api"
import { createElement } from "../../utils/utils";
import { IEvents } from "./base/events";
const baseUrl = "http://localhost:3000/api/weblarek";

export interface IItem {
  id: string;
  description: string;
  imageUrl: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}


export interface IClickAction {
  onClick: (event: MouseEvent) => void;
}

export interface IOrderDetails {
  payment?: string;
  address?: string;
  phone?: string;
  email?: string;
  total?: string | number;
}

export interface IOrder extends IOrderDetails {
  items: string[];
}

export interface IOrderBatch {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export interface IOrderConfirmation {
  id: string;
  total: number;
}

export type IOrderFormErrors = Partial<Record<keyof IOrder, string>>;


export interface IBasket {
  productsInBasket: IItem[];
  getProductCount: () => number;
  getTotalPrice: () => number;
  addProductToBasket(product: IItem): void;
  removeProductFromBasket(product: IItem): void;
  clearBasket(): void;
}

export class BasketModel implements IBasket {
  protected productsInCart: IItem[];

  constructor() {
      this.productsInCart = [];
  }

  set productsInBasket(products: IItem[]) {
      this.productsInCart = products;
  }

  get productsInBasket() {
      return this.productsInCart;
  }

  getProductCount() {
      return this.productsInBasket.length;
  }

  getTotalPrice() {
      return this.productsInBasket.reduce((total, product) => total + (product.price || 0), 0);
  }

  addProductToBasket(product: IItem) {
      this.productsInCart.push(product);
  }

  removeProductFromBasket(product: IItem) {
      const index = this.productsInCart.indexOf(product);
      if (index >= 0) {
      this.productsInCart.splice(index, 1);
      }
  }

  clearBasket() {
      this.productsInBasket = [];
  }
}

export interface IData {
  productList: IItem[];
  selectedProduct: IItem;
  previewProduct(product: IItem): void;
}

export class DataModel implements IData {
  private products: IItem[];
  selectedProduct: IItem;

  constructor(private eventManager: IEvents) {
    this.products = [];
  }

  set productList(products: IItem[]) {
    this.products = products;
    this.eventManager.emit('products:updated');
  }

  get productList() {
    return this.products;
  }

  previewProduct(product: IItem) {
    this.selectedProduct = product;
    this.eventManager.emit('modalCard:open', product);
}
}


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

export interface IFormModel {
  paymentMethod: string;
  email: string;
  phone: string;
  address: string;
  setAddress(field: string, value: string): void;
  validateAddress(): boolean;
  setContactInfo(field: string, value: string): void;
  validateContactInfo(): boolean;
  getOrderData(items: string[], total: number): IOrderBatch;
}

export class FormModel implements IFormModel {
  paymentMethod: string;
  email: string;
  phone: string;
  address: string;
  formErrors: IOrderFormErrors = {};

  constructor(protected events: IEvents) {
      this.paymentMethod = '';
      this.email = '';
      this.phone = '';
      this.address = '';
  }

  setAddress(field: string, value: string) {
      if (field === 'address') {
          this.address = value;
      }

      if (this.validateAddress()) {
          this.events.emit('order:ready', this.getOrderData([], 0)); // Здесь передаются пустые значения, так как items и total будут переданы позже
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
          this.events.emit('order:ready', this.getOrderData([], 0)); // Здесь передаются пустые значения, так как items и total будут переданы позже
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

  getOrderData(items: string[], total: number): IOrderBatch {
      return {
          payment: this.paymentMethod,
          email: this.email,
          phone: this.phone,
          address: this.address,
          total: total,
          items: items,
      };
  }
}


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

export interface IFormContacts {
  formContacts: HTMLFormElement;
  inputAll: HTMLInputElement[];
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;
  render(): HTMLElement;
}

export class FormContactsInterface implements IFormContacts {
  formContacts: HTMLFormElement;
  inputAll: HTMLInputElement[];
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.formContacts = template.content.querySelector('.form').cloneNode(true) as HTMLFormElement;
    this.inputAll = Array.from(this.formContacts.querySelectorAll('.form__input'));
    this.buttonSubmit = this.formContacts.querySelector('.button');
    this.formErrors = this.formContacts.querySelector('.form__errors');

    this.inputAll.forEach(item => {
      item.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;
        const field = target.name;
        const value = target.value;
        this.events.emit(`contacts:changeInput`, { field, value });
      })
    })

    this.formContacts.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit('success:open');
    });
  }

  set valid(value: boolean) {
    this.buttonSubmit.disabled = !value;
  }

  render(): HTMLElement {
    return this.formContacts;
  }

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

export interface IModal {
  open(): void;
  close(): void;
  render(): HTMLElement
}

export class ModalInterface implements IModal {
  protected modalElement: HTMLElement;
  protected closeButton: HTMLButtonElement;
  protected modalContent: HTMLElement;
  protected pageWrapper: HTMLElement;
  
  constructor(modalContainer: HTMLElement, protected events: IEvents) {
      this.modalElement = modalContainer;
      this.closeButton = modalContainer.querySelector('.modal__close');
      this.modalContent = modalContainer.querySelector('.modal__content');
      this.pageWrapper = document.querySelector('.page__wrapper');

      this.closeButton.addEventListener('click', this.close.bind(this));
      this.modalElement.addEventListener('click', this.close.bind(this));
      this.modalElement.querySelector('.modal__container').addEventListener('click', event => event.stopPropagation());
  }

  set content(value: HTMLElement) {
      this.modalContent.replaceChildren(value);
  }

  open() {
      this.modalElement.classList.add('modal_active');
      this.events.emit('modal:open');
  }

  close() {
      this.modalElement.classList.remove('modal_active');
      this.content = null;
      this.events.emit('modal:close');
  }

  set isLocked(value: boolean) {
      if (value) {
          this.pageWrapper.classList.add('page__wrapper_locked');
      } else {
          this.pageWrapper.classList.remove('page__wrapper_locked');
      }
  }

  render(): HTMLElement {
    return this.modalElement;
  }
}

  export interface ISuccess {
    success: HTMLElement;
    description: HTMLElement;
    button: HTMLButtonElement;
    render(total: number): HTMLElement;
  }
  
  export class SuccessInterface implements ISuccess {
    success: HTMLElement;
    description: HTMLElement;
    button: HTMLButtonElement;
  
    constructor(template: HTMLTemplateElement, protected events: IEvents) {
      this.success = template.content.querySelector('.order-success').cloneNode(true) as HTMLElement;
      this.description = this.success.querySelector('.order-success__description');
      this.button = this.success.querySelector('.order-success__close');
  
      this.button.addEventListener('click', () => { events.emit('success:close') });
    }
  
    render(total: number) {
      this.description.textContent = String(`Списано ${total} синапсов`);
      return this.success
    }
  }