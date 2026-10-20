/**
 * Verified Unsplash whale & ocean photos.
 * Each ID was sourced by visiting unsplash.com/photos/<short-id> and pulling the
 * canonical images.unsplash.com URL.
 *
 * @see https://help.unsplash.com/en/articles/2511271-guideline-hotlinking-images
 */
const U = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export const unsplash = {
  // Backgrounds
  ocean: U('1698046828316-9219096ab432', 1920),
  oceanWhale: U('1698334846759-2cdc3352dd85', 1920), // orca, black-and-white
  deepOcean: U('1698046828316-9219096ab432', 1200), // open ocean swell

  // Species portraits. Unsplash titles are unreliable: blue, fin, bowhead, minke and
  // narwhal portraits now come from Wikimedia because their Unsplash picks showed
  // humpbacks or orcas, and the beluga (captive) and sperm whale (tail only) portraits
  // were replaced in the 2026 photo audit. Check the photo itself before adding one here.
  humpback: U('1698472505070-6d3b90afb530'), // humpback under surface
  orca: U('1721750887731-a0c76043092d'), // pair of orcas
  grayWhale: U('1548638168-bdb1d0f1e700'), // gray whale from above

  // Reused detail shots
  whaleTail: U('1518399681705-1c1a55e5e883', 600), // humpback mother and calf from above
}
