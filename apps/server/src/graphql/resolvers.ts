import { OrderService } from '@/services/orderService';
import { PubSubService } from '@/services/PubSubService';
import { OrderType } from '@/types/order';

interface Context {
   orderService: OrderService;
   pubSubService: PubSubService;
}

export const resolvers = {
   Query: {
      ping: () => 'pong',

      getOrderbook: (
         parent: any,
         { market }: { market: string },
         context: Context,
      ) => {
         const orderbook = context.orderService.getOrderbook();
         return {
            bids: orderbook.bids,
            asks: orderbook.asks,
         };
      },
   },

   Mutation: {
      createOrder: (
         parent: any,
         {
            price,
            quantity,
            type,
         }: { price: number; quantity: number; type: OrderType },
         context: Context,
      ) => {
         const result = context.orderService.createOrder({
            price,
            quantity,
            type,
         });
         return result.order;
      },
   },

   Subscription: {
      tradeCreated: {
         subscribe: (parent: any, args: any, context: Context) =>
            context.pubSubService.pubsub.asyncIterableIterator([
               context.pubSubService.TRIGGERS.TRADE_CREATED,
            ]),
      },

      orderbookUpdated: {
         subscribe: (_, __, context: Context) => {
            return context.pubSubService.pubsub.asyncIterableIterator([
               context.pubSubService.TRIGGERS.ORDERBOOK_UPDATED,
            ]);
         },
      },
   },
};
