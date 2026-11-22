export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-surface border border-line rounded-xl p-8">
        <h1 className="text-2xl font-semibold">JulNow Admin</h1>
        <p className="mt-1 text-sm text-muted">Sign in to manage users and listings</p>

        <form className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium">
            Email
            <input
              type="email"
              placeholder="admin@julnow.com"
              className="h-10 px-3 rounded-md border border-line focus:outline-none focus:border-primary"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium">
            Password
            <input
              type="password"
              className="h-10 px-3 rounded-md border border-line focus:outline-none focus:border-primary"
            />
          </label>

          <button
            type="submit"
            className="h-10 mt-2 rounded-md bg-primary text-on-primary font-medium hover:bg-primary-hover"
          >
            Log in
          </button>
        </form>
      </div>
    </main>
  )
}