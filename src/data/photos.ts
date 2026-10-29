export interface Photo {
  /** Direct image URL, loaded straight from the host (Pixieset). Instagram CDN links expire, so avoid them here. */
  src: string;
  alt: string;
  /** Shown as the album caption, e.g. "Kyoto, Japan". */
  place?: string;
  /** Where a click on the photo goes, e.g. the Instagram post or the Pixieset gallery. */
  href?: string;
}

// The photo album shows a random handful of these on every page load. Nothing is stored in the repo.
// To add one: open the photo on wideanglesights.pixieset.com, right-click → "Copy image address"
// (use the -xlarge.jpg variant; the album derives the smaller sizes from it), and use the photo's page as href.
export const photos: readonly Photo[] = [
  {
    src: 'https://images.pixieset.com/027593021/1afe803b7e0f7c37aa21ce458e99321e-xlarge.jpg',
    alt: 'Torii gate at the end of a tree-lined path to Meiji Shrine, Tokyo',
    place: 'Tokyo, Japan',
    href: 'https://wideanglesights.pixieset.com/japan/tokyo/?pid=19698482632&id=1&h=MzMyODA5MjU2NQ',
  },
  {
    src: 'https://images.pixieset.com/027593021/7c54628d740ef0f99e26ff6f2b8befe9-xlarge.jpg',
    alt: 'Tokyo Tower framed by cherry blossoms',
    place: 'Tokyo, Japan',
    href: 'https://wideanglesights.pixieset.com/japan/tokyo/?pid=19698488832&id=6&h=Mzk1NDQ2NDMxMA',
  },
  {
    src: 'https://images.pixieset.com/027593021/79849195ff226171cb64804622623d3d-xlarge.jpg',
    alt: 'Looking out of a train window at a mountain station in Hakone',
    place: 'Hakone, Japan',
    href: 'https://wideanglesights.pixieset.com/japan/hakone/?pid=19698490149&id=0&h=MzEzMTgzMzI4MQ',
  },
  {
    src: 'https://images.pixieset.com/027593021/44c73ded239cfcc608a1af78afa242a4-xlarge.jpg',
    alt: 'A river running between two rows of cherry trees in bloom, Nagano',
    place: 'Nagano, Japan',
    href: 'https://wideanglesights.pixieset.com/japan/nagano/?pid=19698513857&id=2&h=MjU4NDcwNDIyMA',
  },
  {
    src: 'https://images.pixieset.com/027593021/8c5333df5ddbca41f4a63dc62bcc3121-xlarge.jpg',
    alt: 'Wooden shopfronts and cherry blossoms on an old street in Kanazawa',
    place: 'Kanazawa, Japan',
    href: 'https://wideanglesights.pixieset.com/japan/kanazawa/?pid=19698523394&id=6&h=MTQ3MDQyMDkxMg',
  },
  {
    src: 'https://images.pixieset.com/027593021/4575b81f4c76d920f01d0109894af867-xlarge.jpg',
    alt: 'Thatched farmhouses of Shirakawa-go in the snow, seen from above',
    place: 'Shirakawa-go, Japan',
    href: 'https://wideanglesights.pixieset.com/japan/shirakawago/?pid=19698536261&id=1&h=MjMxMjYzODQxMg',
  },
  {
    src: 'https://images.pixieset.com/027593021/5c8e0db9988bd545e8c11b317733779e-xlarge.jpg',
    alt: 'Old railway tracks under autumn trees in Kyoto',
    place: 'Kyoto, Japan',
    href: 'https://wideanglesights.pixieset.com/japan/kyoto/?pid=19698551407&id=5&h=MzQ2NjIwMDY2NA',
  },
  {
    src: 'https://images.pixieset.com/027593021/a8ad9ff1657ada83defccdafac089868-xlarge.jpg',
    alt: 'The floating torii of Itsukushima Shrine, framed by the red shrine hall, Miyajima',
    place: 'Miyajima, Japan',
    href: 'https://wideanglesights.pixieset.com/japan/miyajima/?pid=19698558517&id=0&h=MTY0NzAwOTgwMw',
  },
  {
    src: 'https://images.pixieset.com/027593021/3bbd135f6665f2b9f296068888a7bda7-xlarge.jpg',
    alt: 'A moss-covered stone lantern in the forest, Miyajima',
    place: 'Miyajima, Japan',
    href: 'https://wideanglesights.pixieset.com/japan/miyajima/?pid=19698559171&id=3&h=MTE5NDI5NzAxOQ',
  },
  {
    src: 'https://images.pixieset.com/027593021/b30466a917a0acfe146af1c9db89ea98-xlarge.jpg',
    alt: 'A deer resting under a mossy tree, Miyajima',
    place: 'Miyajima, Japan',
    href: 'https://wideanglesights.pixieset.com/japan/miyajima/?pid=19698559924&id=4&h=NDAyNTY1NjUzMg',
  },
  {
    src: 'https://images.pixieset.com/900233021/49c1637add5619528f9577ebef6a4855-xlarge.jpg',
    alt: 'A village road below green slopes and a rocky peak, Jungfrau region',
    place: 'Jungfrau region, Switzerland',
    href: 'https://wideanglesights.pixieset.com/jungfrau/?pid=19685976786&id=2&h=MjU3Nzg4Mjg2MQ',
  },
  {
    src: 'https://images.pixieset.com/900233021/42f8eb9e6cb8e57aa94aaa9ebcba9d9f-xlarge.jpg',
    alt: 'A hiker with a yellow backpack above a lake, in black and white, Jungfrau region',
    place: 'Jungfrau region, Switzerland',
    href: 'https://wideanglesights.pixieset.com/jungfrau/?pid=19685994601&id=11&h=Nzg5ODEzMTI0',
  },
  {
    src: 'https://images.pixieset.com/900233021/f126f247815d411064771df0f08377a1-xlarge.jpg',
    alt: 'Lake steamer Stadt Thun moored below wooded mountains',
    place: 'Jungfrau region, Switzerland',
    href: 'https://wideanglesights.pixieset.com/jungfrau/?pid=19685976785&id=0&h=NjczMDcyNjMy',
  },
  {
    src: 'https://images.pixieset.com/900233021/052a721814c23a339ac98c0ef8cef4f9-xlarge.jpg',
    alt: 'A castle on a wooded peninsula in a turquoise alpine lake',
    place: 'Jungfrau region, Switzerland',
    href: 'https://wideanglesights.pixieset.com/jungfrau/?pid=19685986090&id=3&h=MTkyMTY5MTA5Mw',
  },
  {
    src: 'https://images.pixieset.com/900233021/6ddbd3ccf053d8295962270cea107e42-xlarge.jpg',
    alt: 'A cow grazing below sheer limestone cliffs, Grindelwald',
    place: 'Grindelwald, Switzerland',
    href: 'https://wideanglesights.pixieset.com/jungfrau/grindelwald/?pid=19686012024&id=1&h=MzkzOTk0OTQ0Mw',
  },
  {
    src: 'https://images.pixieset.com/900233021/d5b27a17b50aa496dba7313f4d3441b8-xlarge.jpg',
    alt: 'Snow-streaked rock ridge in black and white, Grindelwald',
    place: 'Grindelwald, Switzerland',
    href: 'https://wideanglesights.pixieset.com/jungfrau/grindelwald/?pid=19686019529&id=5&h=MzAzNzY2MzE1NQ',
  },
  {
    src: 'https://images.pixieset.com/900233021/d18797461ca029135e4479a66db89eed-xlarge.jpg',
    alt: 'Two hikers by a mountain lake under big clouds, Grindelwald',
    place: 'Grindelwald, Switzerland',
    href: 'https://wideanglesights.pixieset.com/jungfrau/grindelwald/?pid=19686017823&id=3&h=NjM0OTQ5NDc',
  },
  {
    src: 'https://images.pixieset.com/900233021/aec0505b6dccdc35019fdab7f4fc4341-xlarge.jpg',
    alt: 'Alpine meadow and a cable car line below snowy peaks, Grindelwald',
    place: 'Grindelwald, Switzerland',
    href: 'https://wideanglesights.pixieset.com/jungfrau/grindelwald/?pid=19686029698&id=8&h=Mzg4MTY5OTYwOQ',
  },
];
