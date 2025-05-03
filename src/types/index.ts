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