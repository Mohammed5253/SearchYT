import React, { useState, useEffect, useRef } from 'react';
import './SearchComponent.css';
import { SearchInput } from './SearchInput';
import { SearchSuggestion } from './SearchSuggestion';

const highlightText = (text, query, type) => {
    const isId = type==='id'
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return <>{parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? <span key={index} className="highlight">{isId ? part.toUpperCase(): part}</span> : isId ? part.toUpperCase() :part
    )}</>;
};

const SearchComponent = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const resultRefs = useRef([]);

    const performSearchLogic = (list) =>{
        if(list){
            const query = searchQuery.toLowerCase();
            const filtered = list.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.id.toLowerCase().includes(query) ||
                item.address.toLowerCase().includes(query) ||
                item.pincode.toLowerCase().includes(query) ||
                item.items.some(it => it.toLowerCase().includes(query))
            );
            setFilteredData(filtered);
            setHighlightedIndex(-1);
        }
    };

    const getJSONList = () => {
        fetch('https://fe-take-home-assignment.s3.us-east-2.amazonaws.com/Data.json')
        .then((res)=>res.json())
        .then((res)=>performSearchLogic(res))
    }

    useEffect(() => {
        if (highlightedIndex >= 0 && highlightedIndex < filteredData.length) {
            resultRefs.current[highlightedIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [highlightedIndex, filteredData]);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            setHighlightedIndex(prev => Math.min(prev + 1, filteredData.length - 1));
        } else if (e.key === 'ArrowUp') {
            setHighlightedIndex(prev => Math.max(prev - 1, 0));
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
       
    };

    const getSuggestionList = (e) => {
        setSearchQuery(e.target.value);
         getJSONList();
    }
  const isQueryInItems = (items, query) => {
        return items.some(it => it.toLowerCase().includes(query.toLowerCase()));
    };
    let lastMatchedIndex = -1;
    filteredData.forEach((item, index) => {
        if (isQueryInItems(item.items, searchQuery)) {
            lastMatchedIndex = index;
        }
    });

    return (
        <div className="search-container">
            <SearchInput searchQuery={searchQuery} getSuggestionList={getSuggestionList} handleKeyDown={handleKeyDown} clearSearch={clearSearch}  />
            {searchQuery.length>0 && <div className="results-container">
                {filteredData.length > 0 ? filteredData.map((item, index) => {
                    const queryInItems = isQueryInItems(item.items, searchQuery);
                    return (
                        <SearchSuggestion 
                            resultRefs={resultRefs} 
                            item={item}
                            highlightText={highlightText}
                            setHighlightedIndex={setHighlightedIndex}
                             highlightedIndex={highlightedIndex}
                             searchQuery={searchQuery}
                             queryInItems={queryInItems} 
                             lastMatchedIndex={lastMatchedIndex}
                             index={index}
                        />
                    );
                }) : <div className="empty-card">No User found</div>}
            </div>}
        </div>
    );
};

export default SearchComponent;
