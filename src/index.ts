import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ensureElement } from './utils/utils';
import { IItem, IOrderBatch, IOrderDetails } from './types';

import { DataModel } from './components/models/data';
import { ApiModel } from './components/models/api';
import { BasketModel } from './components/models/basket';
import { FormModel } from './components/models/form';

import { CardInterface } from './components/views/card';
import { CardPreviewInterface } from './components/views/cardPreview';
import { ModalInterface } from './components/views/modal';
import { BasketInterface } from './components/views/basket';
import { BasketItemInterface } from './components/views/basketItem';
import { FormInterface } from './components/views/formBasket';
import { FormContactsInterface } from './components/views/contacts';
import { SuccessInterface } from './components/views/success';

const CardCatalogTE = document.querySelector('#card-catalog') as HTMLTemplateElement;
const CardPreviewTE = document.querySelector('#card-preview') as HTMLTemplateElement;
const BasketTE = document.querySelector('#basket') as HTMLTemplateElement;
const CardBasketTE = document.querySelector('#card-basket') as HTMLTemplateElement;
const OrderTE = document.querySelector('#order') as HTMLTemplateElement;
const ContactsTE = document.querySelector('#contacts') as HTMLTemplateElement;
const SuccessTE = document.querySelector('#success') as HTMLTemplateElement;

const apiModel = new ApiModel(CDN_URL, API_URL);
const eventEmitter = new EventEmitter();
const dataModel = new DataModel(eventEmitter);
const modalInterface = new ModalInterface(ensureElement<HTMLElement>('#modal-container'), eventEmitter);
const basketInterface = new BasketInterface(BasketTE, eventEmitter);
const basketModel = new BasketModel();
const formInterface = new FormInterface(OrderTE, eventEmitter);
const formModel = new FormModel(eventEmitter);
const formContactsInterface = new FormContactsInterface(ContactsTE, eventEmitter);

eventEmitter.on('productCards:receive', () => {
  dataModel.productList.forEach(item => {
    const card = new CardInterface(CardCatalogTE, eventEmitter, {
      onClick: () => eventEmitter.emit('card:select', item)
    });
    ensureElement<HTMLElement>('.gallery').append(card.render(item));
  });
});

eventEmitter.on('card:select', (item: IItem) => dataModel.previewProduct(item));

eventEmitter.on('modalCard:open', (item: IItem) => {
  const preview = new CardPreviewInterface(CardPreviewTE, eventEmitter);
  modalInterface.content = preview.render(item);
  modalInterface.render();
});

eventEmitter.on('card:addBasket', () => {
  basketModel.addProductToBasket(dataModel.selectedProduct);
  basketInterface.updateHeaderCartCounter(basketModel.getProductCount());
  modalInterface.close();
});

eventEmitter.on('basket:open', () => {
  renderBasket();
});

eventEmitter.on('basket:basketItemRemove', (item: IItem) => {
  basketModel.removeProductFromBasket(item);
  basketInterface.updateHeaderCartCounter(basketModel.getProductCount());
  renderBasket();
});

function renderBasket(): void {
  basketInterface.updateTotalPrice(basketModel.getTotalPrice());
  let i = 0;
  basketInterface.basketItems = basketModel.productsInBasket.map((product) => {
    const basketItem = new BasketItemInterface(CardBasketTE, eventEmitter, {
      onClick: () => eventEmitter.emit('basket:basketItemRemove', product)
    });
    return basketItem.render(product, ++i);
  });
  modalInterface.content = basketInterface.render();
  modalInterface.render();
}

eventEmitter.on('order:open', () => {
  modalInterface.content = formInterface.render();
  modalInterface.render();
});

eventEmitter.on('order:paymentSelection', (button: HTMLButtonElement) => {
  formModel.paymentMethod = button.name;
  formModel.validateAddress();
});

eventEmitter.on('order:changeAddress', (data: { field: string; value: string }) => {
  formModel.setAddress(data.field, data.value);
});

eventEmitter.on('formErrors:address', (errors: Partial<IOrderDetails>) => {
  const { address, payment } = errors;
  formInterface.valid = !address && !payment;
  formInterface.errorContainer.textContent = Object.values({ address, payment })
    .filter(Boolean)
    .join('; ');
});

eventEmitter.on('contacts:open', () => {
  modalInterface.content = formContactsInterface.render();
  modalInterface.render();
});

eventEmitter.on('contacts:changeInput', (data: { field: string; value: string }) => {
  formModel.setContactInfo(data.field, data.value);
});

eventEmitter.on('formErrors:change', (errors: Partial<IOrderDetails>) => {
  const { email, phone } = errors;
  formContactsInterface.valid = !email && !phone;
  formContactsInterface.formErrors.textContent = Object.values({ phone, email })
    .filter(Boolean)
    .join('; ');
});

eventEmitter.on('success:open', () => {
  const items = basketModel.productsInBasket.map((item) => item.id);
  const total = basketModel.getTotalPrice();
  const orderData: IOrderBatch = formModel.getOrderData(items, total);

  apiModel
    .submitOrder(orderData)
    .then(() => {
      const success = new SuccessInterface(SuccessTE, eventEmitter);
      modalInterface.content = success.render(total);
      basketModel.clearBasket();
      basketInterface.updateHeaderCartCounter(basketModel.getProductCount());
      modalInterface.render();
    })
    .catch(console.log);
});

eventEmitter.on('success:close', () => modalInterface.close());

eventEmitter.on('modal:open', () => {
  modalInterface.isLocked = true;
});

eventEmitter.on('modal:close', () => {
  modalInterface.isLocked = false;
});

apiModel
  .fetchProductList()
  .then((data: IItem[]) => {
    dataModel.productList = data;
    eventEmitter.emit('productCards:receive');
  })
  .catch(console.log);
