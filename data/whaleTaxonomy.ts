import type { WhaleGroup } from '~/types/species'

export const whaleGroups: WhaleGroup[] = [
  {
    name: 'Baleen Whales',
    scientificName: 'Mysticeti',
    description: 'Baleen whales are characterized by baleen plates for filtering food from water, instead of teeth.',
    families: [
      {
        name: 'Right Whales',
        scientificName: 'Balaenidae',
        description: 'Large baleen whales with arched upper jaw and no dorsal fin.',
        species: ['North Atlantic Right Whale', 'North Pacific Right Whale', 'Southern Right Whale']
      },
      {
        name: 'Rorquals',
        scientificName: 'Balaenopteridae',
        description: 'The largest group of baleen whales, characterized by pleated throat grooves.',
        species: ['Blue Whale', 'Fin Whale', 'Humpback Whale', 'Sei Whale', 'Bryde\'s Whale', 'Minke Whale']
      },
      {
        name: 'Gray Whales',
        scientificName: 'Eschrichtiidae',
        description: 'Medium-sized baleen whales known for their long migrations.',
        species: ['Gray Whale']
      },
      {
        name: 'Pygmy Right Whales',
        scientificName: 'Neobalaenidae',
        description: 'The smallest of the baleen whales.',
        species: ['Pygmy Right Whale']
      }
    ]
  },
  {
    name: 'Toothed Whales',
    scientificName: 'Odontoceti',
    description: 'Toothed whales have teeth and use echolocation to hunt and navigate.',
    families: [
      {
        name: 'Sperm Whales',
        scientificName: 'Physeteridae',
        description: 'The largest toothed whales, known for their massive heads.',
        species: ['Sperm Whale', 'Pygmy Sperm Whale', 'Dwarf Sperm Whale']
      },
      {
        name: 'Beaked Whales',
        scientificName: 'Ziphiidae',
        description: 'Deep-diving whales with distinctive beaks.',
        species: ['Cuvier\'s Beaked Whale', 'Baird\'s Beaked Whale', 'Blainville\'s Beaked Whale']
      },
      {
        name: 'Dolphins',
        scientificName: 'Delphinidae',
        description: 'The largest family of toothed whales, including dolphins and orcas.',
        species: ['Orca (Killer Whale)', 'Common Dolphin', 'Bottlenose Dolphin', 'Pilot Whale']
      },
      {
        name: 'Belugas and Narwhals',
        scientificName: 'Monodontidae',
        description: 'Arctic whales known for their distinctive appearances.',
        species: ['Beluga Whale', 'Narwhal']
      },
      {
        name: 'Porpoises',
        scientificName: 'Phocoenidae',
        description: 'Small toothed whales, smaller than dolphins.',
        species: ['Harbor Porpoise', 'Dall\'s Porpoise', 'Vaquita']
      }
    ]
  }
]
