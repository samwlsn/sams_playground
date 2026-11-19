export type OddsCell = {
  label: string
  odds: string
}

export type MarketGroup = {
  title: string
  cells: OddsCell[]
}

export type EventRow = {
  id: string
  time: string
  home: { name: string; abbr: string; crest: string }
  away: { name: string; abbr: string; crest: string }
  markets: MarketGroup[]
}

export type LeagueSection = {
  id: string
  name: string
  logo: string
  events: EventRow[]
  moreCount: number
}

export const SPORT_TABS = [
  { id: 'my-bets', label: 'My Bets', icon: '/propshopx/nav/ticket.svg' },
  { id: 'soccer', label: 'Soccer', icon: '/propshopx/nav/image.svg' },
  { id: 'football', label: 'Football', icon: '/propshopx/nav/football.svg' },
  { id: 'basketball', label: 'Basketball', icon: '/propshopx/nav/football.svg' },
  { id: 'tennis', label: 'Tennis', icon: '/propshopx/nav/football.svg' },
] as const

export const QUICK_LINKS = [
  { id: 'all', label: 'All Soccer', icon: '/propshopx/leagues/soccer-ball.svg' },
  { id: 'epl', label: 'Premier League', icon: '/propshopx/leagues/premier.svg' },
  { id: 'laliga', label: 'La Liga', icon: '/propshopx/leagues/laliga.svg' },
  { id: 'seriea', label: 'Serie A', icon: '/propshopx/leagues/seriea.svg' },
  { id: 'bundesliga', label: 'Bundesliga', icon: '/propshopx/leagues/bundesliga.svg' },
  { id: 'ligue1', label: 'Ligue 1', icon: '/propshopx/leagues/ligue1.svg' },
  { id: 'championship', label: 'Champion-ship', icon: '/propshopx/leagues/championship.svg' },
  { id: 'primeira', label: 'Primeira Liga', icon: '/propshopx/leagues/star.svg' },
  { id: 'belgian', label: 'First Division A', icon: '/propshopx/leagues/star.svg' },
  { id: 'superlig', label: 'Super Lig', icon: '/propshopx/leagues/star.svg' },
  { id: 'scottish', label: 'Scottish Premiership', icon: '/propshopx/leagues/star.svg' },
] as const

export const SIDEBAR_PRIMARY = [
  { id: 'home', icon: '/propshopx/sidebar/home.svg', active: true },
  { id: 'betslip', icon: '/propshopx/sidebar/betslip.svg' },
  { id: 'live', icon: '/propshopx/sidebar/live.svg' },
  { id: 'trophy', icon: '/propshopx/sidebar/trophy.svg' },
  { id: 'rocket', icon: '/propshopx/sidebar/rocket.svg' },
  { id: 'sgp', icon: '/propshopx/sidebar/sgp.svg' },
  { id: 'mp', icon: '/propshopx/sidebar/mp.svg' },
] as const

export const SIDEBAR_SPORTS_TOP = [
  '/propshopx/sidebar/baseball.svg',
  '/propshopx/sidebar/basketball.svg',
  '/propshopx/sidebar/football.svg',
  '/propshopx/sidebar/soccer.svg',
] as const

export const SIDEBAR_SPORTS_ALL = [
  '/propshopx/sidebar/baseball.svg',
  '/propshopx/sidebar/basketball.svg',
  '/propshopx/sidebar/football.svg',
  '/propshopx/sidebar/boxing.svg',
  '/propshopx/sidebar/golf.svg',
  '/propshopx/sidebar/hockey.svg',
  '/propshopx/sidebar/horse.svg',
  '/propshopx/sidebar/lacrosse.svg',
  '/propshopx/sidebar/pool.svg',
  '/propshopx/sidebar/rugby.svg',
  '/propshopx/sidebar/table-tennis.svg',
  '/propshopx/sidebar/tennis.svg',
  '/propshopx/sidebar/volleyball.svg',
] as const

const mkMarkets = (
  home: string,
  away: string,
  ml: [string, string, string],
  spread: [string, string, string, string],
  total: [string, string, string, string],
  h1: [string, string, string],
  h1s: [string, string, string, string],
): MarketGroup[] => [
  {
    title: '3-Way Regulation Time',
    cells: [
      { label: home, odds: ml[0] },
      { label: 'TIE', odds: ml[1] },
      { label: away, odds: ml[2] },
    ],
  },
  {
    title: 'Spread',
    cells: [
      { label: spread[0], odds: spread[1] },
      { label: spread[2], odds: spread[3] },
    ],
  },
  {
    title: 'Total',
    cells: [
      { label: total[0], odds: total[1] },
      { label: total[2], odds: total[3] },
    ],
  },
  {
    title: '1H Moneyline',
    cells: [
      { label: home, odds: h1[0] },
      { label: 'TIE', odds: h1[1] },
      { label: away, odds: h1[2] },
    ],
  },
  {
    title: '1H Spread',
    cells: [
      { label: h1s[0], odds: h1s[1] },
      { label: h1s[2], odds: h1s[3] },
    ],
  },
]

export const LEAGUE_SECTIONS: LeagueSection[] = [
  {
    id: 'epl',
    name: 'Premier League',
    logo: '/propshopx/leagues/premier.svg',
    moreCount: 3,
    events: [
      {
        id: 'e1',
        time: '12:30pm',
        home: { name: 'Coventry City', abbr: 'COV', crest: '#77B6DE' },
        away: { name: 'Brighton & Hove Albion', abbr: 'BRI', crest: '#0057A6' },
        markets: mkMarkets(
          'COV',
          'BRI',
          ['+209', '+290', '+120'],
          ['-1.5', '-136', '+1.5', '+120'],
          ['O 3', '-128', 'U 3', '+112'],
          ['+185', '+140', '+210'],
          ['-0.5', '-110', '+0.5', '-110'],
        ),
      },
      {
        id: 'e2',
        time: '3:00pm',
        home: { name: 'West Ham United', abbr: 'WHU', crest: '#7A263A' },
        away: { name: 'Aston Villa', abbr: 'AVL', crest: '#670E36' },
        markets: mkMarkets(
          'WHU',
          'AVL',
          ['+145', '+245', '+185'],
          ['-0.5', '-105', '+0.5', '-115'],
          ['O 2.5', '-118', 'U 2.5', '-102'],
          ['+160', '+130', '+200'],
          ['-0.5', '+100', '+0.5', '-120'],
        ),
      },
      {
        id: 'e3',
        time: '3:00pm',
        home: { name: 'Crystal Palace', abbr: 'CRY', crest: '#1B458F' },
        away: { name: 'Burnley', abbr: 'BUR', crest: '#6C1D45' },
        markets: mkMarkets(
          'CRY',
          'BUR',
          ['-125', '+280', '+340'],
          ['-1', '-110', '+1', '-110'],
          ['O 2.5', '-105', 'U 2.5', '-115'],
          ['-105', '+145', '+320'],
          ['-0.5', '-115', '+0.5', '-105'],
        ),
      },
      {
        id: 'e4',
        time: '3:00pm',
        home: { name: 'Sunderland', abbr: 'SUN', crest: '#EB172B' },
        away: { name: 'Everton', abbr: 'EVE', crest: '#003399' },
        markets: mkMarkets(
          'SUN',
          'EVE',
          ['+175', '+230', '+165'],
          ['+0.5', '-120', '-0.5', '+100'],
          ['O 2.5', '-110', 'U 2.5', '-110'],
          ['+190', '+125', '+180'],
          ['+0.5', '-115', '-0.5', '-105'],
        ),
      },
      {
        id: 'e5',
        time: '5:30pm',
        home: { name: 'Manchester City', abbr: 'MCI', crest: '#6CABDD' },
        away: { name: 'Liverpool', abbr: 'LIV', crest: '#C8102E' },
        markets: mkMarkets(
          'MCI',
          'LIV',
          ['+130', '+260', '+200'],
          ['-0.5', '-108', '+0.5', '-112'],
          ['O 3', '-115', 'U 3', '-105'],
          ['+145', '+150', '+220'],
          ['-0.5', '-105', '+0.5', '-115'],
        ),
      },
    ],
  },
  {
    id: 'laliga',
    name: 'La Liga',
    logo: '/propshopx/leagues/laliga.svg',
    moreCount: 5,
    events: [
      {
        id: 'l1',
        time: '1:00pm',
        home: { name: 'Real Madrid', abbr: 'RMA', crest: '#FEBE10' },
        away: { name: 'Barcelona', abbr: 'BAR', crest: '#A50044' },
        markets: mkMarkets(
          'RMA',
          'BAR',
          ['+115', '+270', '+220'],
          ['-0.5', '-110', '+0.5', '-110'],
          ['O 3', '-120', 'U 3', '+100'],
          ['+130', '+155', '+240'],
          ['-0.5', '-105', '+0.5', '-115'],
        ),
      },
      {
        id: 'l2',
        time: '3:15pm',
        home: { name: 'Atletico Madrid', abbr: 'ATM', crest: '#CB3524' },
        away: { name: 'Sevilla', abbr: 'SEV', crest: '#F43333' },
        markets: mkMarkets(
          'ATM',
          'SEV',
          ['-140', '+280', '+380'],
          ['-1', '-105', '+1', '-115'],
          ['O 2.5', '-108', 'U 2.5', '-112'],
          ['-115', '+150', '+350'],
          ['-0.5', '-120', '+0.5', '+100'],
        ),
      },
      {
        id: 'l3',
        time: '5:30pm',
        home: { name: 'Valencia', abbr: 'VAL', crest: '#EE3524' },
        away: { name: 'Villarreal', abbr: 'VIL', crest: '#FFE014' },
        markets: mkMarkets(
          'VAL',
          'VIL',
          ['+155', '+230', '+180'],
          ['+0.5', '-125', '-0.5', '+105'],
          ['O 2.5', '-102', 'U 2.5', '-118'],
          ['+170', '+130', '+195'],
          ['+0.5', '-110', '-0.5', '-110'],
        ),
      },
      {
        id: 'l4',
        time: '8:00pm',
        home: { name: 'Athletic Bilbao', abbr: 'ATH', crest: '#EE2523' },
        away: { name: 'Real Sociedad', abbr: 'RSO', crest: '#0067B1' },
        markets: mkMarkets(
          'ATH',
          'RSO',
          ['+125', '+240', '+210'],
          ['-0.5', '-102', '+0.5', '-118'],
          ['O 2.5', '-115', 'U 2.5', '-105'],
          ['+140', '+135', '+230'],
          ['-0.5', '+100', '+0.5', '-120'],
        ),
      },
      {
        id: 'l5',
        time: '8:00pm',
        home: { name: 'Girona', abbr: 'GIR', crest: '#CD2534' },
        away: { name: 'Osasuna', abbr: 'OSA', crest: '#0A3161' },
        markets: mkMarkets(
          'GIR',
          'OSA',
          ['-110', '+260', '+310'],
          ['-0.5', '-115', '+0.5', '-105'],
          ['O 2.5', '-110', 'U 2.5', '-110'],
          ['+105', '+140', '+300'],
          ['-0.5', '-108', '+0.5', '-112'],
        ),
      },
    ],
  },
]
