import React from 'react';
import PropTypes from 'prop-types';
import Highlighter from 'react-highlight-words';

const HighlightableText = ({ text, searchChunks }) => {
    if (!text || !searchChunks) {
        return text;
    }
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
