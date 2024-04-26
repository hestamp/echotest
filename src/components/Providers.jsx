import QuotesProvider from '@/hooks/quotes/QuoteProvider';
import { MyStorageProvider } from '@/storage/StorageContext';


function Providers({ children }) {

  return (
    <MyStorageProvider>
      <QuotesProvider>{children}</QuotesProvider>
    </MyStorageProvider>
  );
}

export default Providers;
