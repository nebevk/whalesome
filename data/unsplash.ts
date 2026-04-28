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
  ocean: U('1505142468180-964fdb3a8e31', 1920),
  oceanWhale: U('1698334846759-2cdc3352dd85', 1920), // orca, black-and-white
  deepOcean: U('1698046828316-9219096ab432', 1200), // open ocean swell

  // Species portraits
  blueWhale: U('1568430462989-44163eb1752f'), // blue whale at sea
  humpback: U('1698472505070-6d3b90afb530'), // humpback under surface
  orca: U('1721750887731-a0c76043092d'), // pair of orcas
  beluga: U('1706043903343-8f3765f0fc80'), // beluga, Mystic Aquarium
  spermWhale: U('1520646924857-261be3037bc7'), // large whale, deep water
  narwhal: U('1518399681705-1c1a55e5e883'), // whale tail breaching
  grayWhale: U('1548638168-bdb1d0f1e700'), // whale from above
  finWhale: U('1602264836619-094873fa05fc'), // two whales swimming together
  minkeWhale: U('1728455094077-08c6267bcc7d'), // whale leaping
  bowhead: U('1602265133556-dcc08d51340c'), // whale just below surface

  // Reused detail shots
  whaleTail: U('1518399681705-1c1a55e5e883', 600),
  whaleUnderwater: U('1602265133556-dcc08d51340c', 600),
  whaleCalf: U('1698551007683-7226dc6f4e85', 600), // humpback under water
}
