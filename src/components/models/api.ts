import { ApiListResponse, Api } from '../base/api'
import { IItem, IOrderBatch, IOrderConfirmation } from '../../types';

export interface IApi {
    contentDeliveryUrl: string;
    productList: IItem[];
    fetchProductList: () => Promise<IItem[]>;
    submitOrder: (order: IOrderBatch) => Promise<IOrderConfirmation>;
}
  
export class ApiModel extends Api implements IApi {
    contentDeliveryUrl: string;
    productList: IItem[];
  
    constructor(contentDeliveryUrl: string, apiBaseUrl: string, options?: RequestInit) {
        super(apiBaseUrl, options);
        this.contentDeliveryUrl = contentDeliveryUrl;
    }
  
    fetchProductList(): Promise<IItem[]> {
        const apiOrigin = process.env.API_ORIGIN || 'https://default-api-origin.com';
        console.log('API Origin:', apiOrigin);
        return this.get('/product').then((data: ApiListResponse<IItem>) =>
            data.items.map((product) => ({
            ...product,
            imageUrl: this.contentDeliveryUrl + product.image,
            }))
        );
    }
  
    submitOrder(order: IOrderBatch): Promise<IOrderConfirmation> {
        return this.post('/order', order).then((data: IOrderConfirmation) => data);
    }
}