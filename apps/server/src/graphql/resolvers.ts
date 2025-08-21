import { OrderService } from '@/services/orderService';
import { PubSubService } from '@/services/PubSubService';
import { OrderType } from '@/types/order';
import { withFilter } from 'graphql-subscriptions';

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
         // For now, we'll ignore the market parameter and return the global orderbook
         // In a real system, you'd have separate orderbooks per market
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
         subscribe: withFilter(
            (parent: any, args: any, context: Context) =>
               context.pubSubService.pubsub.asyncIterableIterator([
                  context.pubSubService.TRIGGERS.TRADE_CREATED,
               ]),
            (payload: any, variables: { market: string }) => {
               // For now, we'll ignore market filtering
               // In a real system, you'd filter by market
               return true;
            },
         ),
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
