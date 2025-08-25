import { LiquidityBar } from './LiquidityBar';

type Order = {
   price: number;
   quantity: number;
};

interface OrderbookDisplayProps {
   bids: Order[];
   asks: Order[];
}

export function OrderbookDisplay({
   bids,
   asks,
}: Readonly<OrderbookDisplayProps>) {
   // Calculate max quantities for depth visualization
   const maxBidQuantity = Math.max(...bids.map((b) => b.quantity), 0);
   const maxAskQuantity = Math.max(...asks.map((a) => a.quantity), 0);

   const maxQuantity = Math.max(maxBidQuantity, maxAskQuantity);

   return (
      <div className="bg-card backdrop-blur-sm border border-black text-card-foreground p-6 rounded-xl shadow-2xl">
         <div className="flex items-center justify-center mb-6">
            <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
            <h2 className="text-2xl font-bold text-center text-foreground">
               Order Book
            </h2>
         </div>

         <div className="space-y-6">
            {/* Asks Section */}
            <div className="space-y-1">
               <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wide flex items-center">
                     <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                     Asks (Sell Orders)
                  </h3>
                  <span className="text-xs text-muted-foreground">Size</span>
               </div>
               <div className="space-y-1 max-h-48 overflow-y-auto">
                  {asks.length === 0 ? (
                     <div className="text-center text-muted-foreground py-4 text-sm">
                        No sell orders
                     </div>
                  ) : (
                     asks
                        .slice()
                        .reverse()
                        .map((ask, index) => (
                           <div
                              key={index + 1}
                              className="relative flex justify-between items-center py-2 px-3 rounded-md hover:bg-red-500/5 transition-colors duration-200 group"
                           >
                              <div
                                 className="absolute inset-0 bg-gradient-to-r from-red-500/5 rounded-md"
                                 style={{
                                    width: `${(ask.quantity / maxQuantity) * 100}%`,
                                 }}
                              ></div>
                              <span className="relative z-10 text-red-400 font-mono font-semibold">
                                 ${ask.price.toFixed(2)}
                              </span>
                              <span className="relative z-10 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                 {ask.quantity.toFixed(4)}
                              </span>
                           </div>
                        ))
                  )}
               </div>
            </div>

            <LiquidityBar />

            {/* Bids Section */}
            <div className="space-y-1">
               <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wide flex items-center">
                     <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                     Bids (Buy Orders)
                  </h3>
                  <span className="text-xs text-muted-foreground">Size</span>
               </div>
               <div className="space-y-1 max-h-48 overflow-y-auto">
                  {bids.length === 0 ? (
                     <div className="text-center text-muted-foreground py-4 text-sm">
                        No buy orders
                     </div>
                  ) : (
                     bids.map((bid, index) => (
                        <div
                           key={index + 1}
                           className="relative flex justify-between items-center py-2 px-3 rounded-md hover:bg-green-500/5 transition-colors duration-200 group"
                        >
                           <div
                              className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent rounded-md"
                              style={{
                                 width: `${(bid.quantity / maxQuantity) * 100}%`,
                              }}
                           ></div>
                           <span className="relative z-10 text-green-400 font-mono font-semibold">
                              ${bid.price.toFixed(2)}
                           </span>
                           <span className="relative z-10 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                              {bid.quantity.toFixed(4)}
                           </span>
                        </div>
                     ))
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
