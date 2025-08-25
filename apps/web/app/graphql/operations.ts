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

export const TRADE_CREATED_SUBSCRIPTION = gql`
   subscription OnTradeCreated($market: String!) {
      tradeCreated(market: $market) {
         id
         side
         price
         quantity
         timestamp
      }
   }
`;

export const ORDERBOOK_UPDATED_SUBSCRIPTION = gql`
   subscription OnOrderbookUpdated($market: String!) {
      orderbookUpdated(market: $market) {
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

export const GET_ORDER_COUNTS = gql`
   query GetOrderQuantities {
      bidQuantity @client
      askQuantity @client
   }
`;
