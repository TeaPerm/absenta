import { ChevronRight, Plus, SquareTerminal } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/hooks/useAuth";
import { Link, useParams } from "react-router-dom";
import { useCourses } from "@/hooks/useCourses";
import { Button } from "./ui/button";

export function NavMain() {
  const token = useAuthStore((state) => state.token);
  const { university: selectedUniversity } = useParams();

  const { data: courses, isLoading } = useCourses(selectedUniversity, token);

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="gap-2">
        <span>Kurzusok</span>
        <span className="font-bold">{`(${selectedUniversity})`}</span>
      </SidebarGroupLabel>
      <SidebarMenu>
        {isLoading && (
          <>
            <SidebarMenuSkeleton />
            <SidebarMenuSkeleton />
            <SidebarMenuSkeleton />
          </>
        )}

        {courses && courses.length < 1 && (
          <Button className="w-fit text-sm text-center">
            <div className="flex items-center justify-center">
              Jelenleg nincs kurzusod
            </div>
          </Button>
        )}

        {courses &&
          courses.map((course) => (
            <Collapsible key={course._id} asChild className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={course.name}
                    className="cursor-pointer h-10"
                  >
                    <SquareTerminal />
                    <span>{course.name}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {sidebarMenuSubitems.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild>
                          <Link
                            to={`/${selectedUniversity}/${course._id}${item.url}`}
                          >
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

const sidebarMenuSubitems = [
  {
    title: "Kezdőlap",
    url: "",
  },
  {
    title: "Tanulók",
    url: "/students",
  },
  {
    title: "Jelenléti ívek",
    url: "/attendance",
  },
  {
    title: "Beállítások",
    url: "/settings",
  },
];
