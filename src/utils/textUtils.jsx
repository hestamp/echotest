import sbd from 'sbd'

export const getRandomSBD = (text, minWordCount = null) => {
  const options = {
    newline_boundaries: true, // Treat newlines as sentence boundaries
    html_boundaries: false,
    sanitize: false,
    allowed_tags: false,
    preserve_whitespace: false,
    abbreviations: null,
  }

  // Split the text into sentences using sbd
  const sentences = sbd.sentences(text, options)

  let filteredSentences = sentences
  if (minWordCount !== null) {
    filteredSentences = sentences.filter((sentence) => {
      const words = sentence.split(/\s+/)
      return words.length >= minWordCount
    })
  }

  // Choose a random sentence
  const randomIndex = Math.floor(Math.random() * filteredSentences.length)
  const randomSentence = filteredSentences[randomIndex]

  return randomSentence
}

export const renderContentWithLineBreaks = (content) => {
  const paragraphs = content.split('\n')

  // Function to render text with links
  const renderTextWithLinks = (text) => {
    // Regular expression to match URLs
    const urlRegex =
      /(\bhttps?:\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi

    const parts = text.split(urlRegex)

    // Render the text parts and links
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        // If the part is a URL, render it as a link
        return (
          <a
            className="mylinks"
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
          >
            {part}
          </a>
        )
      } else {
        // Otherwise, render it as plain text
        return part
      }
    })
  }

  // Remove empty paragraphs at the beginning and end
  while (paragraphs.length > 0 && paragraphs[0].trim() === '') {
    paragraphs.shift()
  }

  while (
    paragraphs.length > 0 &&
    paragraphs[paragraphs.length - 1].trim() === ''
  ) {
    paragraphs.pop()
  }

  // Map over the paragraphs and render them with potential links
  return paragraphs.map((paragraph, i) => (
    <div className="pardiv" key={i}>
      {renderTextWithLinks(paragraph)}
      <br />
    </div>
  ))
}

export const copyToClipboard = (content) => {
  return navigator.clipboard.writeText(content)
}

export const getRandomQuote = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}
