import { LogoMark } from './icons'

export default function SetupNotice() {
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="card w-full max-w-xl p-8 rise">
        <div className="flex items-center gap-3">
          <LogoMark size={36} />
          <h1 className="font-display text-xl font-bold">Trackfolio</h1>
        </div>
        <h2 className="mt-6 font-display text-lg font-semibold text-ink-100">
          Supabase is not configured yet
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-300">
          The app needs your Supabase project credentials before it can start. Create a{' '}
          <code className="rounded bg-ink-800 px-1.5 py-0.5 font-mono text-xs text-accent-300">.env</code>{' '}
          file in the project root with:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl border border-hairline bg-ink-900 p-4 font-mono text-xs leading-relaxed text-ink-200">
{`VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key`}
        </pre>
        <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm text-ink-300">
          <li>
            Create a project at{' '}
            <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-accent-400 hover:underline">
              supabase.com
            </a>
          </li>
          <li>
            Run <code className="font-mono text-xs text-accent-300">supabase/schema.sql</code> in the SQL Editor
          </li>
          <li>Copy the URL and anon key from Project Settings &gt; API</li>
          <li>Restart the dev server</li>
        </ol>
      </div>
    </div>
  )
}
