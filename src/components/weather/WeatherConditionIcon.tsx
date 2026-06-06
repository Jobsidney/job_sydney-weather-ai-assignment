import { cn } from '@/lib/utils'
import {
  isNightWeather,
  periodIsNight,
  weatherVisualFromCode,
  type WeatherVisual,
} from '@/lib/weather-visual'

type WeatherConditionIconProps = {
  conditionCode: string
  iconUrl?: string
  time?: string
  periodLabel?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  animated?: boolean
}

const SIZE_MAP = {
  sm: 40,
  md: 56,
  lg: 96,
  xl: 160,
} as const

export function WeatherConditionIcon({
  conditionCode,
  iconUrl,
  time,
  periodLabel,
  size = 'md',
  className,
  animated = false,
}: WeatherConditionIconProps) {
  const visual = weatherVisualFromCode(conditionCode)
  const periodNight = periodLabel != null ? periodIsNight(periodLabel) : undefined
  const isNight = periodNight ?? isNightWeather(iconUrl, time)
  const dimension = SIZE_MAP[size]

  return (
    <span
      className={cn(
        'weather-condition-icon',
        `weather-condition-icon--${size}`,
        animated && 'weather-condition-icon--animated',
        className,
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 64 64"
        width={dimension}
        height={dimension}
        role="presentation"
      >
        <defs>
          <radialGradient id="sun-core" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFE566" />
            <stop offset="55%" stopColor="#FFB020" />
            <stop offset="100%" stopColor="#F97316" />
          </radialGradient>
          <radialGradient id="moon-core" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="70%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#94A3B8" />
          </radialGradient>
          <linearGradient id="cloud-light" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#D9E4F2" />
          </linearGradient>
          <linearGradient id="cloud-mid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
          <linearGradient id="cloud-dark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
          <linearGradient id="rain-stroke" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>
        <WeatherArt visual={visual} isNight={isNight} />
      </svg>
    </span>
  )
}

function WeatherArt({
  visual,
  isNight,
}: {
  visual: WeatherVisual
  isNight: boolean
}) {
  switch (visual) {
    case 'clear':
      return isNight ? <MoonIcon /> : <SunIcon />
    case 'mainly-clear':
      return isNight ? <MoonCloudIcon sparse /> : <SunCloudIcon sparse />
    case 'partly-cloudy':
      return isNight ? <MoonCloudIcon /> : <SunCloudIcon />
    case 'overcast':
      return <CloudStack tone="mid" />
    case 'fog':
      return <FogIcon />
    case 'drizzle':
      return <RainCloudIcon light />
    case 'rain':
      return <RainCloudIcon />
    case 'showers':
      return <RainCloudIcon heavy />
    case 'snow':
      return <SnowCloudIcon />
    case 'thunder':
      return <ThunderIcon />
    default:
      return <SunCloudIcon />
  }
}

function SunIcon() {
  return (
    <>
      <circle cx="32" cy="32" r="14" fill="url(#sun-core)" />
      {[
        [32, 8],
        [32, 56],
        [8, 32],
        [56, 32],
        [15, 15],
        [49, 49],
        [49, 15],
        [15, 49],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3.2" fill="#FFB020" />
      ))}
    </>
  )
}

function MoonIcon() {
  return (
    <>
      <circle cx="34" cy="30" r="14" fill="url(#moon-core)" />
      <circle cx="40" cy="26" r="11" fill="#E8EEF5" opacity="0.92" />
    </>
  )
}

function SunCloudIcon({ sparse = false }: { sparse?: boolean }) {
  return (
    <>
      <circle cx="22" cy="22" r="11" fill="url(#sun-core)" />
      <ellipse cx="36" cy="38" rx="17" ry="11" fill="url(#cloud-light)" />
      <ellipse cx="24" cy="40" rx="12" ry="9" fill="url(#cloud-light)" />
      {!sparse && <ellipse cx="46" cy="36" rx="10" ry="8" fill="#F8FAFC" />}
    </>
  )
}

function MoonCloudIcon({ sparse = false }: { sparse?: boolean }) {
  return (
    <>
      <circle cx="22" cy="20" r="9" fill="url(#moon-core)" />
      <circle cx="26" cy="17" r="7" fill="#E8EEF5" opacity="0.92" />
      <ellipse cx="36" cy="38" rx="17" ry="11" fill="url(#cloud-mid)" />
      <ellipse cx="24" cy="40" rx="12" ry="9" fill="url(#cloud-light)" />
      {!sparse && <ellipse cx="46" cy="36" rx="10" ry="8" fill="#E2E8F0" />}
    </>
  )
}

function CloudStack({ tone }: { tone: 'light' | 'mid' | 'dark' }) {
  const fill =
    tone === 'light'
      ? 'url(#cloud-light)'
      : tone === 'mid'
        ? 'url(#cloud-mid)'
        : 'url(#cloud-dark)'
  return (
    <>
      <ellipse cx="32" cy="34" rx="20" ry="12" fill={fill} />
      <ellipse cx="22" cy="38" rx="13" ry="9" fill={fill} />
      <ellipse cx="44" cy="36" rx="12" ry="8" fill={fill} />
    </>
  )
}

function RainCloudIcon({ light = false, heavy = false }: { light?: boolean; heavy?: boolean }) {
  const drops = heavy ? 5 : light ? 2 : 3
  return (
    <>
      <CloudStack tone="mid" />
      {Array.from({ length: drops }).map((_, index) => {
        const x = 22 + index * (heavy ? 6 : 8)
        return (
          <line
            key={index}
            x1={x}
            y1={46}
            x2={x - 2}
            y2={54}
            stroke="url(#rain-stroke)"
            strokeWidth={heavy ? 2.4 : 2}
            strokeLinecap="round"
          />
        )
      })}
    </>
  )
}

function SnowCloudIcon() {
  return (
    <>
      <CloudStack tone="light" />
      {[
        [24, 48],
        [32, 52],
        [40, 48],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" fill="#BFDBFE" />
      ))}
    </>
  )
}

function FogIcon() {
  return (
    <>
      <CloudStack tone="light" />
      {[44, 50, 56].map((y) => (
        <rect
          key={y}
          x="14"
          y={y}
          width="36"
          height="2.5"
          rx="1.2"
          fill="#94A3B8"
          opacity={y === 44 ? 0.55 : y === 50 ? 0.75 : 0.9}
        />
      ))}
    </>
  )
}

function ThunderIcon() {
  return (
    <>
      <CloudStack tone="dark" />
      <path
        d="M30 44 L26 52 L30 52 L28 58 L36 48 L32 48 L34 44 Z"
        fill="#FACC15"
        stroke="#EAB308"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
    </>
  )
}
