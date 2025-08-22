import { useQuery, useSubscription } from '@apollo/client';
import { useEffect, useState } from 'react';
import { OrderbookDisplay } from '~/components/OrderbookDisplay';
import { OrderForm } from '~/components/OrderForm';
import { RecentTrades } from '~/components/RecentTrades';
import { ModeToggle } from '~/components/theme-toggle';
import {
   GET_ORDERBOOK,
   ORDERBOOK_UPDATED_SUBSCRIPTION,
   TRADE_CREATED_SUBSCRIPTION,
} from '~/graphql/operations';

type Trade = {
   price: number;
   quantity: number;
   time: string;
   side: 'BUY' | 'SELL';
};

export default function Home() {
   const [trades, setTrades] = useState<Trade[]>([]);
   const [orderbook, setOrderbook] = useState<{ bids: any[]; asks: any[] }>({
      bids: [],
      asks: [],
   });
   const market = 'BTC-USD';

   const {
      loading,
      error,
      data: orderbookData,
   } = useQuery(GET_ORDERBOOK, {
      variables: { market },
      fetchPolicy: 'network-only',
   });

   const { data: tradeSubData } = useSubscription(TRADE_CREATED_SUBSCRIPTION, {
      variables: { market },
   });
   const { data: orderbookSubData } = useSubscription(
      ORDERBOOK_UPDATED_SUBSCRIPTION,
      { variables: { market } },
   );

   useEffect(() => {
      if (orderbookData?.getOrderbook) {
         setOrderbook(orderbookData.getOrderbook);
      }
   }, [orderbookData]);

   useEffect(() => {
      if (orderbookSubData?.orderbookUpdated) {
         setOrderbook(orderbookSubData.orderbookUpdated);
      }
   }, [orderbookSubData]);

   useEffect(() => {
      if (tradeSubData?.tradeCreated) {
         const newTrade = tradeSubData.tradeCreated;
         setTrades((prev) => [
            {
               price: newTrade.price,
               quantity: newTrade.quantity,
               time: new Date(newTrade.timestamp).toLocaleTimeString(),
               side: newTrade.side,
            },
            ...prev.slice(0, 9),
         ]);
      }
   }, [tradeSubData]);

   if (loading && orderbook.bids.length === 0 && orderbook.asks.length === 0)
      return <p className="text-center p-8">Loading...</p>;
   if (error)
      return (
         <p className="text-red-500 text-center p-8">Error: {error.message}</p>
      );

   return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 relative overflow-hidden">
         <div className="relative z-10">
            <header className="text-center mb-12 pt-8">
               <div className="inline-flex items-center justify-center space-x-4 mb-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
                  <h1 className="text-5xl md:text-6xl font-bold text-foreground">
                     Mock Orderbook
                  </h1>
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
               </div>
               <p className="text-muted-foreground text-lg">
                  Real-time trading orderbook
               </p>
               <div className="absolute top-4 right-4">
                  <ModeToggle />
               </div>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 pb-8">
               <div className="md:col-span-1 space-y-6">
                  <OrderForm />
               </div>
               <div className="md:col-span-1 space-y-6">
                  <OrderbookDisplay
                     bids={orderbook.bids}
                     asks={orderbook.asks}
                  />
               </div>
               <div className="md:col-span-1 space-y-6">
                  <RecentTrades trades={trades} />
               </div>
            </main>
         </div>
      </div>
   );
}
