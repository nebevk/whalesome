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
  gallery?: GalleryImage[];
  audio?: AudioClip;
  habitatRegions?: HabitatRegion[];
}

export interface AudioClip {
  /**
   * Wikimedia Commons path to the original OGG file, in the form `{a}/{ab}/{filename}.ogg`
   * (e.g. `7/79/Killer_whale.ogg`). Filename uses underscores, not spaces.
   * The component derives both the original OGG URL and the auto-generated MP3 transcode URL from this.
   */
  path: string;
  label: string;
  source: string;
}

export interface HabitatRegion {
  lat: number;
  lng: number;
  label: string;
}

export interface GalleryImage {
  src: string;
  caption: string;
  source: 'unsplash' | 'wikimedia';
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
