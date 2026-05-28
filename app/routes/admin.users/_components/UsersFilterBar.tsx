import { useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "react-router";
import { Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select } from "~/components/ui/select";

type FilterKey = "district" | "role" | "school" | "query";

interface UsersFilterBarProps {
  districts: ReadonlyArray<{
    _id: string;
    name?: string | null;
    organization?: string | null;
  }>;
  userTypes: ReadonlyArray<{
    _id: string;
    label?: string | null;
  }>;
  schools: ReadonlyArray<{ _id: string; name?: string | null }>;
  filters: {
    district?: string | undefined;
    role?: string | undefined;
    school?: string | undefined;
    query?: string | undefined;
  };
}

export function UsersFilterBar({
  districts,
  userTypes,
  schools,
  filters,
}: UsersFilterBarProps) {
  const [params, setSearchParams] = useSearchParams();
  const [queryInput, setQueryInput] = useState<string>(filters.query ?? "");

  function update(next: Partial<Record<FilterKey, string>>) {
    const merged = new URLSearchParams(params);
    for (const [k, v] of Object.entries(next)) {
      if (v) {
        merged.set(k, v);
      } else {
        merged.delete(k);
      }
    }
    // Reset pagination on any filter change.
    merged.delete("page");
    setSearchParams(merged);
  }

  function onSubmitQuery(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    update({ query: queryInput.trim() });
  }

  const hasAnyFilter =
    Boolean(filters.district) ||
    Boolean(filters.role) ||
    Boolean(filters.school) ||
    Boolean(filters.query);

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <form
        onSubmit={onSubmitQuery}
        className="relative flex-1 min-w-[220px] max-w-md"
        role="search"
      >
        <Search
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          name="query"
          placeholder="Search users…"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          aria-label="Search users"
          className="pl-10"
        />
      </form>

      <Select
        aria-label="Filter by district"
        className="w-auto min-w-[160px]"
        value={filters.district ?? ""}
        onChange={(e) => {
          // Changing district clears school (district-scoped).
          update({ district: e.target.value, school: "" });
        }}
      >
        <option value="">All Districts</option>
        {districts.map((d) => (
          <option key={d._id} value={d._id}>
            {d.name ?? "Unnamed District"}
          </option>
        ))}
      </Select>

      <Select
        aria-label="Filter by role"
        className="w-auto min-w-[140px]"
        value={filters.role ?? ""}
        onChange={(e) => update({ role: e.target.value })}
      >
        <option value="">All Roles</option>
        {userTypes.map((t) => (
          <option key={t._id} value={t._id}>
            {t.label ?? "Unnamed Role"}
          </option>
        ))}
      </Select>

      {filters.district ? (
        <Select
          aria-label="Filter by school"
          className="w-auto min-w-[160px]"
          value={filters.school ?? ""}
          onChange={(e) => update({ school: e.target.value })}
        >
          <option value="">All Schools</option>
          {schools.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name ?? "Unnamed School"}
            </option>
          ))}
        </Select>
      ) : null}

      {hasAnyFilter ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setQueryInput("");
            setSearchParams(new URLSearchParams());
          }}
        >
          Clear all
        </Button>
      ) : null}
    </div>
  );
}
