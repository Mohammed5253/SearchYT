import React from "react"
export const SearchInput = (props) =>{
    const {searchQuery, getSuggestionList, handleKeyDown, clearSearch} = props
    return <div className="search-box">
        <span className="search-icon"><i class="fa fa-search" aria-hidden="true"></i></span>
        <input
            type="text"
            value={searchQuery}
            onChange={e => getSuggestionList(e)}
            onKeyDown={handleKeyDown}
            placeholder="Search users by ID, address name..."
        />
        <span className="clear-icon" onClick={clearSearch}><i class="fa fa-times" aria-hidden="true"></i></span>
    </div>
}