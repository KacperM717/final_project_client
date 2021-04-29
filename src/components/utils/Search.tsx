import React, { FC, useState, useEffect } from "react";
import "./utils.css";

export type SearchProps = {
  onTextChange?: (...args: any) => any;
  onTextChangeDelay?: number;
  onSearch?: (...args: any) => any;
  placeholder?: string;
};

const Search: FC<SearchProps> = ({
  onTextChange,
  onTextChangeDelay,
  onSearch,
  children,
  placeholder,
}) => {
  const [text, setText] = useState("");
  const delay = onTextChangeDelay ?? 300;
  const [hintsOpened, setHintsOpened] = useState(false);
  console.log(children);

  useEffect(() => {
    if (!onTextChange || text === "") return;
    setHintsOpened(true);
    const emitTextTimeout = setTimeout(() => onTextChange(text), delay);
    return () => {
      clearTimeout(emitTextTimeout);
    };
  }, [text]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSearchClick = () => {
    if (onSearch) onSearch(text);
  };

  return (
    <div>
      <input
        type="text"
        onChange={handleTextChange}
        value={text}
        placeholder={placeholder}
      />
      {onSearch ? <button onClick={handleSearchClick}>Search</button> : null}
      {hintsOpened && (children as any[])?.length > 0 ? (
        <>
          <button onClick={() => setHintsOpened(false)}>x</button>
          <div className={"search_results"}>{children}</div>
        </>
      ) : null}
    </div>
  );
};

export default Search;
