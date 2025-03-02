const baseUrl = "http://localhost:3000/api/weblarek";

type OrderStatus = "OK" | "Not Found" | "Bad Request"

interface BaseProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
  }
  
  interface Product extends BaseProduct {
    price: number | null; 
  }
  
  interface ProductItemResponse extends BaseProduct {
    price: number; 
  }


interface ProductListResponse {
    total: number;
    items: Product[];
}

interface ApiError {
    error: string;
}

interface Order {
    payment: "online" | "offline";
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[]; 
}

interface OrderResponse {
    id: string;
    total: number;
}

async function fetchProductList(): Promise<ProductListResponse> {
    const response = await fetch(`${baseUrl}/product`);
    if(!response.ok) {
        throw new Error("Ошибка при получении списка продуктов");
    }
    return response.json();
}

async function fetchProductItem(id: string): Promise<ProductItemResponse> {
    const response = await fetch(`${baseUrl}/poduct/${id}`);
    if (!response.ok) {
        throw new Error("Продукт не найден")
    }
    return response.json();
}

async function createOrder(order: Order): Promise<OrderResponse> {
    const response = await fetch(`${baseUrl}/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });
  
    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error);
    }
  
    return response.json();
  }