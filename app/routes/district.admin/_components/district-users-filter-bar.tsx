import { useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "react-router";
import { Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select } from "~/components/ui/select";
import { isSelectableRole } from "~/lib/user";

type FilterKey = "role" | "school" | "query";

interface DistrictUsersFilterBarProps {
  userTypes: ReadonlyArray<{
    _id: string;
    label?: string | null;
  }>;
  schools: ReadonlyArray<{ _id: string; name?: string | null }>;
  filters: {
    role?: string | undefined;
    school?: string | undefined;
    query?: string | undefined;
  };
}

export function DistrictUsersFilterBar({
  userTypes,
  schools,
  filters,
}: DistrictUsersFilterBarProps) {
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
    merged.delete("page");
    setSearchParams(merged);
  }

  function onSubmitQuery(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    update({ query: queryInput.trim() });
  }

  // Globally hidden roles, plus "Administrator" (district admins don't manage
  // platform admins).
  const filteredTypes = userTypes.filter(
    (t) =>
      isSelectableRole(t) &&
      (t.label ?? "").trim().toLowerCase() !== "administrator",
  );

  const sortedSchools = [...schools].sort((a, b) =>
    (a.name ?? "").localeCompare(b.name ?? ""),
  );

  const hasAnyFilter =
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
          placeholder="Search by name"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          aria-label="Search users"
          className="pl-10"
        />
      </form>

      <Select
        aria-label="Filter by role"
        className="w-auto min-w-[140px]"
        value={filters.role ?? ""}
        onChange={(e) => update({ role: e.target.value })}
      >
        <option value="">All User Roles</option>
        {filteredTypes.map((t) => (
          <option key={t._id} value={t._id}>
            {t.label ?? "Unnamed Role"}
          </option>
        ))}
      </Select>

      {sortedSchools.length > 0 ? (
        <Select
          aria-label="Filter by school"
          className="w-auto min-w-[160px]"
          value={filters.school ?? ""}
          onChange={(e) => update({ school: e.target.value })}
        >
          <option value="">All Schools</option>
          {sortedSchools.map((s) => (
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
