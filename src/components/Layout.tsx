import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useCourse } from "@/hooks/useCourse";

const generateBreadcrumbs = (pathname: string) => {
  const paths = pathname.replace(/^\/+/, "").split("/");

  const breadcrumbs = paths.map((path, index) => {
    if (!path) return null;

    const url = `/${paths.slice(0, index + 1).join("/")}`;

    const isLast = index === paths.length - 1;

    const formattedPath = path
      .replace(/-/g, " ")
      .replace(/^\w/, (c) => c.toUpperCase());

    const translations: { [key: string]: string } = {
      "students": "Hallgatók",
      "attendance": "Jelenlét",
      "upload": "Jelenlét feltöltése",
      "settings": "Beállítások",
      "create": "Új kurzus létrehozása"
    };

    const translatedPath = translations[path] || formattedPath;

    return { path: translatedPath, url, isLast };
  });

  return breadcrumbs.filter(Boolean);
};

const AppBreadcrumbs = () => {
  const location = useLocation();
  const paths = location.pathname.replace(/^\/+/, "").split("/");
  const courseId = paths[1]; // The course ID is the second segment
  const isCreatePage = paths.includes("create");
  const { data: course } = useCourse(isCreatePage ? undefined : courseId);
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ path: string; url: string; isLast: boolean } | null>>([]);

  useEffect(() => {
    const crumbs = generateBreadcrumbs(location.pathname);
    
    if (course && crumbs && !isCreatePage) {
      const updatedCrumbs = crumbs.map((crumb, index) => {
        if (index === 1 && crumb) { // The course ID is at index 1
          return {
            ...crumb,
            path: course.name
          };
        }
        return crumb;
      });
      setBreadcrumbs(updatedCrumbs);
    } else {
      setBreadcrumbs(crumbs);
    }
  }, [location.pathname, course, isCreatePage]);

  if (breadcrumbs.length < 1) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.filter((crumb): crumb is { path: string; url: string; isLast: boolean } => crumb !== null).map((crumb, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
            <BreadcrumbItem className="hidden md:block">
              {crumb && crumb.isLast ? (
                <BreadcrumbPage>{crumb.path}</BreadcrumbPage>
              ) : (
                crumb && (
                  <BreadcrumbLink href={crumb.url}>{crumb.path}</BreadcrumbLink>
                )
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default function Layout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || isAuthenticated == null) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <AppBreadcrumbs />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
