import { IItem } from "../../types";
import { IEvents } from "../base/events";

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
