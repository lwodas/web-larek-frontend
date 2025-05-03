import { IItem } from "../../types";

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
