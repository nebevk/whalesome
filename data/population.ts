import type { WhalePopulation, WhaleStat } from '~/types/species'
import { species } from '~/data/species'

/** The year the figures below were gathered and checked. */
export const FIGURES_YEAR = 2026

/**
 * North Atlantic right whales: 384 (+10/-9) in 2024, from the North Atlantic Right
 * Whale Consortium's 2025 report card. Kept in one place so the headline tile, every
 * chart, and the scrubber show the same number.
 */
const RIGHT_WHALES = { low: 375, best: 384, high: 394 }

/**
 * Vaquita: 7 to 10 different animals seen in the September 2025 survey (IUCN-SSC
 * Cetacean Specialist Group and CONANP), a minimum count rather than a census. Text
 * always shows the range; `best` only places the vaquita on the charts, so the
 * 8.5 midpoint does not round up to 9.
 */
const VAQUITA = { low: 7, best: 8, high: 10 }

/** A raw entry, plus the single figure the source states when it gives one. */
type PopulationInput = WhalePopulation & {
  /**
   * The headline figure the source itself quotes (the consortium's 384 right whales,
   * say). Leave it out when the source only gives a range: the midpoint stands in.
   */
  estimate?: number
}

/** A population row as the charts, the headline tiles, and the scrubber read it. */
export interface PopulationEntry extends WhalePopulation {
  /** The species profile's `name` when one exists, so charts and profiles agree. */
  name: string
  /** Whether /species/[id] exists for this entry. */
  hasProfile: boolean
  /**
   * The one "how many today" figure shown everywhere: the stated estimate, or the
   * midpoint of the range without false precision. 0 when no count exists.
   */
  estimate: number
}

/**
 * Global population figures for 22 whale, dolphin, and porpoise species.
 *
 * Sourced from the IUCN Red List, NOAA Fisheries, the International Whaling
 * Commission, and the peer-reviewed literature. Estimates for wide-ranging
 * species are necessarily approximate: most are sums of regional surveys, and
 * a single global census rarely exists. Figures gathered 2026.
 *
 * `currentLow`/`currentHigh` of 0 means no reliable numeric estimate exists.
 * `prewhalingApprox` is only filled where a clean pre-exploitation figure is
 * documented, so it can drive the depletion-and-recovery comparison.
 */
const entries: PopulationInput[] = [
  // ----- Baleen -----
  {
    id: 'blue-whale',
    commonName: 'Blue Whale',
    scientificName: 'Balaenoptera musculus',
    group: 'baleen',
    currentLow: 10000,
    currentHigh: 25000,
    currentText: 'About 10,000 to 25,000 total (roughly 5,000 to 15,000 mature)',
    prewhalingApprox: 350000,
    prewhalingText: 'Perhaps 350,000 before 20th-century whaling. The Antarctic population alone fell from about 239,000 to around 360 by the early 1970s.',
    iucnStatus: 'Endangered',
    iucnCode: 'EN',
    trend: 'increasing',
    note: 'The Antarctic subspecies remains Critically Endangered: a 1998 circumpolar estimate put it at under 1 percent of its original abundance.',
    source: 'https://www.iucnredlist.org/species/2477/156923585',
  },
  {
    id: 'fin-whale',
    commonName: 'Fin Whale',
    scientificName: 'Balaenoptera physalus',
    group: 'baleen',
    currentLow: 100000,
    currentHigh: 100000,
    currentText: 'About 100,000 mature individuals worldwide',
    iucnStatus: 'Vulnerable',
    iucnCode: 'VU',
    trend: 'increasing',
    note: 'Down-listed from Endangered to Vulnerable in 2018 after the mature population roughly doubled since the 1970s. Around 725,000 were killed in the Southern Hemisphere alone last century.',
    source: 'https://www.iucnredlist.org/species/2478/156923865',
  },
  {
    id: 'sei-whale',
    commonName: 'Sei Whale',
    scientificName: 'Balaenoptera borealis',
    group: 'baleen',
    currentLow: 50000,
    currentHigh: 50000,
    currentText: 'About 50,000 mature individuals (a rough 2018 IUCN figure; no rigorous global survey exists)',
    iucnStatus: 'Endangered',
    iucnCode: 'EN',
    trend: 'increasing',
    note: 'Commercial whaling killed an estimated 300,000 sei whales. A crude estimate suggests numbers fell from about 250,000 to around 32,000 by the 1970s, and the species is now recovering.',
    source: 'https://www.fisheries.noaa.gov/species/sei-whale',
  },
  {
    id: 'brydes-whale',
    commonName: "Bryde's Whale",
    scientificName: 'Balaenoptera edeni',
    group: 'baleen',
    currentLow: 0,
    currentHigh: 0,
    currentText: 'No reliable global estimate; only regional populations have been counted',
    iucnStatus: 'Least Concern',
    iucnCode: 'LC',
    trend: 'unknown',
    note: 'Hunted less heavily than the other large rorquals. The Gulf of Mexico population was named a separate species, Rice’s whale, in 2021; only about 50 remain, and it is Critically Endangered.',
    source: 'https://www.fisheries.noaa.gov/species/brydes-whale',
  },
  {
    id: 'humpback-whale',
    commonName: 'Humpback Whale',
    scientificName: 'Megaptera novaeangliae',
    group: 'baleen',
    currentLow: 84000,
    currentHigh: 135000,
    estimate: 135000,
    currentText: 'About 135,000 total (roughly 84,000 mature)',
    iucnStatus: 'Least Concern',
    iucnCode: 'LC',
    trend: 'increasing',
    note: 'A conservation success story: globally recovering, though some regional populations remain Endangered under US law. Some populations had been cut by 95 percent or more.',
    source: 'https://www.iucnredlist.org/species/13006/50362794',
  },
  {
    id: 'gray-whale',
    commonName: 'Gray Whale',
    scientificName: 'Eschrichtius robustus',
    group: 'baleen',
    currentLow: 15930,
    currentHigh: 20530,
    estimate: 17750,
    currentText: 'About 17,750 in the eastern North Pacific (2025/26 count); the western stock is under 300',
    prewhalingApprox: 20000,
    prewhalingText: 'Roughly 15,000 to 24,000 in the eastern North Pacific; the stock peaked near 27,000 in 2016',
    iucnStatus: 'Least Concern',
    iucnCode: 'LC',
    trend: 'decreasing',
    note: 'Delisted in 1994 after a strong recovery, the eastern stock peaked near 27,000 in 2016, then fell to about 12,900 by 2024/25 after a die-off. The 2025/26 count rebounded to about 17,750, still well below the peak. The North Atlantic population was hunted to extinction.',
    source: 'https://www.fisheries.noaa.gov/west-coast/science-data/gray-whale-population-abundance',
  },
  {
    id: 'minke-whale',
    commonName: 'Common Minke Whale',
    scientificName: 'Balaenoptera acutorostrata',
    group: 'baleen',
    currentLow: 200000,
    currentHigh: 500000,
    currentText: 'Over 200,000 in the North Atlantic alone; several hundred thousand worldwide',
    iucnStatus: 'Least Concern',
    iucnCode: 'LC',
    trend: 'stable',
    note: 'The smallest and least depleted rorqual. Still hunted commercially by Norway and Japan. The Antarctic minke is a separate species.',
    source: 'https://www.fisheries.noaa.gov/species/minke-whale',
  },
  {
    id: 'bowhead-whale',
    commonName: 'Bowhead Whale',
    scientificName: 'Balaena mysticetus',
    group: 'baleen',
    currentLow: 20000,
    currentHigh: 25000,
    currentText: 'Roughly 20,000 to 25,000, mostly in the Bering-Chukchi-Beaufort (about 15,000) and East Canada-West Greenland (about 7,000) stocks',
    prewhalingApprox: 50000,
    prewhalingText: 'At least 50,000 before commercial whaling, reduced to under 3,000 by about 1921',
    iucnStatus: 'Least Concern',
    iucnCode: 'LC',
    trend: 'increasing',
    note: 'The Bering-Chukchi-Beaufort stock has recovered strongly, but the small East Greenland-Svalbard-Barents Sea and Okhotsk Sea subpopulations remain Endangered.',
    source: 'https://www.fisheries.noaa.gov/species/bowhead-whale',
  },
  {
    id: 'north-atlantic-right-whale',
    commonName: 'North Atlantic Right Whale',
    scientificName: 'Eubalaena glacialis',
    group: 'baleen',
    currentLow: RIGHT_WHALES.low,
    currentHigh: RIGHT_WHALES.high,
    estimate: RIGHT_WHALES.best,
    currentText: `About ${RIGHT_WHALES.best} in 2024, including only some 70 reproductively active females`,
    prewhalingApprox: 15000,
    prewhalingText: 'On the order of 9,000 to 21,000 in the North Atlantic before centuries of whaling',
    iucnStatus: 'Critically Endangered',
    iucnCode: 'CR',
    trend: 'increasing',
    note: 'One of the most endangered large whales, creeping up slowly from a low of about 358 in 2020. Entanglement in fishing gear and ship strikes are the leading causes of death.',
    source: 'https://www.fisheries.noaa.gov/species/north-atlantic-right-whale',
  },
  {
    id: 'southern-right-whale',
    commonName: 'Southern Right Whale',
    scientificName: 'Eubalaena australis',
    group: 'baleen',
    currentLow: 12000,
    currentHigh: 15000,
    estimate: 13600,
    currentText: 'About 13,600 in 2009, the latest global estimate; growth has since slowed or stalled in several populations',
    prewhalingApprox: 70000,
    prewhalingText: 'Roughly 70,000 to 100,000 before whaling, cut to perhaps a few hundred worldwide by the 1920s',
    iucnStatus: 'Least Concern',
    iucnCode: 'LC',
    trend: 'increasing',
    note: 'Most breeding populations grew 7 to 8 percent a year after protection, but growth has slowed or stalled since the mid 2010s in Argentina, South Africa, and Australia.',
    source: 'https://www.iucnredlist.org/species/8153/50354147',
  },
  {
    id: 'pygmy-right-whale',
    commonName: 'Pygmy Right Whale',
    scientificName: 'Caperea marginata',
    group: 'baleen',
    currentLow: 0,
    currentHigh: 0,
    currentText: 'No global estimate; almost never seen at sea',
    iucnStatus: 'Least Concern',
    iucnCode: 'LC',
    trend: 'unknown',
    note: 'The smallest baleen whale and the sole survivor of its family. Most of what is known comes from strandings.',
    source: 'https://www.iucnredlist.org/species/3778/50351626',
  },
  // ----- Toothed -----
  {
    id: 'sperm-whale',
    commonName: 'Sperm Whale',
    scientificName: 'Physeter macrocephalus',
    group: 'toothed',
    currentLow: 482000,
    currentHigh: 1153000,
    estimate: 845000,
    currentText: 'About 845,000 in 2022 (95% interval roughly 482,000 to 1.15 million)',
    prewhalingApprox: 1950000,
    prewhalingText: 'About 1.95 million in the early 1700s, before whaling began',
    iucnStatus: 'Vulnerable',
    iucnCode: 'VU',
    trend: 'unknown',
    note: 'The largest toothed predator. Recovery since whaling has been slow: adult males show the clearest gains, while populations in heavily used waters may still be declining.',
    source: 'https://www.nature.com/articles/s41598-022-24107-7',
  },
  {
    id: 'pygmy-sperm-whale',
    commonName: 'Pygmy Sperm Whale',
    scientificName: 'Kogia breviceps',
    group: 'toothed',
    currentLow: 0,
    currentHigh: 0,
    currentText: 'No reliable global estimate; known mostly from strandings',
    iucnStatus: 'Least Concern',
    iucnCode: 'LC',
    trend: 'unknown',
    note: 'A cryptic, deep-diving animal rarely seen alive. Listed Least Concern on the basis of its wide range rather than a counted population.',
    source: 'https://www.iucnredlist.org/species/11047/50358334',
  },
  {
    id: 'cuviers-beaked-whale',
    commonName: "Cuvier's Beaked Whale",
    scientificName: 'Ziphius cavirostris',
    group: 'toothed',
    currentLow: 100000,
    currentHigh: 100000,
    currentText: 'At least 100,000, likely more (summed from regional surveys)',
    iucnStatus: 'Least Concern',
    iucnCode: 'LC',
    trend: 'unknown',
    note: 'The most widespread beaked whale and the record holder for the deepest and longest dives of any mammal. Sensitive to naval sonar.',
    source: 'https://www.iucnredlist.org/species/23211/50379111',
  },
  {
    id: 'orca',
    commonName: 'Orca (Killer Whale)',
    scientificName: 'Orcinus orca',
    group: 'toothed',
    currentLow: 50000,
    currentHigh: 50000,
    currentText: 'At least 50,000 worldwide',
    iucnStatus: 'Data Deficient',
    iucnCode: 'DD',
    trend: 'unknown',
    note: 'Listed Data Deficient largely because several ecotypes may be separate species. Some local groups, such as the Southern Residents, are endangered.',
    source: 'https://www.fisheries.noaa.gov/species/killer-whale',
  },
  {
    id: 'long-finned-pilot-whale',
    commonName: 'Long-finned Pilot Whale',
    scientificName: 'Globicephala melas',
    group: 'toothed',
    currentLow: 750000,
    currentHigh: 1200000,
    currentText: 'On the order of one million (summed regional surveys)',
    iucnStatus: 'Least Concern',
    iucnCode: 'LC',
    trend: 'unknown',
    note: 'The second-largest dolphin after the orca. Still taken in drive hunts in the Faroe Islands.',
    source: 'https://www.iucnredlist.org/species/9250/50356171',
  },
  {
    id: 'common-bottlenose-dolphin',
    commonName: 'Common Bottlenose Dolphin',
    scientificName: 'Tursiops truncatus',
    group: 'toothed',
    currentLow: 600000,
    currentHigh: 750000,
    currentText: 'Roughly 600,000 to 750,000 (a loose composite of regional surveys)',
    iucnStatus: 'Least Concern',
    iucnCode: 'LC',
    trend: 'unknown',
    note: 'Globally abundant, but some local populations are threatened: the Black Sea subspecies is Endangered, and the Fiordland (New Zealand) and Gulf of Ambracia (Greece) populations are Critically Endangered.',
    source: 'https://www.iucnredlist.org/species/22563/156932432',
  },
  {
    id: 'beluga-whale',
    commonName: 'Beluga Whale',
    scientificName: 'Delphinapterus leucas',
    group: 'toothed',
    currentLow: 150000,
    currentHigh: 200000,
    currentText: 'Roughly 150,000 to 200,000 (about 136,000 mature)',
    iucnStatus: 'Least Concern',
    iucnCode: 'LC',
    trend: 'unknown',
    note: 'Status varies sharply by region: the Cook Inlet population is separately Critically Endangered.',
    source: 'https://www.iucnredlist.org/species/6335/50352346',
  },
  {
    id: 'narwhal',
    commonName: 'Narwhal',
    scientificName: 'Monodon monoceros',
    group: 'toothed',
    currentLow: 123000,
    currentHigh: 170000,
    currentText: 'About 123,000 mature; near 170,000 across roughly 12 subpopulations',
    iucnStatus: 'Least Concern',
    iucnCode: 'LC',
    trend: 'unknown',
    note: 'Upgraded from Near Threatened to Least Concern in 2017. Vulnerable to hunting pressure and shrinking sea ice.',
    source: 'https://www.iucnredlist.org/species/13704/50367651',
  },
  {
    id: 'harbour-porpoise',
    commonName: 'Harbour Porpoise',
    scientificName: 'Phocoena phocoena',
    group: 'toothed',
    currentLow: 700000,
    currentHigh: 700000,
    currentText: 'Roughly 700,000 worldwide',
    iucnStatus: 'Least Concern',
    iucnCode: 'LC',
    trend: 'unknown',
    note: 'Abundant overall, but the Baltic Proper population is down to a few hundred animals. Gillnet bycatch is the main threat.',
    source: 'https://www.iucnredlist.org/species/17027/247632759',
  },
  {
    id: 'dalls-porpoise',
    commonName: "Dall's Porpoise",
    scientificName: 'Phocoenoides dalli',
    group: 'toothed',
    currentLow: 1000000,
    currentHigh: 1200000,
    currentText: 'Over one million across the North Pacific',
    iucnStatus: 'Least Concern',
    iucnCode: 'LC',
    trend: 'unknown',
    note: 'The largest and one of the fastest porpoises. Bycatch in fishing nets and a hand-harpoon hunt in Japan are the main pressures.',
    source: 'https://www.iucnredlist.org/species/17032/50370912',
  },
  {
    id: 'vaquita',
    commonName: 'Vaquita',
    scientificName: 'Phocoena sinus',
    group: 'toothed',
    currentLow: VAQUITA.low,
    currentHigh: VAQUITA.high,
    estimate: VAQUITA.best,
    currentText: `${VAQUITA.low} to ${VAQUITA.high} seen in the September 2025 survey, including one or two calves (a minimum count, not a full census)`,
    prewhalingApprox: 600,
    prewhalingText: 'About 600 at the first dedicated survey in 1997 (a pre-collapse baseline, not a pre-whaling one)',
    iucnStatus: 'Critically Endangered',
    iucnCode: 'CR',
    trend: 'decreasing',
    note: 'The world’s most endangered marine mammal and the subject of the IWC’s first Extinction Alert. Gillnets are the only known threat, especially illegal nets set for totoaba.',
    source: 'https://www.iucnredlist.org/species/17028/214541137',
  },
]

const profileNames = new Map(species.map(s => [s.id, s.name]))

/** Round a range midpoint so it doesn't claim false precision (13,075 becomes 13,000). */
function roundEstimate(n: number) {
  if (n < 100) return Math.round(n)
  const step = 10 ** (Math.floor(Math.log10(n)) - 1) / 2
  return Math.round(n / step) * step
}

export const populations: PopulationEntry[] = entries.map(({ estimate, ...p }) => ({
  ...p,
  name: profileNames.get(p.id) ?? p.commonName,
  hasProfile: profileNames.has(p.id),
  estimate: estimate ?? (p.currentHigh > 0 ? roundEstimate((p.currentLow + p.currentHigh) / 2) : 0),
}))

/** One population by id (ids match /species/[id] where a profile exists). */
export const populationOf = (id: string) => populations.find(p => p.id === id)

/** Head counts are formatted the same way on every chart and tile ("17,750"). */
export const formatCount = (n: number) => n.toLocaleString('en-US')

/** Species with a clean pre-exploitation figure, for the depletion-and-recovery view. */
export const recoveryPairs = populations
  .filter(p => p.prewhalingApprox && p.estimate > 0)
  .map(p => ({
    ...p,
    prewhalingApprox: p.prewhalingApprox as number,
    pctRemaining: Math.round((p.estimate / (p.prewhalingApprox as number)) * 100),
  }))
  .sort((a, b) => a.pctRemaining - b.pctRemaining)

/**
 * Headline figures, keyed so /history can reuse the same wording. Verified against
 * the cited sources, 2026. The right whale and vaquita figures come from the
 * entries above, so a tile can never disagree with a chart.
 */
export const stats = {
  killed: {
    label: 'Whales killed in the 20th century',
    value: '~2.9 million',
    detail: 'Industrial whaling killed an estimated 2.9 million large whales between 1900 and 1999, perhaps the largest hunt in human history by sheer biomass.',
    source: 'Rocha, Clapham & Ivashchenko 2014, Marine Fisheries Review',
  },
  antarcticBlue: {
    label: 'Antarctic blue whales lost to whaling',
    value: '>99%',
    detail: 'Antarctic blue whales fell from roughly 239,000 before whaling to about 360 by the early 1970s, a loss of more than 99 percent. A circumpolar survey estimate for 1998 still found only about 2,280.',
    source: 'Branch et al. 2004, Marine Mammal Science; Branch 2007, Journal of Cetacean Research and Management',
  },
  rightWhales: {
    label: 'North Atlantic right whales left',
    value: `~${RIGHT_WHALES.best}`,
    detail: `An estimated ${RIGHT_WHALES.best} North Atlantic right whales were alive in 2024, up slowly from a low of about 358 in 2020. Only about 70 reproductively active females remain.`,
    source: 'North Atlantic Right Whale Consortium report card / NOAA Fisheries, 2025',
  },
  vaquita: {
    label: 'Vaquita remaining',
    value: `${VAQUITA.low} to ${VAQUITA.high}`,
    detail: `Surveyors saw ${VAQUITA.low} to ${VAQUITA.high} different vaquitas in the upper Gulf of California in September 2025, including one or two calves. It is a minimum count, and this tiny porpoise is still the most endangered marine mammal on Earth.`,
    source: 'IUCN-SSC Cetacean Specialist Group and CONANP survey report, 2025',
  },
  deepestDive: {
    label: 'Deepest mammal dive',
    value: '2,992 m',
    detail: 'A Cuvier’s beaked whale was recorded diving to 2,992 metres, the deepest dive ever measured for any mammal.',
    source: 'Schorr et al. 2014, PLOS ONE',
  },
  longestDive: {
    label: 'Longest mammal dive',
    value: '3 hr 42 min',
    detail: 'A Cuvier’s beaked whale stayed submerged for 222 minutes on a single breath, the longest dive documented for any mammal.',
    source: 'Quick et al. 2020, Journal of Experimental Biology',
  },
  carbon: {
    label: 'CO₂ locked away per great whale',
    value: '~33 tonnes',
    detail: 'On average a single great whale locks away about 33 tonnes of CO₂ over its life, carrying that carbon to the deep seafloor when it dies.',
    source: 'Chami et al. 2019, IMF Finance & Development',
  },
  speciesCount: {
    label: 'Living cetacean species recognised',
    value: '94',
    detail: 'The Society for Marine Mammalogy recognises 94 species of whale, dolphin, and porpoise, including the baiji, which may already be extinct. The count keeps shifting as genetic studies split populations into new species.',
    source: 'Society for Marine Mammalogy Committee on Taxonomy, 2026',
  },
  loudest: {
    label: 'Loudest sound made by any animal',
    value: '236 dB',
    detail: 'A sperm whale’s echolocation click can reach about 236 decibels underwater, the loudest sound measured from any animal. The blue whale’s far deeper call, at up to about 188 decibels, carries for hundreds of miles. Underwater decibels use a different reference from decibels in air, so neither figure compares directly with sounds we hear.',
    source: 'Møhl et al. 2003, Journal of the Acoustical Society of America; Cummings & Thompson 1971',
  },
} satisfies Record<string, WhaleStat>

/** The four figures that open /populations. */
export const headlineStats: WhaleStat[] = [stats.killed, stats.antarcticBlue, stats.rightWhales, stats.vaquita]

/** Records of the living: the trivia strip near the end of /populations. */
export const recordStats: WhaleStat[] = [stats.deepestDive, stats.longestDive, stats.carbon, stats.speciesCount, stats.loudest]

/** Every headline figure, in page order. */
export const whaleStats: WhaleStat[] = [...headlineStats, ...recordStats]
