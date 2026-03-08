import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold">Owner Dashboard</h1>
      <ul className="space-y-4">
        <li>
          <Link
            href="/admin/services"
            className="text-blue-600 hover:underline"
          >
            Manage Services
          </Link>
        </li>
        <li>
          <Link href="/admin/gallery" className="text-blue-600 hover:underline">
            Manage Gallery
          </Link>
        </li>
      </ul>
    </div>
  );
}
