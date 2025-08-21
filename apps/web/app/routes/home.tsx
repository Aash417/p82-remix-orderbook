import { useQuery, useSubscription } from '@apollo/client';
import { useEffect, useState } from 'react';
import { OrderbookDisplay } from '~/components/OrderbookDisplay';
import { OrderForm } from '~/components/OrderForm';
import { RecentTrades } from '~/components/RecentTrades';
import {
   GET_ORDERBOOK,
   TRADE_CREATED_SUBSCRIPTION,
} from '~/graphql/operations';

// A simple type for our trades list
type Trade = {
   price: number;
   quantity: number;
   time: string;
   side: 'buy' | 'sell'; // We'll infer this for now
};

export default function Index() {
   const [trades, setTrades] = useState<Trade[]>([]);
   const market = 'BTC-USD'; // Example market

   // 1. Fetch the initial order book data
   const { loading, error, data, refetch } = useQuery(GET_ORDERBOOK, {
      variables: { market },
   });

   // 2. Subscribe to new trades
   const { data: subscriptionData } = useSubscription(
      TRADE_CREATED_SUBSCRIPTION,
      {
         variables: { market },
      },
   );

   // 3. Handle incoming subscription data
   useEffect(() => {
      if (subscriptionData?.tradeCreated) {
         const newTrade = subscriptionData.tradeCreated;

         // Add the new trade to the top of our list
         setTrades((prevTrades) => [
            {
               price: newTrade.price,
               quantity: newTrade.quantity,
               time: new Date(newTrade.timestamp).toLocaleTimeString(),
               side: 'sell', // You would determine this based on more data
            },
            ...prevTrades,
         ]);

         // Refetch the order book since a trade has changed its state
         refetch();
      }
   }, [subscriptionData, refetch]);

   if (loading)
      return (
         <p className="text-white text-center p-8">Loading order book...</p>
      );
   if (error)
      return (
         <p className="text-red-500 text-center p-8">
            Error loading data: {error.message}
         </p>
      );

   return (
      <div className="bg-gray-950 min-h-screen p-4 text-white">
         <header className="text-center mb-8">
            <h1 className="text-4xl font-bold">Crypto Orderbook</h1>
         </header>
         <main className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            <div className="md:col-span-1">
               <OrderForm onOrderCreated={refetch} />
            </div>
            <div className="md:col-span-1">
               <OrderbookDisplay
                  bids={data?.getOrderbook.bids || []}
                  asks={data?.getOrderbook.asks || []}
               />
            </div>
            <div className="md:col-span-1">
               <RecentTrades trades={trades} />
            </div>
         </main>
      </div>
   );
}
