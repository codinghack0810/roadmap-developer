import {CircleSlash, PenSquare, Shapes} from 'lucide-react';

type EmptyRoadmapProps = {
  roadmapId: string;
  canManage: boolean;
};

export function EmptyRoadmap(props: EmptyRoadmapProps) {
  const { roadmapId, canManage } = props;
  const editUrl = `${import.meta.env.PUBLIC_EDITOR_APP_URL}/${roadmapId}`;

  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center">
        <CircleSlash className="mx-auto h-20 w-20 text-gray-400" />
        <h3 className="mt-2">This roadmap is currently empty.</h3>

        {canManage && (
          <a
            href={editUrl}
            className="mt-4 rounded-md bg-gray-500 px-4 py-2 font-medium text-white hover:bg-gray-600 flex items-center"
          >
            <Shapes className="inline-block mr-2 h-4 w-4" />
            Edit Roadmap
          </a>
        )}
      </div>
    </div>
  );
}
