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
} from '~/graphql/operations'; // Make sure TRADE_CREATED_SUBSCRIPTION is imported

type Trade = {
   price: number;
   quantity: number;
   time: string;
   side: 'buy' | 'sell';
};

export default function Home() {
   const [trades, setTrades] = useState<Trade[]>([]);
   const market = 'BTC-USD';

   const {
      loading,
      error,
      data: orderbookData,
   } = useQuery(GET_ORDERBOOK, {
      variables: { market },
      fetchPolicy: 'network-only',
   });

   // This hook is the key to live updates.
   // It actively listens for data pushed from the server.
   const { data: subscriptionData } = useSubscription(
      TRADE_CREATED_SUBSCRIPTION,
      {
         variables: { market },
      },
   );
   const { data: updatedOrderbook } = useSubscription(
      ORDERBOOK_UPDATED_SUBSCRIPTION,
      {
         variables: { market },
      },
   );
   const currentOrderbook =
      updatedOrderbook?.orderbookUpdated || orderbookData?.getOrderbook;

   // This effect runs whenever new data arrives from the subscription.
   useEffect(() => {
      if (subscriptionData?.tradeCreated) {
         console.log(
            'New trade received from subscription:',
            subscriptionData.tradeCreated,
         );
         const newTrade = subscriptionData.tradeCreated;

         // Add the new trade to our local state for the UI
         setTrades((prevTrades) => [
            {
               price: newTrade.price,
               quantity: newTrade.quantity,
               time: new Date(newTrade.timestamp).toLocaleTimeString(),
               side: 'buy', // This could be determined more accurately
            },
            ...prevTrades.slice(0, 19), // Keep the list from getting too long
         ]);
      }
   }, [subscriptionData]); // Dependency array ensures this runs when data arrives

   if (loading && !currentOrderbook)
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
                  Real-time cryptocurrency trading orderbook
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
                     bids={currentOrderbook?.bids || []}
                     asks={currentOrderbook?.asks || []}
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
