import { PubSub } from 'graphql-subscriptions';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class PubSubService {
   public readonly pubsub = new PubSub();

   public TRIGGERS = {
      TRADE_CREATED: 'TRADE_CREATED',
      ORDERBOOK_UPDATED: 'ORDERBOOK_UPDATED',
   };
}
