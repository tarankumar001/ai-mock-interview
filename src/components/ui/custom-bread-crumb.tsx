import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb";
  import { Home, LayoutDashboard } from "lucide-react";
  import React from "react";
  import { Link } from "react-router-dom";
  
  interface CustomBreadCrumbProps {
    breadCrumbPage: string;
    breadCrumpItems?: { link: string; label: string }[];
  }
  
  export const CustomBreadCrumb = ({
    breadCrumbPage,
    breadCrumpItems,
  }: CustomBreadCrumbProps) => {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                asChild
                className="flex items-center justify-center hover:text-emerald-500"
              >
                <Link to="/">
                  <Home className="w-3 h-3 mr-2" />
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
  
            {breadCrumpItems &&
              breadCrumpItems.map((item, i) => (
                <React.Fragment key={i}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      asChild
                      className="hover:text-emerald-500"
                    >
                      <Link to={item.link}>
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{breadCrumbPage}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        {/* Quick Dashboard Link */}
        <Link 
          to="/generate" 
          className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium px-3 py-2 rounded-md hover:bg-emerald-50 transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>
      </div>
    );
  };