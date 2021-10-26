import PropTypes from 'prop-types'
import React from 'react'
import Highlighter from 'react-highlight-words'
import styles from './HighlightableText.module.css'

/**
 * Will return either a string or a nested element with spans and marks that are highlighted
 * depending on the presence of searchChunks
 * @param {Object} props - The component props
 * @param {String} props.text - The text to display
 * @param {Array} props.searchChunks - The searchChunks to highlight in the text
 * @class
 */
const HighlightableText = ({ text, searchChunks }) =>
    !searchChunks ? (
        text
    ) : (
        <Highlighter
            highlightClassName={styles.highlight}
            searchWords={searchChunks}
            autoEscape={true}
            textToHighlight={text}
        />
    )

HighlightableText.propTypes = {
    searchChunks: PropTypes.array,
    text: PropTypes.string,
}

export { HighlightableText }
