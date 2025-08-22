import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { CREATE_ORDER } from '~/graphql/operations';

export function OrderForm() {
   const [price, setPrice] = useState('');
   const [quantity, setQuantity] = useState('');

   const [createOrder, { loading, error }] = useMutation(CREATE_ORDER);

   const handleSubmit = async (type: 'BUY' | 'SELL') => {
      if (!price || !quantity) {
         alert('Please enter both price and quantity.');
         return;
      }

      try {
         await createOrder({
            variables: {
               price: parseFloat(price),
               quantity: parseFloat(quantity),
               type: type,
            },
         });

         setPrice('');
         setQuantity('');
      } catch (err) {
         console.error('Order submission failed:', err);
      }
   };

   return (
      <div className="bg-card backdrop-blur-sm border border-black  text-card-foreground p-6 rounded-xl shadow-2xl">
         <div className="flex items-center justify-center mb-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            <h2 className="text-2xl font-bold text-center text-foreground">
               Place Order
            </h2>
         </div>
         <div className="space-y-6">
            <div className="space-y-2">
               <Label
                  htmlFor="price"
                  className="text-sm font-semibold text-muted-foreground uppercase tracking-wide"
               >
                  Price (USD)
               </Label>
               <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                     $
                  </span>
                  <Input
                     type="number"
                     id="price"
                     value={price}
                     onChange={(e) => setPrice(e.target.value)}
                     disabled={loading}
                     placeholder="0.00"
                     className="pl-8 h-12 border-2 focus:border-blue-500 transition-all duration-200 bg-background/50"
                  />
               </div>
            </div>
            <div className="space-y-2">
               <Label
                  htmlFor="quantity"
                  className="text-sm font-semibold text-muted-foreground uppercase tracking-wide"
               >
                  Quantity
               </Label>
               <div className="relative">
                  <Input
                     type="number"
                     id="quantity"
                     value={quantity}
                     onChange={(e) => setQuantity(e.target.value)}
                     disabled={loading}
                     placeholder="0.0000"
                     className="pr-3 h-12 border-2 focus:border-blue-500 transition-all duration-200 bg-background/50"
                  />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <Button
                  onClick={() => handleSubmit('BUY')}
                  disabled={loading}
                  className="h-12 bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg hover:shadow-green-500/25 transition-all duration-200 transform hover:scale-105"
               >
                  {loading ? (
                     <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Buying...</span>
                     </div>
                  ) : (
                     'Buy'
                  )}
               </Button>
               <Button
                  onClick={() => handleSubmit('SELL')}
                  disabled={loading}
                  className="h-12 bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg hover:shadow-red-500/25 transition-all duration-200 transform hover:scale-105"
               >
                  {loading ? (
                     <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Selling...</span>
                     </div>
                  ) : (
                     'Sell'
                  )}
               </Button>
            </div>

            {error && (
               <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm font-medium">
                     <span className="font-bold">Error:</span> {error.message}
                  </p>
               </div>
            )}
         </div>
      </div>
   );
}
