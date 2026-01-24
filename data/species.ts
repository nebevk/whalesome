import type { WhaleSpecies } from '~/types/species'
import { unsplash } from '~/data/unsplash'

export const featuredSpecies: WhaleSpecies[] = [
  {
    id: 'blue-whale',
    name: 'Blue Whale',
    scientificName: 'Balaenoptera musculus',
    description: 'The largest animal on Earth, reaching lengths of up to 100 feet and weights of 200 tons. These gentle giants are filter feeders, consuming krill by the ton.',
    adult: {
      size: 'Up to 100 feet (30 meters)',
      weight: 'Up to 200 tons (180,000 kg)',
      characteristics: ['Largest animal on Earth', 'Blue-gray coloration', 'Long, streamlined body', 'Small dorsal fin'],
      image: unsplash.blueWhale,
      facts: ['Can consume 4 tons of krill per day', 'Heart weighs as much as a car', 'Loudest animal on Earth']
    },
    baby: {
      size: '23-26 feet (7-8 meters) at birth',
      weight: '2.5-3 tons (2,300-2,700 kg)',
      characteristics: ['Born tail-first', 'Can swim immediately', 'Nurses for 6-7 months', 'Grows rapidly'],
      image: unsplash.whaleUnderwater,
      facts: ['Gains 200 pounds per day', 'Drinks 50 gallons of milk daily', 'Stays close to mother for first year']
    },
    habitat: 'All oceans, from polar to tropical waters',
    conservationStatus: 'Endangered',
    group: 'baleen',
    family: 'Balaenopteridae'
  },
  {
    id: 'humpback-whale',
    name: 'Humpback Whale',
    scientificName: 'Megaptera novaeangliae',
    description: 'Known for their spectacular breaching behavior and complex songs. These acrobatic whales migrate thousands of miles between feeding and breeding grounds.',
    adult: {
      size: '40-50 feet (12-15 meters)',
      weight: '25-40 tons (23,000-36,000 kg)',
      characteristics: ['Long pectoral fins', 'Knobby head', 'Distinctive tail flukes', 'Breaching behavior'],
      image: unsplash.humpback,
      facts: ['Sings complex songs', 'Can breach completely out of water', 'Longest migration of any mammal']
    },
    baby: {
      size: '13-16 feet (4-5 meters) at birth',
      weight: '1-2 tons (900-1,800 kg)',
      characteristics: ['Born in warm waters', 'Nurses for 5-10 months', 'Stays with mother for 1 year', 'Learns migration routes'],
      image: unsplash.whaleTail,
      facts: ['Grows 1-2 feet per month', 'Learns songs from mother', 'Protected by mother from predators']
    },
    habitat: 'All major oceans, coastal and open waters',
    conservationStatus: 'Least Concern',
    group: 'baleen',
    family: 'Balaenopteridae'
  },
  {
    id: 'orca',
    name: 'Orca (Killer Whale)',
    scientificName: 'Orcinus orca',
    description: 'The apex predator of the ocean, orcas are highly intelligent and social. They live in matriarchal pods and have complex hunting strategies.',
    adult: {
      size: '20-32 feet (6-10 meters)',
      weight: '6-10 tons (5,400-9,000 kg)',
      characteristics: ['Distinctive black and white coloring', 'Tall dorsal fin', 'Powerful tail', 'Intelligent hunter'],
      image: unsplash.orca,
      facts: ['Apex predator with no natural enemies', 'Lives in matriarchal pods', 'Uses echolocation for hunting']
    },
    baby: {
      size: '6.5-8 feet (2-2.5 meters) at birth',
      weight: '300-400 pounds (136-181 kg)',
      characteristics: ['Born with orange tint', 'Nurses for 1-2 years', 'Stays with pod for life', 'Learns hunting from family'],
      image: unsplash.orca,
      facts: ['Protected by entire pod', 'Learns pod-specific calls', 'Plays important role in pod social structure']
    },
    habitat: 'All oceans, from polar to tropical waters',
    conservationStatus: 'Data Deficient',
    group: 'toothed',
    family: 'Delphinidae'
  },
  {
    id: 'beluga-whale',
    name: 'Beluga Whale',
    scientificName: 'Delphinapterus leucas',
    description: 'Known as the "canary of the sea" for their vocalizations, belugas are social whales with distinctive white coloring and flexible necks.',
    adult: {
      size: '13-20 feet (4-6 meters)',
      weight: '1-1.5 tons (900-1,400 kg)',
      characteristics: ['Pure white coloring', 'Bulbous forehead (melon)', 'Flexible neck', 'No dorsal fin'],
      image: unsplash.beluga,
      facts: ['Highly vocal with wide range of sounds', 'Can swim backwards', 'Lives in Arctic and sub-Arctic waters']
    },
    baby: {
      size: '4-5 feet (1.2-1.5 meters) at birth',
      weight: '100-150 pounds (45-68 kg)',
      characteristics: ['Born gray or brown', 'Turns white by age 5-7', 'Nurses for 1.5-2 years', 'Very playful'],
      image: unsplash.beluga,
      facts: ['Stays with mother for 2-3 years', 'Learns vocalizations from pod', 'Born in shallow, warm waters']
    },
    habitat: 'Arctic and sub-Arctic waters',
    conservationStatus: 'Near Threatened',
    group: 'toothed',
    family: 'Monodontidae'
  }
]
