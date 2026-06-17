import type { IucnCode } from '~/types/species'

/**
 * The cetacean tree of life, from the order Cetacea down to ~87 living species.
 * Species that have a full profile carry an `id` linking to /species/[id], and
 * every species carries an indicative IUCN Red List status for colour-coding.
 *
 * Taxonomy follows the broad consensus (Committee on Taxonomy, Society for
 * Marine Mammalogy); statuses are indicative (many beaked whales are formally
 * Data Deficient). This is a teaching tree, not a formal authority.
 */
export interface CladeNode {
  name: string
  scientificName?: string
  /** Links to a species profile when one exists. */
  id?: string
  status?: IucnCode
  rank?: 'order' | 'suborder' | 'family' | 'species'
  children?: CladeNode[]
}

const sp = (name: string, scientificName: string, status: IucnCode = 'LC', id?: string): CladeNode => ({
  name,
  scientificName,
  status,
  id,
  rank: 'species',
})

const family = (name: string, scientificName: string, children: CladeNode[]): CladeNode => ({
  name,
  scientificName,
  rank: 'family',
  children,
})

export const cladogram: CladeNode = {
  name: 'Cetacea',
  scientificName: 'whales, dolphins & porpoises',
  rank: 'order',
  children: [
    {
      name: 'Baleen whales',
      scientificName: 'Mysticeti',
      rank: 'suborder',
      children: [
        family('Right & bowhead whales', 'Balaenidae', [
          sp('Bowhead Whale', 'Balaena mysticetus', 'LC', 'bowhead-whale'),
          sp('North Atlantic Right Whale', 'Eubalaena glacialis', 'CR', 'north-atlantic-right-whale'),
          sp('North Pacific Right Whale', 'Eubalaena japonica', 'EN'),
          sp('Southern Right Whale', 'Eubalaena australis', 'LC', 'southern-right-whale'),
        ]),
        family('Rorquals', 'Balaenopteridae', [
          sp('Blue Whale', 'Balaenoptera musculus', 'EN', 'blue-whale'),
          sp('Fin Whale', 'Balaenoptera physalus', 'VU', 'fin-whale'),
          sp('Sei Whale', 'Balaenoptera borealis', 'EN', 'sei-whale'),
          sp("Bryde's Whale", 'Balaenoptera brydei', 'LC', 'brydes-whale'),
          sp("Rice's Whale", 'Balaenoptera ricei', 'CR'),
          sp("Omura's Whale", 'Balaenoptera omurai', 'DD'),
          sp('Common Minke Whale', 'Balaenoptera acutorostrata', 'LC', 'minke-whale'),
          sp('Antarctic Minke Whale', 'Balaenoptera bonaerensis', 'NT'),
          sp('Humpback Whale', 'Megaptera novaeangliae', 'LC', 'humpback-whale'),
        ]),
        family('Gray whale', 'Eschrichtiidae', [
          sp('Gray Whale', 'Eschrichtius robustus', 'LC', 'gray-whale'),
        ]),
        family('Pygmy right whale', 'Neobalaenidae', [
          sp('Pygmy Right Whale', 'Caperea marginata', 'LC', 'pygmy-right-whale'),
        ]),
      ],
    },
    {
      name: 'Toothed whales',
      scientificName: 'Odontoceti',
      rank: 'suborder',
      children: [
        family('Sperm whale', 'Physeteridae', [
          sp('Sperm Whale', 'Physeter macrocephalus', 'VU', 'sperm-whale'),
        ]),
        family('Pygmy & dwarf sperm whales', 'Kogiidae', [
          sp('Pygmy Sperm Whale', 'Kogia breviceps', 'LC', 'pygmy-sperm-whale'),
          sp('Dwarf Sperm Whale', 'Kogia sima', 'LC'),
        ]),
        family('Beluga & narwhal', 'Monodontidae', [
          sp('Beluga', 'Delphinapterus leucas', 'LC', 'beluga-whale'),
          sp('Narwhal', 'Monodon monoceros', 'LC', 'narwhal'),
        ]),
        family('Beaked whales', 'Ziphiidae', [
          sp("Cuvier's Beaked Whale", 'Ziphius cavirostris', 'LC', 'cuviers-beaked-whale'),
          sp("Baird's Beaked Whale", 'Berardius bairdii', 'LC'),
          sp("Arnoux's Beaked Whale", 'Berardius arnuxii', 'LC'),
          sp('Northern Bottlenose Whale', 'Hyperoodon ampullatus', 'NT'),
          sp('Southern Bottlenose Whale', 'Hyperoodon planifrons', 'LC'),
          sp("Longman's Beaked Whale", 'Indopacetus pacificus', 'LC'),
          sp("Shepherd's Beaked Whale", 'Tasmacetus shepherdi', 'DD'),
          sp("Blainville's Beaked Whale", 'Mesoplodon densirostris', 'LC'),
          sp("Sowerby's Beaked Whale", 'Mesoplodon bidens', 'LC'),
          sp("Gervais' Beaked Whale", 'Mesoplodon europaeus', 'LC'),
          sp("True's Beaked Whale", 'Mesoplodon mirus', 'LC'),
          sp("Gray's Beaked Whale", 'Mesoplodon grayi', 'LC'),
          sp('Strap-toothed Whale', 'Mesoplodon layardii', 'LC'),
          sp("Stejneger's Beaked Whale", 'Mesoplodon stejnegeri', 'DD'),
          sp("Andrews' Beaked Whale", 'Mesoplodon bowdoini', 'DD'),
          sp("Hubbs' Beaked Whale", 'Mesoplodon carlhubbsi', 'DD'),
          sp('Ginkgo-toothed Beaked Whale', 'Mesoplodon ginkgodens', 'DD'),
          sp('Spade-toothed Whale', 'Mesoplodon traversii', 'DD'),
          sp("Perrin's Beaked Whale", 'Mesoplodon perrini', 'DD'),
          sp('Pygmy Beaked Whale', 'Mesoplodon peruvianus', 'LC'),
        ]),
        family('Oceanic dolphins', 'Delphinidae', [
          sp('Orca', 'Orcinus orca', 'DD', 'orca'),
          sp('Long-finned Pilot Whale', 'Globicephala melas', 'LC', 'long-finned-pilot-whale'),
          sp('Short-finned Pilot Whale', 'Globicephala macrorhynchus', 'LC'),
          sp('False Killer Whale', 'Pseudorca crassidens', 'NT'),
          sp('Pygmy Killer Whale', 'Feresa attenuata', 'LC'),
          sp('Melon-headed Whale', 'Peponocephala electra', 'LC'),
          sp("Risso's Dolphin", 'Grampus griseus', 'LC'),
          sp('Common Bottlenose Dolphin', 'Tursiops truncatus', 'LC', 'common-bottlenose-dolphin'),
          sp('Indo-Pacific Bottlenose Dolphin', 'Tursiops aduncus', 'NT'),
          sp('Short-beaked Common Dolphin', 'Delphinus delphis', 'LC'),
          sp('Striped Dolphin', 'Stenella coeruleoalba', 'LC'),
          sp('Spinner Dolphin', 'Stenella longirostris', 'LC'),
          sp('Pantropical Spotted Dolphin', 'Stenella attenuata', 'LC'),
          sp('Atlantic Spotted Dolphin', 'Stenella frontalis', 'LC'),
          sp('Rough-toothed Dolphin', 'Steno bredanensis', 'LC'),
          sp("Fraser's Dolphin", 'Lagenodelphis hosei', 'LC'),
          sp('White-beaked Dolphin', 'Lagenorhynchus albirostris', 'LC'),
          sp('Atlantic White-sided Dolphin', 'Lagenorhynchus acutus', 'LC'),
          sp('Pacific White-sided Dolphin', 'Lagenorhynchus obliquidens', 'LC'),
          sp('Dusky Dolphin', 'Lagenorhynchus obscurus', 'LC'),
          sp('Hourglass Dolphin', 'Lagenorhynchus cruciger', 'LC'),
          sp("Commerson's Dolphin", 'Cephalorhynchus commersonii', 'LC'),
          sp("Hector's Dolphin", 'Cephalorhynchus hectori', 'EN'),
          sp('Irrawaddy Dolphin', 'Orcaella brevirostris', 'EN'),
          sp('Australian Snubfin Dolphin', 'Orcaella heinsohni', 'VU'),
          sp('Tucuxi', 'Sotalia fluviatilis', 'EN'),
          sp('Guiana Dolphin', 'Sotalia guianensis', 'NT'),
          sp('Indo-Pacific Humpback Dolphin', 'Sousa chinensis', 'VU'),
          sp('Atlantic Humpback Dolphin', 'Sousa teuszii', 'CR'),
        ]),
        family('Porpoises', 'Phocoenidae', [
          sp('Harbour Porpoise', 'Phocoena phocoena', 'LC', 'harbour-porpoise'),
          sp('Vaquita', 'Phocoena sinus', 'CR', 'vaquita'),
          sp("Burmeister's Porpoise", 'Phocoena spinipinnis', 'NT'),
          sp('Spectacled Porpoise', 'Phocoena dioptrica', 'LC'),
          sp("Dall's Porpoise", 'Phocoenoides dalli', 'LC', 'dalls-porpoise'),
          sp('Narrow-ridged Finless Porpoise', 'Neophocaena asiaeorientalis', 'EN'),
          sp('Indo-Pacific Finless Porpoise', 'Neophocaena phocaenoides', 'VU'),
        ]),
        family('South Asian river dolphin', 'Platanistidae', [
          sp('Ganges & Indus River Dolphin', 'Platanista gangetica', 'EN'),
        ]),
        family('Amazon river dolphins', 'Iniidae', [
          sp('Amazon River Dolphin (Boto)', 'Inia geoffrensis', 'EN'),
        ]),
        family('La Plata dolphin', 'Pontoporiidae', [
          sp('Franciscana', 'Pontoporia blainvillei', 'VU'),
        ]),
        family('Baiji', 'Lipotidae', [
          sp('Baiji', 'Lipotes vexillifer', 'CR'),
        ]),
      ],
    },
  ],
}

/** Total number of species leaves, for display. */
export const cladogramSpeciesCount = (() => {
  let n = 0
  const walk = (node: CladeNode) => {
    if (node.rank === 'species') n++
    node.children?.forEach(walk)
  }
  walk(cladogram)
  return n
})()
