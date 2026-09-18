export type Participant = {
  name: string
  role: string
  wallet: string
  share: number
}

export type TokenProject = {
  id: string
  symbol: string
  name: string
  description: string
  ownerWallet: string
  contract: string
  wallets: number
  delegated: number
  unbonding: number
  activeDelegated: number
  paidDel: number
  /** Долевые помощники — делят marketing reward. Владелец сюда не входит. */
  participants: Participant[]
  myReward?: number
}

export const marketingRewardPercent = 10

export const myProjects: TokenProject[] = [
  {
    id: 'blog',
    symbol: 'BLOG',
    name: 'Blog Project',
    description: 'Токен проекта блогера',
    ownerWallet: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    contract: '0xBLOG000000000000000000000000000000000001',
    wallets: 4281,
    delegated: 1_200_000,
    unbonding: 180_000,
    activeDelegated: 1_020_000,
    paidDel: 18_420,
    myReward: 12_450,
    participants: [
      { name: 'Alex', role: 'Консультант', wallet: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2', share: 60 },
      { name: 'Max', role: 'Маркетинг', wallet: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db', share: 40 },
    ],
  },
  {
    id: 'music',
    symbol: 'MUSIC',
    name: 'Music Club',
    description: 'Токен музыкального сообщества',
    ownerWallet: '0x1111111111111111111111111111111111111111',
    contract: '0xMUSIC00000000000000000000000000000000001',
    wallets: 873,
    delegated: 420_000,
    unbonding: 42_000,
    activeDelegated: 378_000,
    paidDel: 8_210,
    myReward: 4_210,
    participants: [
      { name: 'You', role: 'Консультант', wallet: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2', share: 70 },
      { name: 'Promo', role: 'Маркетинг', wallet: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db', share: 30 },
    ],
  },
  {
    id: 'creator',
    symbol: 'CREATOR',
    name: 'Creator DAO',
    description: 'Токен DAO авторов',
    ownerWallet: '0x2222222222222222222222222222222222222222',
    contract: '0xCREATOR000000000000000000000000000000001',
    wallets: 2145,
    delegated: 780_000,
    unbonding: 95_000,
    activeDelegated: 685_000,
    paidDel: 14_100,
    myReward: 7_820,
    participants: [
      { name: 'You', role: 'Консультант', wallet: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2', share: 55 },
      { name: 'Growth', role: 'Маркетинг', wallet: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db', share: 45 },
    ],
  },
]

export const registryTokens: TokenProject[] = [
  {
    id: 'blog',
    symbol: 'BLOG',
    name: 'Creator Project',
    description: 'Токен проекта блогера',
    ownerWallet: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    contract: '0xBLOG000000000000000000000000000000000001',
    wallets: 12_842,
    delegated: 1_284_500,
    unbonding: 342_100,
    activeDelegated: 856_300,
    paidDel: 18_420,
    participants: [
      { name: 'Alex', role: 'Консультант', wallet: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2', share: 60 },
      { name: 'Max', role: 'Маркетинг', wallet: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db', share: 40 },
    ],
  },
  {
    id: 'music',
    symbol: 'MUSIC',
    name: 'Music Club',
    description: 'Токен музыкального сообщества',
    ownerWallet: '0x1111111111111111111111111111111111111111',
    contract: '0xMUSIC00000000000000000000000000000000001',
    wallets: 4_821,
    delegated: 640_000,
    unbonding: 91_000,
    activeDelegated: 549_000,
    paidDel: 8_200,
    participants: [
      { name: 'Alex', role: 'Консультант', wallet: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2', share: 70 },
      { name: 'Promo', role: 'Маркетинг', wallet: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db', share: 30 },
    ],
  },
  {
    id: 'game',
    symbol: 'GAME',
    name: 'Game Project',
    description: 'Токен игрового сообщества',
    ownerWallet: '0x3333333333333333333333333333333333333333',
    contract: '0xGAME000000000000000000000000000000000001',
    wallets: 28_421,
    delegated: 4_100_000,
    unbonding: 510_000,
    activeDelegated: 3_590_000,
    paidDel: 41_000,
    participants: [
      { name: 'Lead', role: 'Консультант', wallet: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2', share: 55 },
      { name: 'UA', role: 'Маркетинг', wallet: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db', share: 45 },
    ],
  },
  {
    id: 'cafe',
    symbol: 'CAFE',
    name: 'Local Cafe',
    description: 'Токен локальной сети кофеен',
    ownerWallet: '0x4444444444444444444444444444444444444444',
    contract: '0xCAFE000000000000000000000000000000000001',
    wallets: 1_920,
    delegated: 210_000,
    unbonding: 28_000,
    activeDelegated: 182_000,
    paidDel: 3_140,
    participants: [
      { name: 'Helper', role: 'Консультант', wallet: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2', share: 100 },
    ],
  },
]

export const adminStats = {
  tokensCreated: 2481,
  tokensActive: 1932,
  walletsTotal: 428_190,
  delegatedVolume: 8_421_300,
  unbondVolume: 1_284_500,
  paidConsultants: 428_920,
  marketingPercent: 10,
}

export const tokensCreatedSeries = [
  { month: 'Янв', value: 120 },
  { month: 'Фев', value: 158 },
  { month: 'Мар', value: 190 },
  { month: 'Апр', value: 210 },
  { month: 'Май', value: 248 },
  { month: 'Июн', value: 290 },
  { month: 'Июл', value: 340 },
  { month: 'Авг', value: 385 },
  { month: 'Сен', value: 420 },
]

export const delegationSeries = [
  { month: 'Янв', value: 4.2 },
  { month: 'Фев', value: 4.6 },
  { month: 'Мар', value: 5.1 },
  { month: 'Апр', value: 5.5 },
  { month: 'Май', value: 6.0 },
  { month: 'Июн', value: 6.6 },
  { month: 'Июл', value: 7.2 },
  { month: 'Авг', value: 7.8 },
  { month: 'Сен', value: 8.4 },
]

export const walletsSeries = [
  { month: 'Янв', value: 210 },
  { month: 'Фев', value: 240 },
  { month: 'Мар', value: 268 },
  { month: 'Апр', value: 295 },
  { month: 'Май', value: 320 },
  { month: 'Июн', value: 348 },
  { month: 'Июл', value: 372 },
  { month: 'Авг', value: 401 },
  { month: 'Сен', value: 428 },
]

export const payoutsSeries = [
  { month: 'Янв', value: 28 },
  { month: 'Фев', value: 34 },
  { month: 'Мар', value: 41 },
  { month: 'Апр', value: 48 },
  { month: 'Май', value: 55 },
  { month: 'Июн', value: 62 },
  { month: 'Июл', value: 71 },
  { month: 'Авг', value: 79 },
  { month: 'Сен', value: 86 },
]

export const rewardHistory = [
  { date: '18.09.2026', from: 8, to: 10, admin: 'Admin' },
  { date: '02.08.2026', from: 5, to: 8, admin: 'Admin' },
  { date: '12.06.2026', from: 3, to: 5, admin: 'Admin' },
]

export const cabinetHistory = [
  { date: '17.09.2026', type: 'Начисление', project: 'BLOG', amount: '+420 DEL' },
  { date: '14.09.2026', type: 'Выплата', project: 'MUSIC', amount: '+180 DEL' },
  { date: '09.09.2026', type: 'Начисление', project: 'CREATOR', amount: '+310 DEL' },
  { date: '01.09.2026', type: 'Вложение в сеть', project: 'BLOG', amount: '+12.4K BLOG' },
]

export function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 2).replace(/\.?0+$/, '')}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1).replace(/\.0$/, '')}K`
  return n.toLocaleString('ru-RU')
}

export function formatNumber(n: number): string {
  return n.toLocaleString('ru-RU')
}

export function getTokenBySymbol(symbol: string): TokenProject | undefined {
  const upper = symbol.toUpperCase()
  return (
    registryTokens.find((t) => t.symbol === upper) ||
    myProjects.find((t) => t.symbol === upper)
  )
}
