import { gql } from '@apollo/client';

export const GET_ORDERBOOK = gql`
   query GetOrderbook($market: String!) {
      getOrderbook(market: $market) {
         bids {
            price
            quantity
         }
         asks {
            price
            quantity
         }
      }
   }
`;

export const TRADE_CREATED_SUBSCRIPTION = gql`
   subscription OnTradeCreated($market: String!) {
      tradeCreated(market: $market) {
         price
         quantity
         timestamp
      }
   }
`;

export const CREATE_ORDER = gql`
   mutation CreateOrder($price: Float!, $quantity: Float!, $type: OrderType!) {
      createOrder(price: $price, quantity: $quantity, type: $type) {
         id
         price
         quantity
         type
      }
   }
`;
