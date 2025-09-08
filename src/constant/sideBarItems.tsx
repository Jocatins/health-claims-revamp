import DashboardIcon from "../assets/sidebar-icons/dashboard-icon";
import EnrolleeIcon from "../assets/sidebar-icons/enrollee-icon";
import SettingsIcon from "../assets/sidebar-icons/settings-icon";

export interface SidebarItem {
 icon: React.ReactNode;
  label: string;
  active: boolean;
  href?: string;
  path?: string;
  children?: SidebarItem[];
}

export const PROVIDER_SIDEBAR: SidebarItem[] = [
  { 
    icon: <DashboardIcon className="w-5 h-5" />, 
    label: "Dashboard", 
    active: false,
    href: "/dashboard"
  },
  { 
    icon: <EnrolleeIcon className="w-5 h-5" />, 
    label: "Enrollees", 
    active: false,
    children: [
      { icon: null, label: "All Enrollees", active: false, href: "/enrollees" },
      { icon: null, label: "Enrollee Registration", active: false, href: "/enrollees/registration" }
    ]
  },
  { 
    icon: <EnrolleeIcon className="w-5 h-5" />, 
    label: "Providers", 
    active: false,
    children: [
      { icon: null, label: "All Providers", active: false, href: "/providers" },
      { icon: null, label: "Providers Registration", active: false, href: "/providers/registration" }
    ]
  },
  { 
    icon: <EnrolleeIcon className="w-5 h-5" />, 
    label: "Payments", 
    active: false,
    children: [
      { icon: null, label: "Claims", active: false, href: "/payments/claims" },
      { icon: null, label: "Authorization", active: false, href: "/payments/authorization" }
    ]
  }
];


export const ADMIN_SIDEBAR: SidebarItem[] = [
  {  icon: <DashboardIcon className="w-5 h-5" />, label: "Dashboard", active: false, path: "/dashboard" },
  {  icon: <EnrolleeIcon className="w-5 h-5" />, label: "Claims Management", active: false, path: "/claims" },
  { icon: <EnrolleeIcon className="w-5 h-5" />, label: "Enrollees Management", active: false},
  { icon: <SettingsIcon className="w-5 h-5" />, label: "Settings", active: false },
  {  icon: <SettingsIcon className="w-5 h-5" />, label: "Tariff", active: false },
];