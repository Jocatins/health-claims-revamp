import React from "react";
import DashboardIcon from "../assets/sidebar-icons/dashboard-icon";
import EnrolleeIcon from "../assets/sidebar-icons/enrollee-icon";
import SettingsIcon from "../assets/sidebar-icons/settings-icon";

export interface SidebarItem {
  icon: React.ReactNode | null;
  label: string;
  active: boolean;
 
  path?: string;
  children?: SidebarItem[];
}

// Admin Sidebar
export const ADMIN_SIDEBAR: SidebarItem[] = [
  {
    icon: <DashboardIcon className="w-5 h-5" />,
    label: "Dashboard",
    active: false,
    path: "/enrollee/dashboard"
  },
  {
    icon: <EnrolleeIcon className="w-5 h-5" />,
    label: "Enrollees",
    active: false,
    children: [
      { icon: null, label: "All Enrollees", active: false, path:"/enrollee/enrollees" },
      { icon: null, label: "Enrollee Registration", active: false, path: "/enrollee/registration/individual" },
      // { icon: null, label: "Corporate Registration", active: false, path: "/enrollee/registration/corporate" }
    ]
  },
  {
    icon: <EnrolleeIcon className="w-5 h-5" />,
    label: "Providers",
    active: false,
    children: [
      { icon: null, label: "All Providers", active: false, path: "/providers" },
      { icon: null, label: "Providers Registration", active: false, path: "/providers/registration" }
    ]
  },
  {
    icon: <EnrolleeIcon className="w-5 h-5" />,
    label: "Payments",
    active: false,
    children: [
      { icon: null, label: "Claims", active: false, path: "/payments/claims" },
      { icon: null, label: "Authorization", active: false, path: "/payments/authorization" },
      { icon: null, label: "Tracker", active: false, path: "/payments/tracker" }
    ]
  },
    {
    icon: <EnrolleeIcon className="w-5 h-5" />,
    label: "Reports",
    active: false,
    children: [
      { icon: null, label: "Claims History", active: false, path: "/reports/claims-history" },
      { icon: null, label: "Payments History", active: false, path: "/reports/payments-history" },
    
    ]
  },
   {
    icon: <SettingsIcon className="w-5 h-5" />,
    label: "Settings",
    active: false,
 
  }
];

// Provider Sidebar
export const PROVIDER_SIDEBAR: SidebarItem[] = [
  {  icon: <DashboardIcon className="w-5 h-5" />, label: "Dashboard", active: false, path: "/enrollee/dashboard" },
  // {  icon: <EnrolleeIcon className="w-5 h-5" />, label: "Claims Management", active: false, path: "/claims" },
   {
    icon: <EnrolleeIcon className="w-5 h-5" />,
    label: "Providers",
    active: false,
    children: [
      { icon: null, label: "Claims Management", active: false, path: "/claims" },
      { icon: null, label: "Emergency Claims", active: false, path: "/nemsas-management" }
    ]
  },
  { icon: <EnrolleeIcon className="w-5 h-5" />, label: "Enrollees Management", active: false, path: "/enrollee-management" },
  { icon: <SettingsIcon className="w-5 h-5" />, label: "Settings", active: false, path: "/settings"  },
  {  icon: <SettingsIcon className="w-5 h-5" />, label: "Tariff", active: false, path: "/tariff"  },
];
