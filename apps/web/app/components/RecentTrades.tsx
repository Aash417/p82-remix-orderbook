export type Trade = {
   price: number;
   quantity: number;
   time: string;
   side: 'buy' | 'sell';
};

interface RecentTradesProps {
   trades: Trade[];
}

export function RecentTrades({ trades }: Readonly<RecentTradesProps>) {
   return (
      <div className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border border-black text-card-foreground p-6 rounded-xl shadow-2xl">
         <div className="flex items-center justify-center mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <h2 className="text-2xl font-bold text-center text-foreground">
               Recent Trades
            </h2>
         </div>

         {trades.length === 0 ? (
            <div className="text-center py-12">
               <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
                  <svg
                     className="w-8 h-8 text-muted-foreground"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                     />
                  </svg>
               </div>
               <p className="text-muted-foreground text-sm">No recent trades</p>
               <p className="text-muted-foreground text-xs mt-1">
                  Trades will appear here once orders are matched
               </p>
            </div>
         ) : (
            <div className="space-y-2">
               <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border/50 pb-2">
                  <span>Price</span>
                  <span>Quantity</span>
                  <span>Time</span>
               </div>
               <div className="space-y-1 max-h-64 overflow-y-auto">
                  {trades.map((trade, index) => (
                     <div
                        key={index + 1}
                        className={`
                           flex justify-between items-center py-2 px-3 rounded-lg 
                           transition-all duration-200 hover:bg-muted/10 group
                           ${
                              trade.side === 'buy'
                                 ? 'border-l-2 border-green-500/50 hover:border-green-500 hover:bg-green-500/5'
                                 : 'border-l-2 border-red-500/50 hover:border-red-500 hover:bg-red-500/5'
                           }
                        `}
                     >
                        <span
                           className={`font-mono font-semibold ${
                              trade.side === 'buy'
                                 ? 'text-green-400'
                                 : 'text-red-400'
                           }`}
                        >
                           ${trade.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-foreground group-hover:text-foreground transition-colors">
                           {trade.quantity.toFixed(4)}
                        </span>
                        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                           {trade.time}
                        </span>
                     </div>
                  ))}
               </div>
            </div>
         )}
      </div>
   );
}
