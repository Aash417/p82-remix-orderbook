import { useQuery, useSubscription } from '@apollo/client/react';
import { useMachine } from '@xstate/react';
import { useCallback, useEffect, useRef } from 'react';
import {
   GET_ORDERBOOK,
   ORDERBOOK_UPDATED_SUBSCRIPTION,
   TRADE_CREATED_SUBSCRIPTION,
} from '~/graphql/operations';
import { askQuantityVar, bidQuantityVar } from '~/lib/apollo';
import type {
   GetOrderbookQuery,
   GetOrderbookQueryVariables,
   OrderbookUpdatedSubscription,
   OrderbookUpdatedSubscriptionVariables,
   TradeCreatedSubscription,
   TradeCreatedSubscriptionVariables,
} from '~/lib/types';
import { orderbookMachine, type OrderbookMachineEvent } from './stateMachine';
import type { Trade } from './types';

export const useOrderbook = (market: string, initialOrderbook?: any) => {
   const [state, send] = useMachine(orderbookMachine);

   const sendRef = useRef(send);
   sendRef.current = send;

   const stateRef = useRef(state);
   stateRef.current = state;

   const sendAction = useCallback((action: OrderbookMachineEvent) => {
      sendRef.current(action);
   }, []);

   const { data: orderbookData, loading: orderbookLoading } = useQuery<
      GetOrderbookQuery,
      GetOrderbookQueryVariables
   >(GET_ORDERBOOK, {
      variables: { market },
      skip: !!initialOrderbook, // Skip query if we have initial data
   });

   const { data: tradeSubData } = useSubscription<
      TradeCreatedSubscription,
      TradeCreatedSubscriptionVariables
   >(TRADE_CREATED_SUBSCRIPTION, {
      variables: { market },
      onError: (error) =>
         sendAction({ type: 'SUBSCRIPTION_ERROR', error: error.message }),
   });

   const { data: orderbookSubData } = useSubscription<
      OrderbookUpdatedSubscription,
      OrderbookUpdatedSubscriptionVariables
   >(ORDERBOOK_UPDATED_SUBSCRIPTION, {
      variables: { market },
      onError: (error) =>
         sendAction({ type: 'SUBSCRIPTION_ERROR', error: error.message }),
   });

   useEffect(() => {
      if (initialOrderbook) {
         sendAction({ type: 'INITIALIZE_WITH_DATA', data: initialOrderbook });
         // initialize local total quantities from initial data
         bidQuantityVar(
            initialOrderbook.bids?.reduce(
               (s: number, o: any) => s + (o.quantity ?? 0),
               0,
            ) ?? 0,
         );
         askQuantityVar(
            initialOrderbook.asks?.reduce(
               (s: number, o: any) => s + (o.quantity ?? 0),
               0,
            ) ?? 0,
         );
      } else {
         // Start fetching the orderbook
         sendAction({ type: 'FETCH_ORDERBOOK', market });
         if (orderbookData?.getOrderbook && !orderbookLoading) {
            sendAction({
               type: 'ORDERBOOK_LOADED',
               data: orderbookData.getOrderbook,
            });
            // set total quantities from fetched data
            bidQuantityVar(
               orderbookData.getOrderbook.bids?.reduce(
                  (s: number, o: any) => s + (o.quantity ?? 0),
                  0,
               ) ?? 0,
            );
            askQuantityVar(
               orderbookData.getOrderbook.asks?.reduce(
                  (s: number, o: any) => s + (o.quantity ?? 0),
                  0,
               ) ?? 0,
            );
         }
      }
   }, [initialOrderbook, orderbookData, orderbookLoading, sendAction]);

   useEffect(() => {
      if (orderbookSubData?.orderbookUpdated) {
         if (stateRef.current.matches('ready')) {
            sendAction({
               type: 'ORDERBOOK_UPDATED',
               data: orderbookSubData.orderbookUpdated,
            });
            // update total quantities on subscription
            bidQuantityVar(
               orderbookSubData.orderbookUpdated.bids?.reduce(
                  (s: number, o: any) => s + (o.quantity ?? 0),
                  0,
               ) ?? 0,
            );
            askQuantityVar(
               orderbookSubData.orderbookUpdated.asks?.reduce(
                  (s: number, o: any) => s + (o.quantity ?? 0),
                  0,
               ) ?? 0,
            );
         }
      }
   }, [orderbookSubData, sendAction]);

   useEffect(() => {
      if (tradeSubData?.tradeCreated) {
         if (stateRef.current.matches('ready')) {
            sendAction({
               type: 'TRADE_RECEIVED',
               data: tradeSubData.tradeCreated,
            });
         }
      }
   }, [tradeSubData, sendAction]);

   return {
      orderbook: state.context.orderbook,
      trades: state.context.trades.map(formatTradeForDisplay),
      error: state.context.error,
      isLoading: state.matches('loading') || orderbookLoading,
   };
};

function formatTradeForDisplay(trade: Trade) {
   return {
      price: trade.price,
      quantity: trade.quantity,
      time: new Date(trade.timestamp).toLocaleTimeString(),
      side: trade.side,
   };
}
