import type { ReactNode } from 'react';
import Highlighter from 'react-highlight-words';

type SearchResultProps = {
  children?: ReactNode;
  onClick?: () => void;
  query: string;
  name: string;
};

export default function SearchResult({
  children,
  onClick,
  query,
  name,
}: SearchResultProps) {
  return (
    <div
      onClick={onClick}
      className="border-b dark:border-dark-gray-400 py-2.5 flex items-center px-2 cursor-pointer bg-white dark:bg-transparent dark:hover:bg-dark-gray-600 transition-colors hover:bg-gray-50 focus:bg-gray-50"
    >
      <Highlighter
        searchWords={[query]}
        textToHighlight={name}
        highlightClassName="font-semibold bg-blue-100 dark:bg-dark-gray-300"
      />
      {children}
    </div>
  );
}
