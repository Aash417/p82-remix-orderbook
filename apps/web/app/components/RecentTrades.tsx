export type Trade = {
   price: number;
   quantity: number;
   time: string;
   side: 'buy' | 'sell';
};

interface RecentTradesProps {
   trades: Trade[];
}

export function RecentTrades({ trades }: RecentTradesProps) {
   return (
      <div className="bg-gray-900 text-white p-4 rounded-lg shadow-lg">
         <h2 className="text-xl font-bold mb-4 text-center">Recent Trades</h2>
         <div className="font-mono text-sm">
            <div className="grid grid-cols-3 text-gray-400 border-b border-gray-700 pb-1 mb-2">
               <span>Price (USD)</span>
               <span className="text-right">Quantity</span>
               <span className="text-right">Time</span>
            </div>
            {trades.map((trade, index) => (
               <div key={index} className="grid grid-cols-3">
                  <span
                     className={
                        trade.side === 'buy' ? 'text-green-500' : 'text-red-500'
                     }
                  >
                     {trade.price.toFixed(2)}
                  </span>
                  <span className="text-right">
                     {trade.quantity.toFixed(4)}
                  </span>
                  <span className="text-right text-gray-500">{trade.time}</span>
               </div>
            ))}
         </div>
      </div>
   );
}
