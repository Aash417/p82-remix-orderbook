import { Order, OrderId, OrderType } from '@/types/order';
import { injectable } from 'inversify';
import 'reflect-metadata'; // Required for Inversify

@injectable() // Marks this class as manageable by Inversify.
export class Orderbook {
   // ... rest of the file is identical to Phase 2
   public bids: Order[] = [];
   public asks: Order[] = [];

   addOrder(order: Order): void {
      if (order.type === 'BUY') {
         this.bids.push(order);
         this.bids.sort((a, b) => {
            if (a.price !== b.price) return b.price - a.price;
            return a.createdAt - b.createdAt;
         });
      } else {
         this.asks.push(order);
         this.asks.sort((a, b) => {
            if (a.price !== b.price) return a.price - b.price;
            return a.createdAt - b.createdAt;
         });
      }
   }

   removeOrder(orderId: OrderId, type: OrderType): void {
      if (type === 'BUY') {
         this.bids = this.bids.filter((order) => order.id !== orderId);
      } else {
         this.asks = this.asks.filter((order) => order.id !== orderId);
      }
   }

   getBestBid(): Order | undefined {
      return this.bids[0];
   }

   getBestAsk(): Order | undefined {
      return this.asks[0];
   }
}
