import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
   return [
      { title: 'New React Router App' },
      { name: 'description', content: 'Welcome to React Router!' },
   ];
}

export default function Home() {
   return (
      <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
         <h1>Welcome to the Orderbook Simulator</h1>
         <p>The application is running entirely on the client-side.</p>
      </div>
   );
}
