export const SearchSuggestion = (props) => {
    const {resultRefs, item, highlightText,setHighlightedIndex, highlightedIndex, searchQuery, queryInItems,lastMatchedIndex, index} = props
    const {id, name, address } = item

    return  <div key={id}>
        <div
            ref={el => resultRefs.current[index] = el}
            className={`result-card ${highlightedIndex === index ? 'highlighted' : ''}`}
            onMouseEnter={() => setHighlightedIndex(index)}
        >
            <div><strong>{highlightText(id, searchQuery, 'id')}</strong></div>
            <div className='item-name'><i>{highlightText(name, searchQuery)}</i></div>
            <div>{highlightText(address, searchQuery)}</div>
        </div>
        {queryInItems && index === lastMatchedIndex && (
            <div className="found-in-items">"{searchQuery}" found in items</div>
        )}
    </div>
}