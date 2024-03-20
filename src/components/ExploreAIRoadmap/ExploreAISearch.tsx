import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounceValue } from '../../hooks/use-debounce.ts';
import { Spinner } from '../ReactIcons/Spinner.tsx';

type ExploreAISearchProps = {
  value: string;
  isLoading: boolean;
  onSubmit: (search: string) => void;
};

export function ExploreAISearch(props: ExploreAISearchProps) {
  const { onSubmit, isLoading = false, value: defaultValue } = props;

  const [term, setTerm] = useState(defaultValue);
  const debouncedTerm = useDebounceValue(term, 500);

  useEffect(() => {
    setTerm(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (debouncedTerm && debouncedTerm.length < 3) {
      return;
    }

    if (debouncedTerm === defaultValue) {
      return;
    }

    onSubmit(debouncedTerm);
  }, [debouncedTerm]);

  return (
    <div className="relative w-full max-w-[350px]">
      <label
        className="absolute left-3 flex h-full items-center text-gray-500"
        htmlFor="search"
      >
        <Search className="h-4 w-4" />
      </label>
      <input
        id="search"
        name="search"
        type="text"
        placeholder="Type 3 or more characters to search..."
        className="w-full rounded-md border border-gray-200 px-3 py-2 pl-9 text-sm transition-colors focus:border-black focus:outline-none"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      {isLoading && (
        <span className="absolute right-3 top-0 flex h-full items-center text-gray-500">
          <Spinner isDualRing={false} className={`h-3 w-3`} />
        </span>
      )}
    </div>
  );
}
