import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { CREATE_ORDER } from '~/graphql/operations';

interface OrderFormProps {
   // We'll pass a function from the parent to be called on success
   onOrderCreated: () => void;
}

export function OrderForm({ onOrderCreated }: OrderFormProps) {
   const [price, setPrice] = useState('');
   const [quantity, setQuantity] = useState('');

   // 1. Set up the mutation hook
   const [createOrder, { loading, error }] = useMutation(CREATE_ORDER);

   const handleSubmit = async (type: 'BUY' | 'SELL') => {
      // Basic validation
      if (!price || !quantity) {
         alert('Please enter both price and quantity.');
         return;
      }

      try {
         // 2. Execute the mutation with variables
         await createOrder({
            variables: {
               price: parseFloat(price),
               quantity: parseFloat(quantity),
               type: type,
            },
         });

         // 3. On success, clear the form and call the callback
         setPrice('');
         setQuantity('');
         onOrderCreated();
      } catch (err) {
         console.error('Order submission failed:', err);
         // The `error` object from the hook will also be populated
      }
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
                  disabled={loading} // Disable input while loading
                  className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
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
                  disabled={loading} // Disable input while loading
                  className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
               />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <button
                  onClick={() => handleSubmit('BUY')}
                  disabled={loading}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-800 disabled:cursor-not-allowed"
               >
                  {loading ? 'Submitting...' : 'Buy'}
               </button>
               <button
                  onClick={() => handleSubmit('SELL')}
                  disabled={loading}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-800 disabled:cursor-not-allowed"
               >
                  {loading ? 'Submitting...' : 'Sell'}
               </button>
            </div>
            {error && (
               <p className="text-red-500 text-sm mt-2">
                  Error: {error.message}
               </p>
            )}
         </div>
      </div>
   );
}
