import type { MetaFunction } from 'react-router';
import { OrderbookDisplay } from '~/components/OrderbookDisplay';
import { OrderForm } from '~/components/OrderForm';
import { RecentTrades } from '~/components/RecentTrades';
import { ModeToggle } from '~/components/theme-toggle';
import { useOrderbook } from '~/lib/useOrderbook';

export const meta: MetaFunction = () => {
   return [
      { title: 'orderbook' },
      { name: 'description', content: 'graphql-orderbook' },
   ];
};

export default function Home() {
   const market = 'BTC-USD';
   const { orderbook, trades, error, isLoading } = useOrderbook(market);

   if (isLoading) return <p className="text-center p-8">Loading...</p>;
   if (error)
      return <p className="text-red-500 text-center p-8">Error: {error}</p>;

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
