import { TYPES } from '@/types/inversify.types';
import { Order, Trade } from '@/types/order';
import { randomUUID } from 'crypto';
import { inject, injectable } from 'inversify';
import { Orderbook } from './orderbook';

@injectable()
export class MatchingEngine {
   constructor(
      @inject(TYPES.Orderbook) private readonly orderbook: Orderbook,
   ) {}

   match(takerOrder: Order): Trade[] {
      const trades: Trade[] = [];
      let remainingQuantity = takerOrder.quantity;

      if (takerOrder.type === 'BUY') {
         while (remainingQuantity > 0 && this.orderbook.asks.length > 0) {
            const bestAsk = this.orderbook.getBestAsk();
            if (takerOrder.price < bestAsk.price) {
               // Taker's buy price is lower than the best sell price, no more matches possible.
               break;
            }

            const tradeQuantity = Math.min(remainingQuantity, bestAsk.quantity);

            trades.push({
               id: randomUUID(),
               side: takerOrder.type,
               price: bestAsk.price, // Trade executes at the maker's price
               quantity: tradeQuantity,
               timestamp: Date.now(),
               makerOrderId: bestAsk.id,
               takerOrderId: takerOrder.id,
            });

            remainingQuantity -= tradeQuantity;
            bestAsk.quantity -= tradeQuantity;

            if (bestAsk.quantity === 0) {
               // Maker order is fully filled, remove it from the book.
               this.orderbook.removeOrder(bestAsk.id, 'SELL');
            }
         }
      } else {
         while (remainingQuantity > 0 && this.orderbook.bids.length > 0) {
            const bestBid = this.orderbook.getBestBid();
            if (takerOrder.price > bestBid.price) {
               // Taker's sell price is higher than the best buy price, no more matches possible.
               break;
            }

            const tradeQuantity = Math.min(remainingQuantity, bestBid.quantity);

            trades.push({
               id: randomUUID(),
               price: bestBid.price,
               quantity: tradeQuantity,
               timestamp: Date.now(),
               makerOrderId: bestBid.id,
               takerOrderId: takerOrder.id,
               side: takerOrder.type,
            });

            remainingQuantity -= tradeQuantity;
            bestBid.quantity -= tradeQuantity;

            if (bestBid.quantity === 0) {
               this.orderbook.removeOrder(bestBid.id, 'BUY');
            }
         }
      }

      // If the taker order is not fully filled, add the remainder to the order book.
      if (remainingQuantity > 0) {
         const remainingOrder: Order = {
            ...takerOrder,
            quantity: remainingQuantity,
         };
         this.orderbook.addOrder(remainingOrder);
      }

      return trades;
   }
}
