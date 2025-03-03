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
import { useQuery } from "@tanstack/react-query";
import { API_URL, CourseData } from "@/lib/constants";
import { useAuthStore } from "@/hooks/useAuth";
import { Button } from "./ui/button";
import { Link, useParams } from "react-router-dom";

export function NavMain() {
  const token = useAuthStore((state) => state.token);
  const {university : selectedUniversity} = useParams();

  const { data: courses, isLoading } = useQuery<[CourseData]>({
    queryKey: [selectedUniversity],
    queryFn: async () => {
      const response = await fetch(
        API_URL + `/auth/user/courses/${selectedUniversity}`,
        {
          method: "GET",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return data;
    },
  });

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

        {courses && courses.length < 1 && <Button>Kurzus hozzáadása </Button>}

        {courses &&
          courses.map((course) => (
            <Collapsible
              key={course._id}
              asChild
              className="group/collapsible"
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
                          <Link to={`/${selectedUniversity}/${course._id}${item.url}`}>
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
    url: "", // This will route to /courses/:courseId
  },
  {
    title: "Tanulók",
    url: "/students", // This will route to /courses/:courseId/students
  },
  {
    title: "Jelenléti ívek",
    url: "/attendance", // This will route to /courses/:courseId/attendance
  },
  {
    title: "Beállítások",
    url: "/settings", // This will route to /courses/:courseId/settings
  },
];