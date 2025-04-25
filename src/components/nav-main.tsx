import { ChevronRight, SquareTerminal } from "lucide-react";
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
import { useAppStore } from "@/hooks/useAppStore";
import { Link, useParams } from "react-router-dom";
import { useCourses } from "@/hooks/useCourses";
import { Button } from "./ui/button";
import { useEffect } from "react";

export function NavMain() {
  const token = useAuthStore((state) => state.token);
  const { university: selectedUniversity = "" } = useParams();
  const activeCourseId = useAppStore((state) => state.activeCourseId);
  const setActiveCourseId = useAppStore((state) => state.setActiveCourseId);

  const { data: courses, isLoading } = useCourses(selectedUniversity, token);

  useEffect(() => {
    if (selectedUniversity) {
      // Keep the current course id if already set
    }
  }, [selectedUniversity]);

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
            <Collapsible 
              key={course._id} 
              asChild 
              className="group/collapsible"
              open={course._id === activeCourseId}
              onOpenChange={(isOpen) => {
                if (isOpen) {
                  setActiveCourseId(course._id);
                } else if (course._id === activeCourseId) {
                  setActiveCourseId(null);
                }
              }}
            >
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
