import { usePlayer } from "../context/usePlayer";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableQueueItem from "./SortableQueueItem";

export default function QueuePanel({ onClose }: { onClose: () => void }) {
  const player = usePlayer() as any;

  const { queue = [], reorderQueue } = player;

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = queue.findIndex((s: any) => s.id === active.id);
    const newIndex = queue.findIndex((s: any) => s.id === over.id);

    reorderQueue(oldIndex, newIndex);
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur p-6 overflow-y-auto">

      <div className="max-w-md mx-auto bg-[#CFFFFF] rounded-xl p-4 text-black">

        <div className="flex justify-between mb-4">
          <h2 className="font-black">Queue</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >

          <SortableContext
            items={queue.map((s: any) => s.id)}
            strategy={verticalListSortingStrategy}
          >

            <div className="flex flex-col gap-2">
              {queue.map((song: any) => (
                <SortableQueueItem
                  key={song.id}
                  id={song.id}
                  song={song}
                />
              ))}
            </div>

          </SortableContext>

        </DndContext>

      </div>
    </div>
  );
}