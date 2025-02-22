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
import { API_URL, Course } from "@/lib/constants";
import { useAuthStore } from "@/hooks/useAuth";
import { useAppStore } from "@/hooks/useAppStore";
import { Button } from "./ui/button";

export function NavMain() {
  const token = useAuthStore((state) => state.token);
  const selectedUniversity = useAppStore((state) => state.selectedUniversity);

  const { data: courses, isLoading } = useQuery<[Course]>({
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

  console.log(courses);

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
              // defaultOpen={item.isActive}
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
                          <a href={item.url}>
                            <span>{item.title}</span>
                          </a>
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
    title: "Tanulók",
    url: "#",
  },
  {
    title: "Jelenléti ívek",
    url: "#",
  },
  {
    title: "Beállítások",
    url: "#",
  },
];
