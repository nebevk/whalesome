/**
 * Unsplash image URLs for whale/ocean imagery.
 * @see https://unsplash.com https://help.unsplash.com/en/articles/2511271-guideline-hotlinking-images
 */
const U = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export const unsplash = {
  ocean: U('1505142468180-964fdb3a8e31', 1920),
  oceanWhale: U('1544551763-46a013bb70d5', 1920),
  blueWhale: U('1559827260-dc66d52bef19'),
  humpback: U('1544551763-46a013bb70d5'),
  orca: U('1564349683136-77e08dba1ef7'),
  beluga: U('1589656966895-2f33e7653819'),
  whaleTail: U('1559827260-dc66d52bef19', 600),
  whaleUnderwater: U('1544551763-46a013bb70d5', 600),
}
