"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface navLinkType {
  label: string;
  path: string;
}

export function NavigationList() {
  const navigation: Array<navLinkType> = [
    {
      label: "Home",
      path: "/",
    },
    {
      label: "Scoring Helpers",
      path: "/scoring",
    },
  ];

  const pathName = usePathname();

  return (
    <div className="ml-5 flex">
      {navigation.map((link) => {
        let linkClasses =
          "rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white";

        if (
          pathName === link.path ||
          ("/" !== link.path && 0 <= pathName.indexOf(link.path))
        ) {
          linkClasses =
            "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium";
        }

        return (
          <Link
            key={`${link.label}-${link.path}`}
            href={link.path}
            className={linkClasses}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
