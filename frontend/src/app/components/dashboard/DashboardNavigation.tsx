import Link from "next/link";

const links = [
  {
    name: "My Store",
    href: "/",
  },
];

export function DashboardNavigation() {
  return (
    <>
      {links.map((link) => (
        <Link className="font-bold" key={link.href} href={link.href}>
          {link.name}
        </Link>
      ))}
    </>
  );
}
