import { useContext } from 'react';
import { QuotesContext } from './QuoteProvider';

const useQuotes = () => useContext(QuotesContext);

export default useQuotes;
