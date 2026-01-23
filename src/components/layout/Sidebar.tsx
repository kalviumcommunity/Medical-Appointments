"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-60 bg-gray-100 border-r p-4">
      <ul className="space-y-3">
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/users/1">Users</Link>
        </li>
      </ul>
    </aside>
  );
}
