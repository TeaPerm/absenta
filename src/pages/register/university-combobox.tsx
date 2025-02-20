"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import universities from "@/lib/universites";

export function UniversityCombobox({ field }: { field: any }) {
  const [open, setOpen] = React.useState(false);

  const universitiesArray = Object.entries(universities).map(
    ([key, value]) => ({
      code: key,
      name: value.name,
    })
  );

  const selectedUniversity = universitiesArray.find(
    (uni) => uni.code === field.value
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedUniversity ? (
            <span>
              {selectedUniversity.name}
              <span className="text-xs text-foreground/70">
                {" "}
                ({selectedUniversity.code})
              </span>
            </span>
          ) : (
            "Egyetem kiválasztása..."
          )}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Egyetem kiválasztása..." />
          <CommandList>
            <CommandEmpty>Nem található ilyen egyetem.</CommandEmpty>
            <CommandGroup>
              {universitiesArray.map((uni) => (
                <CommandItem
                  key={uni.code}
                  value={uni.code}
                  onSelect={(currentValue: string) => {
                    field.onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      field.value === uni.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {uni.name}
                  <span className="text-xs text-foreground/70">{` (${uni.code})`}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
