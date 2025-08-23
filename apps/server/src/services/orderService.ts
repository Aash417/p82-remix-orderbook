import { MatchingEngine } from '@/core/matchingEngine';
import { TYPES } from '@/types/inversify.types';
import { Order, OrderType, Trade } from '@/types/order';

import { Orderbook } from '@/core/orderbook';
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
      @inject(TYPES.MatchingEngine)
      private readonly matchingEngine: MatchingEngine,
      @inject(TYPES.PubSubService)
      private readonly pubSubService: PubSubService,
      @inject(TYPES.Orderbook) private readonly orderbook: Orderbook,
   ) {}

   public createOrder(input: CreateOrderInput): CreateOrderResult {
      const newOrder: Order = {
         id: randomUUID(),
         price: input.price,
         quantity: input.quantity,
         type: input.type,
         status: 'OPEN',
         createdAt: Date.now(),
      };

      console.log(`Processing new order: ${newOrder.id}`);
      const trades = this.matchingEngine.match(newOrder);

      // publish the entire updated order book.
      this.pubSubService.pubsub.publish(
         this.pubSubService.TRIGGERS.ORDERBOOK_UPDATED,
         {
            orderbookUpdated: {
               bids: this.orderbook.bids,
               asks: this.orderbook.asks,
            },
         },
      );

      // --- Publish Events for Each Trade ---
      if (trades.length > 0) {
         trades.forEach((trade) => {
            this.pubSubService.pubsub.publish(
               this.pubSubService.TRIGGERS.TRADE_CREATED,
               { tradeCreated: trade },
            );
         });
      }

      return { order: newOrder, trades };
   }

   public getOrderbook() {
      return this.orderbook;
   }
}
