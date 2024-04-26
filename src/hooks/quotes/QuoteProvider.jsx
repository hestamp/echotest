import { quotesDayArray } from '@/static/quotes';
import { getRandomQuote } from '@/utils/textUtils';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { telegramApp } from '../useTelegram';

export const QuotesContext = createContext();

const getQuotes = () => {
  const stored = localStorage.getItem('quotes');
  if (stored) {
    return JSON.parse(stored);
  }
  return false;
};

const QuotesProvider = ({ children }) => {
  const [isQuotes, uIsQuotes] = useState(getQuotes());
  const [myQuote, uMyQuote] = useState(null);

  const toggleMyQuote = useCallback(() => {
    localStorage.setItem('quotes', JSON.stringify(!isQuotes));
    uIsQuotes((prev) => !prev);
  }, []);

  const setIsQuote = useCallback((value) => {
    localStorage.setItem('quotes', JSON.stringify(value));
    uIsQuotes(value);
  }, []);

  useEffect(() => {
    if (!myQuote && quotesDayArray) {
      const newQuote = getRandomQuote(quotesDayArray);
      uMyQuote(newQuote);
    }

    telegramApp.SettingsButton.show();
  }, [myQuote]);

  const values = useMemo(
    () => ({ toggleMyQuote, isQuotes, setIsQuote, myQuote, uMyQuote }),
    [isQuotes, myQuote]
  );

  return (
    <QuotesContext.Provider value={values}>{children}</QuotesContext.Provider>
  );
};

export default QuotesProvider;
