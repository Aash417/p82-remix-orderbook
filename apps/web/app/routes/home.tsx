import { OrderbookDisplay } from '~/components/OrderbookDisplay';
import { OrderForm } from '~/components/OrderForm';
import { RecentTrades, type Trade } from '~/components/RecentTrades';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
   return [
      { title: 'remix orderbook' },
      { name: 'description', content: 'Welcome to React Router!' },
   ];
}

// Mock data to build the UI before we connect to the API
const mockBids = [
   { price: 2999.9, quantity: 0.75 },
   { price: 2999.8, quantity: 1.25 },
   { price: 2999.7, quantity: 0.5 },
];
const mockAsks = [
   { price: 3000.1, quantity: 0.8 },
   { price: 3000.2, quantity: 1.5 },
   { price: 3000.3, quantity: 2.0 },
];
const mockTrades: Trade[] = [
   { price: 3000.0, quantity: 0.1, time: '14:35:12', side: 'buy' },
   { price: 2999.9, quantity: 0.05, time: '14:35:10', side: 'sell' },
   { price: 3000.0, quantity: 0.2, time: '14:35:09', side: 'buy' },
];

export default function Home() {
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
               <OrderbookDisplay bids={mockBids} asks={mockAsks} />
            </div>
            <div className="md:col-span-1">
               <RecentTrades trades={mockTrades} />
            </div>
         </main>
      </div>
   );
}
