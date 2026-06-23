import Link from "next/link";

export default function PortalPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-5xl font-bold mb-2">
        Loyal Sigmite Portal
      </h1>

      <p className="text-gray-400 mb-8">
        Welcome to SRDMS
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl mb-2">My Queries</h2>
          <p className="text-4xl font-bold">0</p>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl mb-2">My Fumblings</h2>
          <p className="text-4xl font-bold">0</p>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl mb-2">Outstanding Fines</h2>
          <p className="text-4xl font-bold">₦0</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/members"
          className="border rounded-lg p-6 hover:bg-gray-900 transition"
        >
          <h2 className="text-2xl font-bold mb-2">
            My Profile
          </h2>

          <p className="text-gray-400">
            View your membership information.
          </p>
        </Link>

        <Link
          href="/queries"
          className="border rounded-lg p-6 hover:bg-gray-900 transition"
        >
          <h2 className="text-2xl font-bold mb-2">
            My Queries
          </h2>

          <p className="text-gray-400">
            View issued queries and responses.
          </p>
        </Link>

        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2">
            My Fumblings
          </h2>

          <p className="text-gray-400">
            Coming soon.
          </p>
        </div>
      </div>
    </main>
  );
}