import {
  Briefcase,
  FileText,
  ImageIcon,
  Inbox,
  LayoutDashboard,
  Newspaper,
  Package,
  Search,
  Settings,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { IconKey } from "@/lib/admin/access/routes";

export const NAV_ICONS: Record<IconKey, LucideIcon> = {
  dashboard: LayoutDashboard,
  pages: FileText,
  products: Package,
  blogs: Newspaper,
  careers: Briefcase,
  enquiries: Inbox,
  media: ImageIcon,
  seo: Search,
  users: Users,
  technical: Wrench,
  settings: Settings,
};
