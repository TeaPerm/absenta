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
import { useQuery } from "@tanstack/react-query";

export function UniversityCombobox() {
  const { data: universities, isLoading, error } = useQuery({
    queryKey: ["universities"],
    queryFn: async () => {
      const response = await fetch(
        "http://universities.hipolabs.com/search?country=Hungary"
      );
      return response.json();
    },
  });

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full"
        >
          {value || "Select university..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search university..." className="h-9" />
          <CommandList>
            {isLoading && <CommandEmpty>Loading...</CommandEmpty>}
            {error && <CommandEmpty>Error fetching data.</CommandEmpty>}
            {!isLoading && universities?.length === 0 && (
              <CommandEmpty>No universities found.</CommandEmpty>
            )}
            <CommandGroup>
              {universities?.map((university) => (
                <CommandItem
                  key={university.name}
                  value={university.name}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {university.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === university.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
