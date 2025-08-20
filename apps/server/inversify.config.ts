import { Container } from 'inversify';
import 'reflect-metadata';

import { TYPES } from './src/types/inversify.types';

// Core
import { MatchingEngine } from './src/core/matchingEngine';
import { Orderbook } from './src/core/orderbook';

// Services
import { OrderService } from './src/services/oderService';

const inversifyContainer = new Container();

// --- Bind Core Classes ---
// We bind Orderbook as a singleton because we only want one instance of it
// for the entire application's lifecycle.
inversifyContainer
   .bind<Orderbook>(TYPES.Orderbook)
   .to(Orderbook)
   .inSingletonScope();

inversifyContainer
   .bind<MatchingEngine>(TYPES.MatchingEngine)
   .to(MatchingEngine);

// --- Bind Services ---
inversifyContainer.bind<OrderService>(TYPES.OrderService).to(OrderService);

export { inversifyContainer };

