"use client";

import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Reorderable list: drag handle (@dnd-kit) plus Up/Down arrow buttons for
 * keyboard and touch users. Only loaded by editor screens.
 */
export function SortableList<T>({
  items,
  onChange,
  renderRow,
  disabled,
}: {
  items: T[];
  onChange: (next: T[]) => void;
  /** `controls` renders the handle + arrows; place it in the row header. */
  renderRow: (item: T, index: number, controls: ReactNode) => ReactNode;
  disabled?: boolean;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const ids = items.map((_, i) => String(i));

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    onChange(arrayMove(items, ids.indexOf(String(active.id)), ids.indexOf(String(over.id))));
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    onChange(arrayMove(items, from, to));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((item, i) => (
            <SortableRow key={i} id={String(i)} disabled={disabled}>
              {(handle) =>
                renderRow(
                  item,
                  i,
                  disabled ? null : (
                    <span className="flex shrink-0 items-center">
                      {handle}
                      <button
                        type="button"
                        aria-label="Move up"
                        disabled={i === 0}
                        onClick={() => move(i, i - 1)}
                        className="flex h-7 w-7 items-center justify-center text-slate-400 hover:text-ink disabled:opacity-25"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Move down"
                        disabled={i === items.length - 1}
                        onClick={() => move(i, i + 1)}
                        className="flex h-7 w-7 items-center justify-center text-slate-400 hover:text-ink disabled:opacity-25"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ),
                )
              }
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({ id, disabled, children }: { id: string; disabled?: boolean; children: (handle: ReactNode) => ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(isDragging && "relative z-10 opacity-80 shadow-lg")}
    >
      {children(
        <button
          type="button"
          aria-label="Drag to reorder"
          className="flex h-7 w-7 cursor-grab touch-none items-center justify-center text-slate-400 hover:text-ink active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>,
      )}
    </div>
  );
}
