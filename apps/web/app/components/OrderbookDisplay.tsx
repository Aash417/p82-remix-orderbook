type Order = {
   price: number;
   quantity: number;
};

interface OrderbookDisplayProps {
   bids: Order[];
   asks: Order[];
}

export function OrderbookDisplay({ bids, asks }: OrderbookDisplayProps) {
   return (
      <div className="bg-gray-900 text-white p-4 rounded-lg shadow-lg">
         <h2 className="text-xl font-bold mb-4 text-center">Order Book</h2>
         <div className="grid grid-cols-2 gap-4 font-mono text-sm">
            {/* Asks Column */}
            <div>
               <div className="flex justify-between text-gray-400 border-b border-gray-700 pb-1 mb-2">
                  <span>Price (USD)</span>
                  <span>Quantity</span>
               </div>
               {asks.map((ask, index) => (
                  <div
                     key={index}
                     className="flex justify-between text-red-500"
                  >
                     <span>{ask.price.toFixed(2)}</span>
                     <span>{ask.quantity.toFixed(4)}</span>
                  </div>
               ))}
            </div>

            {/* Bids Column */}
            <div>
               <div className="flex justify-between text-gray-400 border-b border-gray-700 pb-1 mb-2">
                  <span>Price (USD)</span>
                  <span>Quantity</span>
               </div>
               {bids.map((bid, index) => (
                  <div
                     key={index}
                     className="flex justify-between text-green-500"
                  >
                     <span>{bid.price.toFixed(2)}</span>
                     <span>{bid.quantity.toFixed(4)}</span>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}
