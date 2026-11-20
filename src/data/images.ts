// All images now live in /public/images (downloaded from Squarespace, converted to WebP).
const I = (n: string) => `/images/${n}`;

export const img = {
  logo: I('soci-pizza-truck-catering-red-logo.webp'),
  favicon: I('favicon.png'),
  ogImage: I('soci-landscape-logo.webp'),
  heroTruck: I('soci-pizza-truck-catering-raleigh-durham-nc.webp'),
  cardWeddings: I('soci-pizza-truck-for-weddings-carrboro-nc.webp'),
  cardParties: I('backyard-engagement-party-soci-pizza-nc.webp'),
  cardCorporate: I('corporate-pizza-catering-soci-raleigh-nc.webp'),
  pkgChef: I('soci-private-pizza-chef-raleigh-nc.webp'),
  pkgTent: I('tent-package-thumbnail-soci-pizza-raleigh-nc.webp'),
  pkgTruck: I('truck-package-thumbnail-soci-pizza-catering-nc.webp'),
  insta: [
    { src: I('instagram-17811104.webp'), href: 'https://www.instagram.com/p/DZaaDPKlQyY/' },
    { src: I('instagram-17807727.webp'), href: 'https://www.instagram.com/p/DZQQWqjPAog/' },
    { src: I('instagram-17798154.webp'), href: 'https://www.instagram.com/p/DYztH2_lQbC/' },
    { src: I('instagram-17791386.webp'), href: 'https://www.instagram.com/p/DYfiwDiPXnM/' },
    { src: I('instagram-17790700.webp'), href: 'https://www.instagram.com/p/DYdb2sVmhk0/' },
    { src: I('instagram-17786051.webp'), href: 'https://www.instagram.com/p/DYPsjmKjbSX/' },
  ],
};

/** Kept for compatibility with pages that pass a width; local files ignore it. */
export const sized = (src: string, _w = 1500) => src;
