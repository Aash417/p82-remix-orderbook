export type OrderId = string;

export type OrderType = 'BUY' | 'SELL';

export type OrderStatus = 'OPEN' | 'FILLED' | 'PARTIALLY_FILLED' | 'CANCELLED';

export interface Order {
   id: OrderId;
   price: number;
   quantity: number;
   type: OrderType;
   status: OrderStatus;
   createdAt: number;
}

export interface Trade {
   id: string;
   side: OrderType;
   price: number;
   quantity: number;
   timestamp: number;
   makerOrderId: OrderId; // The ID of the order that was resting on the book
   takerOrderId: OrderId; // The ID of the order that initiated the trade
}
