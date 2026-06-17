/**
 * Approximate population trajectories for six well-documented great whales,
 * for the history-page scrubber. These are illustrative reconstructions drawn
 * from IWC catch records, NOAA stock assessments, and the peer-reviewed
 * literature (e.g. Rocha et al. 2014, Roman & Palumbi 2003, Whitehead 2002).
 *
 * Year-by-year abundance before modern surveys is genuinely uncertain, so treat
 * the curves as the shape of the story (collapse, then partial recovery) rather
 * than exact counts.
 */
export interface PopPoint {
  year: number
  value: number
}

export interface PopSeries {
  /** Links to the species profile. */
  id: string
  name: string
  /** Short caption shown under the chart. */
  note: string
  series: PopPoint[]
}

export const populationHistory: PopSeries[] = [
  {
    id: 'blue-whale',
    name: 'Blue Whale',
    note: 'Industrial whaling cut the largest animal on Earth to a few thousand by the 1970s. Recovery has been real but slow.',
    series: [
      { year: 1900, value: 300000 },
      { year: 1910, value: 280000 },
      { year: 1920, value: 230000 },
      { year: 1930, value: 150000 },
      { year: 1940, value: 90000 },
      { year: 1950, value: 55000 },
      { year: 1960, value: 20000 },
      { year: 1970, value: 8000 },
      { year: 1980, value: 7000 },
      { year: 1990, value: 8500 },
      { year: 2000, value: 11000 },
      { year: 2010, value: 14000 },
      { year: 2020, value: 16500 },
      { year: 2026, value: 18000 },
    ],
  },
  {
    id: 'humpback-whale',
    name: 'Humpback Whale',
    note: 'A conservation success story: protected in 1966, humpbacks have rebounded across most of their range to near pre-whaling numbers.',
    series: [
      { year: 1900, value: 120000 },
      { year: 1910, value: 100000 },
      { year: 1920, value: 78000 },
      { year: 1930, value: 58000 },
      { year: 1940, value: 44000 },
      { year: 1950, value: 33000 },
      { year: 1960, value: 24000 },
      { year: 1970, value: 20000 },
      { year: 1980, value: 31000 },
      { year: 1990, value: 50000 },
      { year: 2000, value: 78000 },
      { year: 2010, value: 105000 },
      { year: 2020, value: 130000 },
      { year: 2026, value: 135000 },
    ],
  },
  {
    id: 'gray-whale',
    name: 'Gray Whale',
    note: 'Eastern North Pacific stock. Hunted nearly to extinction twice, it recovered to a 2016 peak near 27,000, then fell sharply after a 2019 die-off.',
    series: [
      { year: 1850, value: 23000 },
      { year: 1880, value: 8000 },
      { year: 1900, value: 4000 },
      { year: 1920, value: 2000 },
      { year: 1940, value: 3000 },
      { year: 1950, value: 5500 },
      { year: 1970, value: 11000 },
      { year: 1980, value: 16000 },
      { year: 1990, value: 21000 },
      { year: 2000, value: 19000 },
      { year: 2010, value: 20000 },
      { year: 2016, value: 27000 },
      { year: 2020, value: 21000 },
      { year: 2024, value: 14000 },
      { year: 2026, value: 13000 },
    ],
  },
  {
    id: 'fin-whale',
    name: 'Fin Whale',
    note: 'The second-largest animal on Earth was hunted hard once blue whales had collapsed. Numbers have roughly doubled since the 1970s.',
    series: [
      { year: 1900, value: 300000 },
      { year: 1920, value: 280000 },
      { year: 1940, value: 210000 },
      { year: 1950, value: 150000 },
      { year: 1960, value: 100000 },
      { year: 1970, value: 58000 },
      { year: 1980, value: 50000 },
      { year: 1990, value: 56000 },
      { year: 2000, value: 72000 },
      { year: 2010, value: 90000 },
      { year: 2020, value: 100000 },
      { year: 2026, value: 100000 },
    ],
  },
  {
    id: 'sperm-whale',
    name: 'Sperm Whale',
    note: 'Hunted across two eras, the open-boat 1800s and the mechanised 1900s. Less catastrophically reduced than the rorquals, and slowly recovering.',
    series: [
      { year: 1800, value: 1500000 },
      { year: 1850, value: 1250000 },
      { year: 1880, value: 1120000 },
      { year: 1900, value: 1080000 },
      { year: 1950, value: 950000 },
      { year: 1960, value: 850000 },
      { year: 1970, value: 780000 },
      { year: 1980, value: 740000 },
      { year: 2000, value: 770000 },
      { year: 2020, value: 840000 },
      { year: 2026, value: 850000 },
    ],
  },
  {
    id: 'north-atlantic-right-whale',
    name: 'North Atlantic Right Whale',
    note: 'Hunted since the Basque era, reduced to perhaps a hundred animals by 1900. A fragile recovery has stalled, and the species is again declining.',
    series: [
      { year: 1500, value: 12000 },
      { year: 1700, value: 6000 },
      { year: 1800, value: 2000 },
      { year: 1900, value: 100 },
      { year: 1935, value: 110 },
      { year: 1970, value: 250 },
      { year: 1990, value: 270 },
      { year: 2000, value: 350 },
      { year: 2010, value: 480 },
      { year: 2015, value: 470 },
      { year: 2020, value: 360 },
      { year: 2024, value: 384 },
      { year: 2026, value: 384 },
    ],
  },
]
