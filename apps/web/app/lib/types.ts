export interface Order {
   price: number;
   quantity: number;
}

export interface Trade {
   id: string;
   price: number;
   quantity: number;
   timestamp: number;
   side: 'BUY' | 'SELL';
}

export interface Orderbook {
   bids: Order[];
   asks: Order[];
}
