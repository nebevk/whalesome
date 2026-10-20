import { FIGURES_YEAR, populationOf } from '~/data/population'

/**
 * Approximate population trajectories for six well-documented great whales,
 * for the decades scrubber. These are illustrative reconstructions drawn from
 * IWC catch records, NOAA stock assessments, and the peer-reviewed literature:
 * Rocha et al. 2014 (20th-century catches by decade), Branch et al. 2004
 * (Antarctic blue whales), Whitehead & Shin 2022 (sperm whales), NOAA SWFSC
 * gray whale counts, and the North Atlantic Right Whale Consortium's 2025
 * report card. The blue, fin, and humpback curves before 1970 are rough
 * back-calculations from Rocha et al.'s decade catch totals, so each decline
 * stays consistent with the number of whales actually killed.
 *
 * Year-by-year abundance before modern surveys is genuinely uncertain, so treat
 * the curves as the shape of the story (collapse, then partial recovery) rather
 * than exact counts. Where data/population.ts has a pre-whaling figure, the
 * first point matches it, and the final point is always that file's current
 * `estimate`, so the scrubber ends on the same number as every other chart.
 */
export interface PopPoint {
  year: number
  value: number
}

export interface PopSeries {
  /** Links to the species profile. */
  id: string
  /** The profile name, resolved through data/population.ts. */
  name: string
  /** Short caption shown under the chart. */
  note: string
  series: PopPoint[]
}

type Trajectory = Omit<PopSeries, 'name'>

/** Historical points only; today's point is appended from data/population.ts. */
const trajectories: Trajectory[] = [
  {
    id: 'blue-whale',
    note: 'Industrial whaling cut the largest animal on Earth to under 10,000 by the 1970s. Recovery has been real but slow.',
    series: [
      { year: 1900, value: 350000 },
      { year: 1910, value: 340000 },
      { year: 1920, value: 290000 },
      { year: 1930, value: 190000 },
      { year: 1940, value: 60000 },
      { year: 1950, value: 40000 },
      { year: 1960, value: 22000 },
      { year: 1970, value: 8000 },
      { year: 1980, value: 7000 },
      { year: 1990, value: 8500 },
      { year: 2000, value: 11000 },
      { year: 2010, value: 14000 },
      { year: 2020, value: 16500 },
    ],
  },
  {
    id: 'humpback-whale',
    note: 'A conservation success story: protected in 1966, humpbacks have rebounded across most of their range, and several populations are back near pre-whaling numbers.',
    series: [
      { year: 1900, value: 120000 },
      { year: 1910, value: 115000 },
      { year: 1920, value: 75000 },
      { year: 1930, value: 72000 },
      { year: 1940, value: 62000 },
      { year: 1950, value: 70000 },
      { year: 1960, value: 40000 },
      { year: 1970, value: 17000 },
      { year: 1980, value: 31000 },
      { year: 1990, value: 50000 },
      { year: 2000, value: 78000 },
      { year: 2010, value: 105000 },
      { year: 2020, value: 130000 },
    ],
  },
  {
    id: 'gray-whale',
    note: 'Eastern North Pacific stock. Hunted nearly to extinction twice, it recovered to a 2016 peak near 27,000, fell to about 12,900 after a die-off, then rebounded in the 2025/26 count.',
    series: [
      { year: 1850, value: 20000 },
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
      { year: 2023, value: 14500 },
      { year: 2025, value: 12900 },
    ],
  },
  {
    id: 'fin-whale',
    note: 'The second-largest animal on Earth was hunted hard once blue whales had collapsed. Numbers have roughly doubled since the 1970s.',
    series: [
      { year: 1900, value: 550000 },
      { year: 1920, value: 530000 },
      { year: 1940, value: 440000 },
      { year: 1950, value: 370000 },
      { year: 1960, value: 170000 },
      { year: 1970, value: 58000 },
      { year: 1980, value: 50000 },
      { year: 1990, value: 56000 },
      { year: 2000, value: 72000 },
      { year: 2010, value: 90000 },
      { year: 2020, value: 100000 },
    ],
  },
  {
    id: 'sperm-whale',
    // Anchored to Whitehead & Shin 2022: about 1.95 million in 1711, about 1.63
    // million in 1940 (their three-generation decline), about 845,000 in 2022.
    note: 'Hunted in two great waves, the open-boat era peaking in the 1840s and mechanised whaling peaking in the 1960s. From about two million before whaling, numbers have recovered only slowly.',
    series: [
      { year: 1710, value: 1950000 },
      { year: 1800, value: 1850000 },
      { year: 1840, value: 1600000 },
      { year: 1870, value: 1500000 },
      { year: 1900, value: 1560000 },
      { year: 1940, value: 1630000 },
      { year: 1950, value: 1550000 },
      { year: 1960, value: 1300000 },
      { year: 1970, value: 1000000 },
      { year: 1980, value: 820000 },
      { year: 1990, value: 780000 },
      { year: 2000, value: 790000 },
      { year: 2010, value: 815000 },
      { year: 2022, value: 845000 },
    ],
  },
  {
    id: 'north-atlantic-right-whale',
    note: 'Hunted since the Basque era, reduced to perhaps a hundred animals by 1900. Numbers peaked near 480 around 2010, fell to about 358 by 2020, and have crept up slowly since.',
    series: [
      { year: 1500, value: 15000 },
      { year: 1700, value: 6000 },
      { year: 1800, value: 2000 },
      { year: 1900, value: 100 },
      { year: 1935, value: 110 },
      { year: 1970, value: 250 },
      { year: 1990, value: 290 },
      { year: 2000, value: 320 },
      { year: 2010, value: 476 },
      { year: 2011, value: 483 },
      { year: 2015, value: 473 },
      { year: 2020, value: 358 },
      { year: 2024, value: 384 },
    ],
  },
]

export const populationHistory: PopSeries[] = trajectories.map(({ id, note, series }) => {
  const today = populationOf(id)
  return {
    id,
    name: today?.name ?? id,
    note,
    series: today?.estimate
      ? [...series, { year: FIGURES_YEAR, value: today.estimate }]
      : series,
  }
})
