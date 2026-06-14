const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const Icon = ({ children, size = 18, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} {...base} {...props}>
    {children}
  </svg>
)

export const LogoMark = ({ size = 30 }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
    <rect width="32" height="32" rx="9" fill="url(#lg)" />
    <defs>
      <linearGradient id="lg" x1="0" y1="0" x2="32" y2="32">
        <stop stopColor="#3b82f6" />
        <stop offset="1" stopColor="#1d4ed8" />
      </linearGradient>
    </defs>
    <path
      d="M10 13.5a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3v-6Z"
      fill="none"
      stroke="#fff"
      strokeWidth="2"
    />
    <path d="M13 10.5V10a3 3 0 0 1 6 0v.5" fill="none" stroke="#fff" strokeWidth="2" />
    <circle cx="16" cy="16.5" r="1.8" fill="#fff" />
  </svg>
)

export const BriefcaseIcon = (p) => (
  <Icon {...p}>
    <rect x="3" y="7.5" width="18" height="13" rx="2.5" />
    <path d="M8.5 7.5V6a2.5 2.5 0 0 1 2.5-2.5h2A2.5 2.5 0 0 1 15.5 6v1.5M3 12.5h18" />
  </Icon>
)

export const ChartIcon = (p) => (
  <Icon {...p}>
    <path d="M4 4v15a1 1 0 0 0 1 1h15" />
    <path d="M8 15.5v-3M12.5 15.5v-7M17 15.5V6" />
  </Icon>
)

export const PlusIcon = (p) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
)

export const SearchIcon = (p) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </Icon>
)

// Two stacked chevrons; `dir` ('asc' | 'desc' | null) brightens the active arrow.
export const SortIcon = ({ size = 14, dir = null, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m8 9 4-4 4 4" opacity={dir === 'asc' ? 1 : dir === 'desc' ? 0.3 : 0.55} />
    <path d="m16 15-4 4-4-4" opacity={dir === 'desc' ? 1 : dir === 'asc' ? 0.3 : 0.55} />
  </svg>
)

export const PencilIcon = (p) => (
  <Icon {...p}>
    <path d="M16.5 3.9a2.1 2.1 0 0 1 3 3L7 19.5 3 21l1.5-4L16.5 3.9Z" />
  </Icon>
)

export const TrashIcon = (p) => (
  <Icon {...p}>
    <path d="M4 7h16M9.5 7V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v2M6.5 7l1 13h9l1-13M10 11v5M14 11v5" />
  </Icon>
)

export const ExternalIcon = (p) => (
  <Icon {...p}>
    <path d="M14 4h6v6M20 4l-9 9M19 14v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
  </Icon>
)

export const DownloadIcon = (p) => (
  <Icon {...p}>
    <path d="M12 4v11M7.5 11l4.5 4.5L16.5 11M4 19.5h16" />
  </Icon>
)

export const LogoutIcon = (p) => (
  <Icon {...p}>
    <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3M15 16l4-4-4-4M19 12H9" />
  </Icon>
)

export const CloseIcon = (p) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
)

export const MapPinIcon = (p) => (
  <Icon {...p}>
    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </Icon>
)

export const CalendarIcon = (p) => (
  <Icon {...p}>
    <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
    <path d="M4 10.5h16M8.5 3.5v4M15.5 3.5v4" />
  </Icon>
)

export const InboxIcon = (p) => (
  <Icon {...p}>
    <path d="M4 13.5 6.5 5.8A2 2 0 0 1 8.4 4.5h7.2a2 2 0 0 1 1.9 1.3L20 13.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4.5Z" />
    <path d="M4 13.5h5l1.2 2h3.6l1.2-2h5" />
  </Icon>
)
