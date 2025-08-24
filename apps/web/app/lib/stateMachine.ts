import { assign, setup } from 'xstate';
import type { Orderbook, Trade } from './types';

export type OrderbookMachineContext = {
   orderbook: Orderbook;
   trades: Trade[];
   error: string | null;
   retryCount: number;
};

export type OrderbookMachineEvent =
   | { type: 'FETCH_ORDERBOOK'; market: string }
   | { type: 'INITIALIZE_WITH_DATA'; data: Orderbook }
   | { type: 'ORDERBOOK_LOADED'; data: Orderbook }
   | { type: 'ORDERBOOK_UPDATED'; data: Orderbook }
   | { type: 'TRADE_RECEIVED'; data: Trade }
   | { type: 'LOAD_ERROR'; error: string }
   | { type: 'SUBSCRIPTION_ERROR'; error: string }
   | { type: 'RETRY' }
   | { type: 'RESET' };

export const orderbookMachine = setup({
   types: {
      context: {} as OrderbookMachineContext,
      events: {} as OrderbookMachineEvent,
   },
   actions: {
      clearError: assign({
         error: null,
         retryCount: 0,
      }),
      initializeWithData: assign({
         orderbook: ({ event }) => (event as any).data,
         error: null,
      }),
      setOrderbook: assign({
         orderbook: ({ event }) => (event as any).data,
         error: null,
      }),
      updateOrderbook: assign({
         orderbook: ({ event }) => (event as any).data,
      }),
      addTrade: assign({
         trades: ({ context, event }) => {
            const newTrade = (event as any).data;
            return [newTrade, ...context.trades.slice(0, 9)];
         },
      }),
      setError: assign({
         error: ({ event }) => (event as any).error,
         retryCount: ({ context }) => context.retryCount + 1,
      }),
      setSubscriptionError: assign({
         error: ({ event }) => (event as any).error,
      }),
      resetContext: assign({
         orderbook: { bids: [], asks: [] },
         trades: [],
         error: null,
         retryCount: 0,
      }),
   },
   guards: {
      canRetry: ({ context }) => context.retryCount < 3,
   },
}).createMachine({
   id: 'orderbook',
   initial: 'idle',
   context: {
      orderbook: { bids: [], asks: [] },
      trades: [],
      error: null,
      retryCount: 0,
   },
   states: {
      idle: {
         on: {
            FETCH_ORDERBOOK: {
               target: 'loading',
               actions: 'clearError',
            },
            INITIALIZE_WITH_DATA: {
               target: 'ready',
               actions: 'initializeWithData',
            },
         },
      },
      loading: {
         on: {
            ORDERBOOK_LOADED: {
               target: 'ready',
               actions: 'setOrderbook',
            },
            LOAD_ERROR: {
               target: 'error',
               actions: 'setError',
            },
         },
      },
      ready: {
         on: {
            ORDERBOOK_UPDATED: {
               actions: 'updateOrderbook',
            },
            TRADE_RECEIVED: {
               actions: 'addTrade',
            },
            SUBSCRIPTION_ERROR: {
               actions: 'setSubscriptionError',
            },
            LOAD_ERROR: {
               target: 'error',
               actions: 'setError',
            },
         },
      },
      error: {
         on: {
            RETRY: {
               target: 'loading',
               guard: 'canRetry',
            },
            RESET: {
               target: 'idle',
               actions: 'resetContext',
            },
         },
      },
   },
   on: {
      RESET: {
         target: '.idle',
         actions: 'resetContext',
      },
   },
});
