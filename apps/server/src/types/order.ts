// A unique identifier for an order, typically a string.
export type OrderId = string;

// The type of order, either to buy or to sell.
export type OrderType = 'BUY' | 'SELL';

// The current status of an order.
export type OrderStatus = 'OPEN' | 'FILLED' | 'CANCELLED';

// Represents a single order in the order book.
export interface Order {
   id: OrderId;
   price: number;
   quantity: number;
   type: OrderType;
   status: OrderStatus;
   createdAt: number; // Using timestamp for time-priority
}

// Represents an executed trade between two orders.
export interface Trade {
   price: number;
   quantity: number;
   timestamp: number;
   makerOrderId: OrderId; // The ID of the order that was resting on the book
   takerOrderId: OrderId; // The ID of the order that initiated the trade
}
