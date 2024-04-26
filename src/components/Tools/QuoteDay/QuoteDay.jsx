import { memo } from 'react';
import styles from './QuoteDay.module.css';
import { useMyQuote } from '@/storage';

import { MdNavigateNext } from 'react-icons/md';
import { GrFormViewHide } from 'react-icons/gr';

import { quotesDayArray } from '@/static/quotes';
import { copyToClipboard, getRandomQuote } from '@/utils/textUtils';
import TypingAnimation from '../TypingAnimation/TypingAnimation';
import { successToast } from '@/utils/toast';

const QuoteDay = memo(() => {
  const { myQuote, uMyQuote, isQuotes, uIsQuotes } = useMyQuote();
  console.log('quoteday');

  const copyQuote = () => {
    const context = myQuote.quote + ' ' + myQuote.author;

    copyToClipboard(context)
      .then(() => {
        // console.log('Content copied to clipboard successfully')
        successToast('Quote copied to clipboard');
      })
      .catch((error) => {
        // console.error('Failed to copy content: ', error)
        // Handle error if necessary
      });
  };

  const nextFunc = () => {
    const newQuote = getRandomQuote(quotesDayArray);
    uMyQuote(newQuote);
  };
  const hideFunc = () => {
    localStorage.setItem('quotes', 'false');
    successToast('Quotes is hidden for now \n You can change it in settings');
    uIsQuotes(false);
  };

  return (
    <div className={`${styles.miniblock}  ${styles.justask3}`}>
      <div className={styles.minihr} />
      <div className={styles.quoteblock}>
        {myQuote && isQuotes ? (
          <div className={styles.quoteZone}>
            <div className={styles.quotefunc}>
              <h4>Quote of the moment</h4>
              <div className={styles.icodiv}>
                <button onClick={nextFunc} aria-label="Next">
                  <MdNavigateNext className={styles.svgs} />
                </button>
              </div>
            </div>
            <blockquote onClick={copyQuote} className={styles.quote}>
              <>
                <TypingAnimation text={`${myQuote.quote} `} />
              </>
            </blockquote>
            <div className={styles.bottdiv}>
              <button onClick={hideFunc} aria-label="Hide">
                <GrFormViewHide className={styles.svgs} />
              </button>
              <a
                href={myQuote.link || 'https://en.wikipedia.org/'}
                target="_blank"
                rel="hestamp.me noreferrer"
                className={styles.author}
              >
                {myQuote.author}
              </a>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
});

QuoteDay.displayName = 'QuoteDay';

export default QuoteDay;
