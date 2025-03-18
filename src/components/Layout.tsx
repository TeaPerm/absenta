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
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

// Function to generate breadcrumbs based on URL
const generateBreadcrumbs = (pathname: string) => {
  // Remove leading slash and split by slashes
  const paths = pathname.replace(/^\/+/, "").split("/");

  // Create breadcrumb items
  const breadcrumbs = paths
    .map((path, index) => {
      // Skip empty parts
      if (!path) return null;

      // Create the URL for this breadcrumb
      const url = `/${paths.slice(0, index + 1).join("/")}`;

      // Determine if this is the last item (current page)
      const isLast = index === paths.length - 1;

      // Format path for display (capitalize, replace dashes with spaces, etc.)
      const formattedPath = path
        .replace(/-/g, " ")
        .replace(/^\w/, (c) => c.toUpperCase());

      return { path: formattedPath, url, isLast };
    })
    .filter(Boolean); // Remove null items

  return breadcrumbs;
};

// Breadcrumbs component
const AppBreadcrumbs = () => {
  const location = useLocation();
  const breadcrumbs = generateBreadcrumbs(location.pathname);

  if (breadcrumbs.length < 1) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
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
