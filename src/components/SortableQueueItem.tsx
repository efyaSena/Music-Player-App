import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableQueueItem({ id, song }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg p-3 shadow cursor-grab active:cursor-grabbing flex justify-between"
    >
      <div>
        <div className="font-bold text-sm">{song.title}</div>
        <div className="text-xs opacity-70">{song.artist}</div>
      </div>

      <div className="text-xs opacity-60">⋮⋮</div>
    </div>
  );
}