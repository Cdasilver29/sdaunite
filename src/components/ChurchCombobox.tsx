import { useState, useMemo } from "react";
import { useChurches } from "@/hooks/useChurches";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ChurchComboboxProps {
  churchId: string;
  customChurchName: string;
  onChurchIdChange: (id: string) => void;
  onCustomChurchNameChange: (name: string) => void;
  required?: boolean;
  label?: string;
}

const ChurchCombobox = ({
  churchId,
  customChurchName,
  onChurchIdChange,
  onCustomChurchNameChange,
  required = false,
  label = "Home Church",
}: ChurchComboboxProps) => {
  const { data: churches } = useChurches();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const selectedChurch = useMemo(
    () => churches?.find((c) => c.id === churchId),
    [churches, churchId]
  );

  const displayValue = selectedChurch
    ? `${selectedChurch.church_name} — ${selectedChurch.city}`
    : customChurchName;

  const filtered = useMemo(() => {
    if (!churches || !query) return churches || [];
    const q = query.toLowerCase();
    return churches.filter(
      (c) =>
        c.church_name.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
    );
  }, [churches, query]);

  const handleInputChange = (val: string) => {
    setQuery(val);
    setOpen(true);
    // If user is typing, clear the selected church id and set custom name
    onChurchIdChange("");
    onCustomChurchNameChange(val);
  };

  const handleSelect = (id: string) => {
    const church = churches?.find((c) => c.id === id);
    onChurchIdChange(id);
    onCustomChurchNameChange("");
    setQuery("");
    setOpen(false);
  };

  const handleBlur = () => {
    // Delay to allow click on option
    setTimeout(() => setOpen(false), 200);
  };

  return (
    <div className="space-y-2">
      <Label>
        {label} {required && "*"}
      </Label>
      <div className="relative">
        <Input
          value={open ? query : displayValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            setQuery(displayValue);
            setOpen(true);
          }}
          onBlur={handleBlur}
          placeholder="Type or select your church"
          required={required && !churchId && !customChurchName.trim()}
        />
        {open && (
          <div className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md border border-border bg-popover shadow-md">
            {filtered.length > 0 ? (
              filtered.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(c.id)}
                  className={cn(
                    "flex w-full items-center px-3 py-2 text-sm hover:bg-accent text-left",
                    churchId === c.id && "bg-accent font-medium"
                  )}
                >
                  {c.church_name} — {c.city}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No match found — your typed name will be saved
              </div>
            )}
          </div>
        )}
      </div>
      {!churchId && customChurchName.trim() && !open && (
        <p className="text-xs text-muted-foreground">Custom church: "{customChurchName.trim()}"</p>
      )}
    </div>
  );
};

export default ChurchCombobox;
