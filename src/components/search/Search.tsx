import React, { FC, useState, useEffect } from "react";

export type SearchProps = {
  onTextChange?: (...args: any) => any;
  onTextChangeDelay?: number;
  onSearch: (...args: any) => any;
};

const Search: FC<SearchProps> = ({
  onTextChange,
  onTextChangeDelay,
  onSearch,
}) => {
  const [text, setText] = useState("");
  const delay = onTextChangeDelay ?? 300;

  useEffect(() => {
    if (!onTextChange || text === "") return;
    const emitTextTimeout = setTimeout(() => onTextChange(text), delay);
    return () => {
      clearTimeout(emitTextTimeout);
    };
  }, [text]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    onSearch(text);
  };

  return (
    <div>
      <input type="search" onChange={handleTextChange} value={text} />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default Search;
