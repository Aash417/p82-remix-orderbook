import { useQuery, useSubscription } from '@apollo/client';
import { useEffect, useState } from 'react';
import { OrderbookDisplay } from '~/components/OrderbookDisplay';
import { OrderForm } from '~/components/OrderForm';
import { RecentTrades } from '~/components/RecentTrades';
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

export default function Index() {
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
      return <p className="text-white text-center p-8">Loading...</p>;
   if (error)
      return (
         <p className="text-red-500 text-center p-8">Error: {error.message}</p>
      );

   return (
      <div className="bg-gray-950 min-h-screen p-4 text-white">
         <header className="text-center mb-8">
            <h1 className="text-4xl font-bold">Crypto Orderbook</h1>
         </header>
         <main className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            <div className="md:col-span-1">
               <OrderForm />
            </div>
            <div className="md:col-span-1">
               <OrderbookDisplay
                  bids={currentOrderbook.bids || []}
                  asks={currentOrderbook.asks || []}
               />
            </div>
            <div className="md:col-span-1">
               <RecentTrades trades={trades} />
            </div>
         </main>
      </div>
   );
}
