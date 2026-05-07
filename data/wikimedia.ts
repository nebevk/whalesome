/**
 * Wikimedia Commons thumbnail hotlinks.
 *
 * `path` is the `{a}/{ab}/{filename}` segment under /commons/thumb/, e.g.
 *   "1/1c/Anim1754_-_Flickr_-_NOAA_Photo_Library.jpg"
 *
 * Filenames with non-ASCII characters or punctuation must be URL-encoded
 * exactly the way Wikimedia stores them (paste the value out of the
 * existing thumbnail URL — don't re-encode by hand).
 *
 * Wikimedia rejects arbitrary widths; only fixed "thumbnail steps" work.
 * Confirmed-OK widths: 120, 250, 500, 960, 1280. Anything else returns 400.
 *
 * @see https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia
 * @see https://wikitech.wikimedia.org/wiki/Thumbor
 */
export type WmWidth = 120 | 250 | 500 | 960 | 1280

export const wm = (path: string, w: WmWidth = 960) => {
  const filename = path.split('/').pop() ?? ''
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${path}/${w}px-${filename}`
}

/**
 * Original audio URL (typically OGG/Vorbis). Wikimedia Commons stores audio at
 * `commons/{a}/{ab}/{filename}`. Browsers without OGG support (Safari, iOS) need the MP3
 * transcode below.
 */
export const wmAudio = (path: string) =>
  `https://upload.wikimedia.org/wikipedia/commons/${path}`

/**
 * Auto-generated MP3 transcode URL. Wikimedia produces these for every audio file via
 * TimedMediaHandler; they sit alongside the original at /transcoded/<path>/<filename>.mp3.
 * Use as a fallback `<source>` so Safari/iOS can play the clip.
 */
export const wmAudioMp3 = (path: string) => {
  const filename = path.split('/').pop() ?? ''
  return `https://upload.wikimedia.org/wikipedia/commons/transcoded/${path}/${filename}.mp3`
}
