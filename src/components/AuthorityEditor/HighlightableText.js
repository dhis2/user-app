import React from 'react';
import PropTypes from 'prop-types';
import Highlighter from 'react-highlight-words';

/**
 * Will return either a string or a nested element with spans and marks that are highlighted
 * depending on the presence of searchChunks
 * @param {Object} props - The component props
 * @param {String} props.text - The text to display
 * @param {Array} props.searchChunks - The searchChunks to highlight in the text
 * @class
 */
const HighlightableText = ({ text, searchChunks }) => {
    // If there is nothing to highlight, return the label text as it is
    if (!searchChunks) {
        return text;
    }

    // Otherwise return a highlighted label text
    return (
        <Highlighter
            highlightClassName="authority-editor__search-highlight"
            searchWords={searchChunks}
            autoEscape={true}
            textToHighlight={text}
        />
    );
};

HighlightableText.propTypes = {
    text: PropTypes.string,
    searchChunks: PropTypes.array,
};

export default HighlightableText;
