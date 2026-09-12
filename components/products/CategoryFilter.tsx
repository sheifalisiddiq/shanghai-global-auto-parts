"use client";

import { Tabs } from "@/components/ui/Tabs";
import { categories } from "@/lib/data/categories";

const items = [{ id: "all", label: "All Categories" }, ...categories.map((c) => ({ id: c.id, label: c.label }))];

export function CategoryFilter({
  activeId,
  onChange,
}: {
  activeId: string;
  onChange: (id: string) => void;
}) {
  return <Tabs items={items} activeId={activeId} onChange={onChange} />;
}
