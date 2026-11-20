// Image sources. For now these point at the current Squarespace CDN so the preview matches the live site.
// Before switching DNS, each file gets downloaded into /public/images and these paths change to local ones.
const CDN = 'https://images.squarespace-cdn.com/content/v1/68d46ed309ef9f41ff376355';

export const img = {
  logo: `${CDN}/b279faae-5428-46e8-9107-7ab35a197b7b/soci-pizza-truck-catering-red-logo.png`,
  favicon: `${CDN}/ee721e2e-88f9-4afc-b57b-896ac2f704cd/favicon.ico`,
  ogImage: 'https://static1.squarespace.com/static/68d46ed309ef9f41ff376355/t/68f79dd379e34469695ec676/1761058259527/soci+landscape+logo+2.png',
  heroTruck: `${CDN}/77130381-8776-47d2-97b0-3f3b92e65a06/soci-pizza-truck-catering-raleigh-durham-nc`,
  cardWeddings: `${CDN}/148d8d82-cd93-4010-a1e6-185317e11921/soci_pizza_truck_for_weddings_carrboro_nc.jpg`,
  cardParties: `${CDN}/b7d58ea5-b39c-4050-beb2-8ba25b1b84d4/Backyard_engagement_party_soci_pizza_nc.jpg`,
  cardCorporate: `${CDN}/48983c41-adf1-4776-8320-70d1344de898/corporate+pizza+catering+soci+raleigh+nc.jpeg`,
  pkgChef: `${CDN}/a9a8bce0-d837-4bd3-8107-08a579bb021c/soci_private_pizza_chef_raleigh_nc.png`,
  pkgTent: `${CDN}/3e91597e-8265-4af2-832d-fed91e14c42c/Tent_package_Thumbnail_Soci_Pizza_Raleigh_NC`,
  pkgTruck: `${CDN}/d02816b7-5412-4418-bc3c-c9786112c511/truck_package_thumbnail_soci_pizza_catering_nc.jpg`,
  insta: [
    { src: `${CDN}/1781110429245-BZZXSDWDCCTGA474F3VW/image-asset.jpeg`, href: 'https://www.instagram.com/p/DZaaDPKlQyY/' },
    { src: `${CDN}/1780772791805-CJRRZ0CI47CXIRMW8JZJ/image-asset.jpeg`, href: 'https://www.instagram.com/p/DZQQWqjPAog/' },
    { src: `${CDN}/1779815437809-VOZKA75VZE0VUS787KYS/image-asset.jpeg`, href: 'https://www.instagram.com/p/DYztH2_lQbC/' },
    { src: `${CDN}/1779138642756-O5CTF5B47YJZMMSUL6ZX/image-asset.jpeg`, href: 'https://www.instagram.com/p/DYfiwDiPXnM/' },
    { src: `${CDN}/1779070034574-Z9GWH4F7K7VCHESKKH9F/image-asset.jpeg`, href: 'https://www.instagram.com/p/DYdb2sVmhk0/' },
    { src: `${CDN}/1778605150557-TS3C463GVN4S9UM22933/image-asset.jpeg`, href: 'https://www.instagram.com/p/DYPsjmKjbSX/' },
  ],
};

/** Squarespace CDN supports ?format=NNNw resizing; local files will ignore it. */
export const sized = (src: string, w = 1500) => (src.startsWith('http') ? `${src}?format=${w}w` : src);
