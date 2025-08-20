import { MatchingEngine } from '@/core/matchingEngine';
import { TYPES } from '@/types/inversify.types';
import { Order, OrderType, Trade } from '@/types/order';

import { randomUUID } from 'crypto';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { PubSubService } from './PubSubService';

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
      @inject(TYPES.PubSubService) private pubSubService: PubSubService,
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

      // --- Publish Events for Each Trade ---
      if (trades.length > 0) {
         console.log(`Publishing ${trades.length} trade events...`);
         trades.forEach((trade) => {
            this.pubSubService.pubsub.publish(
               this.pubSubService.TRIGGERS.TRADE_CREATED,
               { tradeCreated: trade }, // The payload must match the schema
            );
         });
      }

      return { order: newOrder, trades };
   }

   /**
    * Gets the current orderbook state.
    * @returns The current orderbook with bids and asks.
    */
   public getOrderbook() {
      // Access the orderbook through the matching engine
      return (this.matchingEngine as any).orderbook;
   }
}
