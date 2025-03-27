import { useState, useEffect, useRef } from 'react';

const useDebouncedSearch = (initialValue = "", debounceTime = 500) => {
    const [searchKeyword, setSearchKeyword] = useState(initialValue);
    const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState(initialValue);
    const searchInputRef = useRef(null);

    // Debounce logic
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchKeyword(searchKeyword);
        }, debounceTime);

        return () => {
            clearTimeout(handler);
        };
    }, [searchKeyword, debounceTime]);

    // Auto-focus on mount
    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    return {
        searchKeyword,
        setSearchKeyword,
        debouncedSearchKeyword,
        searchInputRef
    };
};

export default useDebouncedSearch;