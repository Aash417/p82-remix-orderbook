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

// Query result types
export interface GetOrderbookQuery {
   getOrderbook?: Orderbook;
}

export interface GetOrderbookQueryVariables {
   market: string;
}

// Mutation result types
export interface CreateOrderMutation {
   createOrder: {
      id: string;
      price: number;
      quantity: number;
      type: string;
   };
}

export interface CreateOrderMutationVariables {
   price: number;
   quantity: number;
   type: string;
}

// Subscription result types
export interface TradeCreatedSubscription {
   tradeCreated: Trade;
}

export interface TradeCreatedSubscriptionVariables {
   market: string;
}

export interface OrderbookUpdatedSubscription {
   orderbookUpdated: Orderbook;
}

export interface OrderbookUpdatedSubscriptionVariables {
   market: string;
}

// Client query types
export interface GetOrderQuantitiesQuery {
   bidQuantity: number;
   askQuantity: number;
}
