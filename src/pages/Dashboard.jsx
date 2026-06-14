import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { useApplications } from '../hooks/useApplications'
import {
  headlineStats,
  weeklyData,
  statusData,
  topCountries,
  sourceData,
  monthlyData,
  STATUS_COLORS,
} from '../utils/stats'

const AXIS = { fill: 'var(--color-ink-300)', fontSize: 11.5 }
const GRID = 'var(--color-hairline)'
const CURSOR_FILL = 'var(--color-surface-1)'

// Give ResponsiveContainer a sane first-paint size so it doesn't warn
// before its ResizeObserver reports the real dimensions.
const Responsive = (props) => (
  <ResponsiveContainer initialDimension={{ width: 520, height: 256 }} {...props} />
)

function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-hairline bg-ink-800 px-3.5 py-2.5 text-xs shadow-xl">
      {label != null && <p className="mb-1 font-semibold text-ink-200">{label}</p>}
      {payload.map((entry) => (
        <p key={entry.dataKey ?? entry.name} className="flex items-center gap-2 text-ink-300">
          <span className="size-2 rounded-full" style={{ background: entry.color ?? entry.payload?.fill }} />
          {entry.name}: <span className="font-mono font-semibold text-ink-100">{entry.value}</span>
        </p>
      ))}
    </div>
  )
}

function StatCard({ label, value, hint, delay }) {
  return (
    <div className="card p-5 rise" style={{ animationDelay: `${delay}ms` }}>
      <p className="text-xs font-semibold tracking-wide text-ink-400">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-1.5 text-xs text-ink-400">{hint}</p>
    </div>
  )
}

function ChartCard({ title, subtitle, children, delay, className = '' }) {
  return (
    <div className={`card p-5 rise ${className}`} style={{ animationDelay: `${delay}ms` }}>
      <h2 className="font-display text-sm font-bold">{title}</h2>
      <p className="mb-4 mt-0.5 text-xs text-ink-400">{subtitle}</p>
      <div className="h-64">{children}</div>
    </div>
  )
}

function EmptyChart() {
  return (
    <div className="grid h-full place-items-center text-sm text-ink-400">
      No data yet — add applications to see this chart.
    </div>
  )
}

export default function Dashboard() {
  const { rows, loading, error } = useApplications()

  if (loading) {
    return (
      <div className="card grid h-64 place-items-center">
        <div className="spinner" />
      </div>
    )
  }

  const stats = headlineStats(rows)
  const weekly = weeklyData(rows)
  const byStatus = statusData(rows)
  const countries = topCountries(rows)
  const sources = sourceData(rows)
  const monthly = monthlyData(rows)
  const hasData = rows.length > 0

  return (
    <div>
      <div className="rise">
        <h1 className="font-display text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-300">How your job hunt is going at a glance.</p>
      </div>

      {error && (
        <p className="mt-6 rounded-xl border border-rejected/30 bg-rejected/10 px-4 py-3 text-sm text-rejected">
          {error}
        </p>
      )}

      {/* Headline stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="TOTAL APPLICATIONS"
          value={stats.total}
          hint={`${stats.inProgress} still in progress`}
          delay={40}
        />
        <StatCard
          label="RESPONSE RATE"
          value={`${stats.responseRate}%`}
          hint="Moved beyond Applied"
          delay={80}
        />
        <StatCard
          label="INTERVIEW TO OFFER"
          value={`${stats.conversionRate}%`}
          hint="Of interviews that became offers"
          delay={120}
        />
        <StatCard label="OFFERS" value={stats.offers} hint="Keep going!" delay={160} />
      </div>

      {/* Charts */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Applications per week" subtitle="Last 12 weeks" delay={200}>
          {hasData ? (
            <Responsive>
              <BarChart data={weekly} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis dataKey="label" tick={AXIS} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={AXIS} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<DarkTooltip />} cursor={{ fill: CURSOR_FILL }} />
                <Bar dataKey="count" name="Applications" fill="var(--color-accent-500)" radius={[5, 5, 0, 0]} maxBarSize={28} />
              </BarChart>
            </Responsive>
          ) : (
            <EmptyChart />
          )}
        </ChartCard>

        <ChartCard title="Status breakdown" subtitle="Where every application stands" delay={240}>
          {byStatus.length ? (
            <Responsive>
              <PieChart>
                <Pie
                  data={byStatus}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="55%"
                  outerRadius="82%"
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {byStatus.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip content={<DarkTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span style={{ color: 'var(--color-ink-200)', fontSize: 12 }}>{value}</span>}
                />
              </PieChart>
            </Responsive>
          ) : (
            <EmptyChart />
          )}
        </ChartCard>

        <ChartCard title="Top countries" subtitle="Where you apply the most" delay={280}>
          {countries.length ? (
            <Responsive>
              <BarChart data={countries} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
                <CartesianGrid stroke={GRID} horizontal={false} />
                <XAxis type="number" tick={AXIS} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="country" tick={AXIS} axisLine={false} tickLine={false} width={86} />
                <Tooltip content={<DarkTooltip />} cursor={{ fill: CURSOR_FILL }} />
                <Bar dataKey="count" name="Applications" fill="var(--color-accent-400)" radius={[0, 5, 5, 0]} maxBarSize={18} />
              </BarChart>
            </Responsive>
          ) : (
            <EmptyChart />
          )}
        </ChartCard>

        <ChartCard title="Activity over time" subtitle="Applications per month" delay={320}>
          {monthly.length ? (
            <Responsive>
              <LineChart data={monthly} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis dataKey="label" tick={AXIS} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={AXIS} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<DarkTooltip />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Applications"
                  stroke="var(--color-accent-400)"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: 'var(--color-accent-400)', strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </Responsive>
          ) : (
            <EmptyChart />
          )}
        </ChartCard>

        <ChartCard
          title="Applications by source"
          subtitle="Where your applications come from"
          delay={360}
          className="lg:col-span-2"
        >
          {sources.length ? (
            <Responsive>
              <BarChart data={sources} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
                <CartesianGrid stroke={GRID} horizontal={false} />
                <XAxis type="number" tick={AXIS} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="source" tick={AXIS} axisLine={false} tickLine={false} width={110} />
                <Tooltip content={<DarkTooltip />} cursor={{ fill: CURSOR_FILL }} />
                <Bar dataKey="count" name="Applications" fill="var(--color-accent-500)" radius={[0, 5, 5, 0]} maxBarSize={20} />
              </BarChart>
            </Responsive>
          ) : (
            <EmptyChart />
          )}
        </ChartCard>
      </div>
    </div>
  )
}
