import { useState } from 'react';

export function OrderForm() {
   const [price, setPrice] = useState('');
   const [quantity, setQuantity] = useState('');

   // In a later phase, this will trigger a GraphQL mutation.
   const handleSubmit = (type: 'BUY' | 'SELL') => {
      alert(`Submitting ${type} order: ${quantity} @ ${price}`);
   };

   return (
      <div className="bg-gray-900 text-white p-4 rounded-lg shadow-lg">
         <h2 className="text-xl font-bold mb-4 text-center">Place Order</h2>
         <div className="space-y-4">
            <div>
               <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-400"
               >
                  Price (USD)
               </label>
               <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
               />
            </div>
            <div>
               <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-400"
               >
                  Quantity
               </label>
               <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
               />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <button
                  onClick={() => handleSubmit('BUY')}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
               >
                  Buy
               </button>
               <button
                  onClick={() => handleSubmit('SELL')}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
               >
                  Sell
               </button>
            </div>
         </div>
      </div>
   );
}
