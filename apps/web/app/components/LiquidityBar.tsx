import { useQuery } from '@apollo/client/react';
import { GET_ORDER_COUNTS } from '~/graphql/operations';

export function LiquidityBar() {
   const { data } = useQuery<{ bidQuantity: number; askQuantity: number }>(
      GET_ORDER_COUNTS,
   );

   const bidQty = Number(data?.bidQuantity ?? 0);
   const askQty = Number(data?.askQuantity ?? 0);
   const total = bidQty + askQty;

   const bidPct = total > 0 ? (bidQty / total) * 100 : 50;

   return (
      <div className="w-full px-4">
         <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-green-500">{bidQty.toFixed(2)}</span>
            <div className="flex w-full h-2.5 bg-red-500 rounded overflow-hidden border border-border/40">
               <div
                  className="h-full bg-green-500 transition-all duration-500 ease-in-out"
                  style={{ width: `${bidPct}%` }}
               />
            </div>
            <span className="text-red-500">{askQty.toFixed(2)}</span>
         </div>
      </div>
   );
}
