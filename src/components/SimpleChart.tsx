type Point = { month: string; value: number }

export function SimpleChart({
  data,
  unit = '',
  color = '#2ee6a6',
}: {
  data: Point[]
  unit?: string
  color?: string
}) {
  const max = Math.max(...data.map((d) => d.value)) * 1.08
  const w = 560
  const h = 180
  const padX = 12
  const padY = 16
  const step = (w - padX * 2) / (data.length - 1)

  const points = data
    .map((d, i) => {
      const x = padX + i * step
      const y = h - padY - (d.value / max) * (h - padY * 2)
      return `${x},${y}`
    })
    .join(' ')

  const area = `${padX},${h - padY} ${points} ${padX + (data.length - 1) * step},${h - padY}`

  return (
    <div>
      <div className="chart-label">
        <span>
          {data[0]?.month} → {data[data.length - 1]?.month}
        </span>
        <span>
          {data[data.length - 1]?.value}
          {unit}
        </span>
      </div>
      <svg className="chart" viewBox={`0 0 ${w} ${h}`} role="img" aria-label="График">
        <defs>
          <linearGradient id={`fill-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill={`url(#fill-${color.replace('#', '')})`} />
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((d, i) => {
          const x = padX + i * step
          const y = h - padY - (d.value / max) * (h - padY * 2)
          return <circle key={d.month} cx={x} cy={y} r="3.5" fill={color} />
        })}
      </svg>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${data.length}, 1fr)`,
          gap: 4,
          fontSize: 11,
          color: 'var(--text-soft)',
          textAlign: 'center',
        }}
      >
        {data.map((d) => (
          <span key={d.month}>{d.month}</span>
        ))}
      </div>
    </div>
  )
}
