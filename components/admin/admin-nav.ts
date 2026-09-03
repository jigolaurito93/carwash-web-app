export type AdminNavLink = {
  href: string;
  label: string;
  masterOnly?: boolean;
};

export type AdminNavSection = {
  id: string;
  label: string;
  collapsible?: boolean;
  links: AdminNavLink[];
};

export const adminNavSections: AdminNavSection[] = [
  {
    id: "overview",
    label: "Overview",
    links: [
      { href: "/admin/dashboard", label: "Dashboard" },
      { href: "/admin/appointment", label: "Appointments" },
    ],
  },
  {
    id: "catalog",
    label: "Catalog",
    links: [{ href: "/admin/services", label: "Services" }],
  },
  {
    id: "website",
    label: "Website",
    collapsible: true,
    links: [
      { href: "/admin/shop-info", label: "Shop Info" },
      { href: "/admin/welcome", label: "Welcome" },
      { href: "/admin/about", label: "About" },
      { href: "/admin/gallery", label: "Gallery" },
      { href: "/admin/announcements", label: "Announcements" },
      { href: "/admin/faq", label: "FAQ" },
      { href: "/admin/legal", label: "Legal Pages" },
    ],
  },
  {
    id: "account",
    label: "Account",
    links: [
      { href: "/admin/profile", label: "Account Setting" },
      { href: "/admin/invite", label: "Invite Admin", masterOnly: true },
    ],
  },
];

export function getAdminNavSections(isMaster: boolean): AdminNavSection[] {
  return adminNavSections
    .map((section) => ({
      ...section,
      links: section.links.filter((link) => !link.masterOnly || isMaster),
    }))
    .filter((section) => section.links.length > 0);
}
