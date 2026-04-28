export interface WhaleSpecies {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  adult: {
    size: string;
    weight: string;
    characteristics: string[];
    image: string;
    facts: string[];
  };
  baby: {
    size: string;
    weight: string;
    characteristics: string[];
    image: string;
    facts: string[];
  };
  habitat: string;
  conservationStatus: string;
  group: 'baleen' | 'toothed';
  family: string;
  featured?: boolean;
}

export interface WhaleGroup {
  name: string;
  scientificName: string;
  description: string;
  families: WhaleFamily[];
}

export interface WhaleFamily {
  name: string;
  scientificName: string;
  description: string;
  species: string[];
}
