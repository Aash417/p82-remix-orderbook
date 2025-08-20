import { MatchingEngine } from '@/core/matchingEngine';
import { TYPES } from '@/types/inversify.types';
import { Order, OrderType, Trade } from '@/types/order';

import { randomUUID } from 'crypto';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

interface CreateOrderInput {
   price: number;
   quantity: number;
   type: OrderType;
}

interface CreateOrderResult {
   order: Order;
   trades: Trade[];
}

@injectable()
export class OrderService {
   constructor(
      @inject(TYPES.MatchingEngine) private matchingEngine: MatchingEngine,
   ) {}

   /**
    * Creates a new order and processes it through the matching engine.
    * @param input The data for the new order.
    * @returns The newly created order and any trades that resulted from it.
    */
   public createOrder(input: CreateOrderInput): CreateOrderResult {
      const newOrder: Order = {
         id: randomUUID(),
         price: input.price,
         quantity: input.quantity,
         type: input.type,
         status: 'OPEN', // The order starts as OPEN
         createdAt: Date.now(),
      };

      console.log(`Processing new order: ${newOrder.id}`);
      const trades = this.matchingEngine.match(newOrder);
      console.log(`Executed ${trades.length} trades.`);

      // In a real app, you would update the order status based on trades
      // and save everything to a database. For now, we just return the result.

      return { order: newOrder, trades };
   }
}
