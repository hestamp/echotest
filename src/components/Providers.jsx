import AuthProvider from '@/hooks/Auth/AuthProvider';
import QuotesProvider from '@/hooks/quotes/QuoteProvider';
import { MyStorageProvider } from '@/storage/StorageContext';

function Providers({ children }) {
  return (
    <MyStorageProvider>
      <AuthProvider>
        <QuotesProvider>{children}</QuotesProvider>
      </AuthProvider>
    </MyStorageProvider>
  );
}

export default Providers;
