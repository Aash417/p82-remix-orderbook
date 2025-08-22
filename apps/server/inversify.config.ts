import { Container } from 'inversify';
import 'reflect-metadata';

import { TYPES } from '@/types/inversify.types';

// Core
import { MatchingEngine } from '@/core/matchingEngine';
import { Orderbook } from '@/core/orderbook';

// Services
import { PubSubService } from '@/services/PubSubService';
import { OrderService } from '@/services/orderService';

const inversifyContainer = new Container();

inversifyContainer
   .bind<Orderbook>(TYPES.Orderbook)
   .to(Orderbook)
   .inSingletonScope();

inversifyContainer
   .bind<MatchingEngine>(TYPES.MatchingEngine)
   .to(MatchingEngine);

inversifyContainer
   .bind<PubSubService>(TYPES.PubSubService)
   .to(PubSubService)
   .inSingletonScope();

inversifyContainer.bind<OrderService>(TYPES.OrderService).to(OrderService);

export { inversifyContainer };
