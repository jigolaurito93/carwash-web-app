import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold">Owner Dashboard</h1>
      <ul className="space-y-4 text-yellow-400">
        <li>
          <Link href={"/admin/profile"} className="text-3xl font-bold">
            Profile
          </Link>
        </li>
        <li>
          <Link href="/admin/services" className="text-3xl font-bold">
            Manage Services
          </Link>
        </li>
        <li>
          <Link href="/admin/gallery" className="text-3xl font-bold">
            Manage Gallery
          </Link>
        </li>
      </ul>
    </div>
  );
}
