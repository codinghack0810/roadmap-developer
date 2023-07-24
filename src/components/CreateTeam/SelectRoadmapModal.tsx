import { useEffect, useRef, useState } from 'preact/hooks';
import { useKeydown } from '../../hooks/use-keydown';
import { useOutsideClick } from '../../hooks/use-outside-click';
import type { PageType } from '../CommandMenu/CommandMenu';
import { httpGet } from '../../lib/http';
import { useToast } from '../../hooks/use-toast';
import type { TeamResourceConfig } from './RoadmapSelector';

export type SelectRoadmapModalProps = {
  teamId: string;
  allRoadmaps: PageType[];
  onClose: () => void;
  teamResourceConfig: TeamResourceConfig;
  onRoadmapAdd: (roadmapId: string) => void;
  onRoadmapRemove: (roadmapId: string) => void;
};

export function SelectRoadmapModal(props: SelectRoadmapModalProps) {
  const {
    onClose,
    allRoadmaps,
    onRoadmapAdd,
    onRoadmapRemove,
    teamResourceConfig,
  } = props;
  const toast = useToast();
  const popupBodyEl = useRef<HTMLDivElement>(null);

  const [searchResults, setSearchResults] = useState<PageType[]>(allRoadmaps);
  const [searchText, setSearchText] = useState('');

  useKeydown('Escape', () => {
    onClose();
  });

  useOutsideClick(popupBodyEl, () => {
    onClose();
  });

  useEffect(() => {
    if (searchText.length === 0) {
      setSearchResults(allRoadmaps);
      return;
    }

    const searchResults = allRoadmaps.filter((roadmap) => {
      return (
        roadmap.title.toLowerCase().includes(searchText.toLowerCase()) ||
        roadmap.id.toLowerCase().includes(searchText.toLowerCase())
      );
    });
    setSearchResults(searchResults);
  }, [searchText, allRoadmaps]);

  return (
    <div class="fixed left-0 right-0 top-0 z-50 h-full items-center justify-center overflow-y-auto overflow-x-hidden overscroll-contain bg-black/50">
      <div class="relative mx-auto h-full w-full max-w-4xl p-4 md:h-auto">
        <div
          ref={popupBodyEl}
          class="popup-body relative mt-4 overflow-hidden rounded-lg bg-white shadow"
        >
          <input
            type="text"
            placeholder="Search roadmaps"
            className="block w-full px-4 py-3 outline-none placeholder:text-gray-400"
            value={searchText}
            onInput={(e) => setSearchText((e.target as HTMLInputElement).value)}
          />

          <div className="flex min-h-[20vh] flex-wrap gap-2.5 border-t p-4">
            {searchResults.map((roadmap) => {
              const isSelected = teamResourceConfig.find(
                (r) => r.resourceId === roadmap.id
              );
              return (
                <div
                  className={`flex items-center rounded-md border ${
                    isSelected && 'bg-gray-100'
                  }`}
                >
                  <span className="px-4">{roadmap.title}</span>
                  <button
                    className="flex h-8 w-8 items-center justify-center border-l p-1 leading-none hover:bg-gray-100"
                    onClick={() => {
                      if (isSelected) {
                        onRoadmapRemove(roadmap.id);
                      } else {
                        onRoadmapAdd(roadmap.id);
                      }
                    }}
                  >
                    {isSelected ? '-' : '+'}
                  </button>
                </div>
              );
            })}
            {searchResults.length === 0 && (
              <div className="text-gray-400">No roadmaps found</div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 border-t">
            <button
              className="px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                onClose();
              }}
            >
              Close
            </button>

            <button
              className="border-l px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                onClose();
              }}
            >
              Apply Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
