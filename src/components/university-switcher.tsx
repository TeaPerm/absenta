import { ChevronsUpDown, Plus, University } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { getUniversityName } from "@/lib/utils";
import { useAppStore } from "@/hooks/useAppStore";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function UniversitySwitcher({
  universities,
}: {
  universities: string[];
}) {
  const { isMobile } = useSidebar();

  const selectedUniversity = useAppStore((state) => state.selectedUniversity);
  const setSelectedUniversity = useAppStore(
    (state) => state.setSelectedUniversity
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!selectedUniversity && universities.length > 0) {
      setSelectedUniversity(universities[0]);
    }
  });

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent h-20 cursor-pointer data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <University className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="font-semibold">
                  {getUniversityName(selectedUniversity)}
                </span>
                <span className="truncate text-xs">{selectedUniversity}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Egyetemek
            </DropdownMenuLabel>
            {universities.map((university) => (
              <DropdownMenuItem
                key={university}
                onClick={() => {
                  queryClient.invalidateQueries({ queryKey: [selectedUniversity] });
                  setSelectedUniversity(university);
                }}
                className="gap-2 p-2 cursor-pointer"
              >
                <div className="flex size-6 items-center justify-center rounded-xs border">
                  <University className="size-4 shrink-0" />
                </div>
                {university}
                <DropdownMenuShortcut className="text-xs">
                  {university}
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                Egyetem hozzáadása
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
