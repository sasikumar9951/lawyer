"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  LayoutDashboard,
  MailIcon,
  MessageSquare,
  Package,
  PlusCircle,
  UserPlus,
  Users,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AdminShell>{children}</AdminShell>;
}

const AdminShell = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/admin" });
  };

  type NavItem = {
    title: string;
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  };

  type NavSection = {
    label: string;
    items: NavItem[];
  };

  const navSections: NavSection[] = [
    {
      label: "Main",
      items: [
        { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      ],
    },

    {
      label: "Cases",
      items: [
        { title: "All Cases", href: "/admin/cases", icon: FileText },
        {
          title: "Pending Cases",
          href: "/admin/cases/pending",
          icon: FileText,
        },
        {
          title: "Recent Cases",
          href: "/admin/cases/recent",
          icon: FileText,
        },
      ],
    },
    {
      label: "Forms",
      items: [
        { title: "All Forms", href: "/admin/forms", icon: FileText },
        {
          title: "Contact Form Responses",
          href: "/admin/forms/contact-form",
          icon: MailIcon,
        },
      ],
    },
    {
      label: "Lawyers",
      items: [
        { title: "All Lawyers", href: "/admin/lawyers", icon: Users },
        {
          title: "New Inquiries",
          href: "/admin/lawyers/inquiries",
          icon: MessageSquare,
        },
      ],
    },
    {
      label: "Services",
      items: [
        { title: "All Services", href: "/admin/services", icon: Package },
      ],
    },
    {
      label: "Messaging",
      items: [
        { title: "Templates", href: "/admin/templates", icon: MessageSquare },
      ],
    },
    {
      label: "Add",
      items: [
        {
          title: "Create Form",
          href: "/admin/forms/builder",
          icon: PlusCircle,
        },
        {
          title: "Create Service",
          href: "/admin/services/builder",
          icon: Package,
        },
        {
          title: "Add Lawyer",
          href: "/admin/lawyers/create",
          icon: UserPlus,
        },
      ],
    },
  ];

  const isActive = (currentPath: string, targetHref: string) => {
    if (currentPath === targetHref) return true;
    if (currentPath === `${targetHref}/`) return true;
    return false;
  };

  const quickActions = [
    {
      title: "Create Case",
      href: "/admin/cases/new",
      icon: PlusCircle,
      label: "Create new case",
    },
    {
      title: "Create Form",
      href: "/admin/forms/builder",
      icon: PlusCircle,
      label: "Create new form",
    },
    {
      title: "Create Service",
      href: "/admin/services/builder",
      icon: Package,
      label: "Create new service",
    },
    {
      title: "Add Lawyer",
      href: "/admin/lawyers/create",
      icon: UserPlus,
      label: "Add new lawyer",
    },
  ];

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="bg-white">
          <div className="px-2 py-2">
            <BrandLogo />
          </div>
        </SidebarHeader>
        <SidebarContent className="bg-white">
          {navSections.map((section) => (
            <SidebarGroup
              key={section.label}
              className={cn(section.label === "Add" && "md:hidden")}
            >
              <SidebarGroupLabel className="text-sm font-bold text-blue-800">
                {section.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        className={cn(
                          isActive(pathname, item.href) &&
                            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                        )}
                      >
                        <Link
                          href={item.href}
                          aria-label={`Go to ${item.title}`}
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter className="bg-white">
          <LogoutButton handleSignOut={handleSignOut} session={session} />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-white">
        <header className="flex h-14 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger aria-label="Toggle sidebar" />
            <h1 className="text-base font-semibold">Admin Panel</h1>
          </div>
          <QuickActions actions={quickActions} />
        </header>
        <main className="min-h-screen p-0 bg-blue-50">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

const QuickActions = ({
  actions,
}: {
  actions: Array<{
    title: string;
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    label: string;
  }>;
}) => {
  return (
    <div className="flex items-center gap-1">
      {/* Desktop view only - show all actions as buttons */}
      <div className="hidden md:flex items-center gap-1">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            aria-label={action.label}
            tabIndex={0}
          >
            <action.icon className="h-4 w-4 mr-1" />
            <span className="hidden lg:inline">{action.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

const BrandLogo = () => {
  // Read sidebar state safely using the context hook rendered within provider children
  let isCollapsed = false;
  try {
    // This hook is safe here because BrandLogo renders inside SidebarProvider via AdminShell tree
    const { state } = useSidebar();
    isCollapsed = state === "collapsed";
  } catch (_) {
    isCollapsed = false;
  }

  if (isCollapsed) {
    return (
      <div className="flex items-center justify-center">
        <span className="text-blue-600 text-2xl font-extrabold">V</span>
      </div>
    );
  }

  return (
    <Image
      src="/bgg.png"
      alt="Vakilfy Logo"
      width={140}
      height={40}
      className="h-10 w-auto"
    />
  );
};

const LogoutButton = ({
  handleSignOut,
  session,
}: {
  handleSignOut: () => void;
  session: any;
}) => {
  let isCollapsed = false;
  try {
    // This hook is safe here because BrandLogo renders inside SidebarProvider via AdminShell tree
    const { state } = useSidebar();
    isCollapsed = state === "collapsed";
  } catch (_) {
    isCollapsed = false;
  }

  if (isCollapsed) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-md border p-2 bg-white">
      <div className="min-w-0">
        <p className="truncate text-xs font-medium">
          {session?.user?.name || "Admin"}
        </p>
        <p className="truncate text-[10px] text-muted-foreground">
          {session?.user?.email || "Signed in"}
        </p>
      </div>{" "}
      <button
        onClick={handleSignOut}
        className="inline-flex h-7 items-center justify-center rounded-md bg-primary px-2 text-xs font-medium text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Sign out"
        tabIndex={0}
      >
        Logout
      </button>
    </div>
  );
};
