export default class GenreApi {
  static getAll() {
    return { data: GENRES };
  }
}

let GENRES = [
  { name: "Rock", id: 0 },
  { name: "Country", id: 1 },
  { name: "Contemporary", id: 2 },
  { name: "Progressive", id: 3 },
  { name: "Reggae", id: 4 },
  { name: "Spoken Word", id: 5 },
  { name: "Alternative", id: 6 },
  { name: "Blues", id: 7 },
  { name: "Classical", id: 8 },
  { name: "Dance", id: 9 },
  { name: "Disney", id: 10 },
  { name: "Electronic", id: 11 },
  { name: "Hip Hop", id: 12 },
  { name: "Rap", id: 13 },
  { name: "Indie", id: 14 },
  { name: "Industrial", id: 15 },
  { name: "Christian", id: 16 },
  { name: "Gospel", id: 17 },
  { name: "Instrumental", id: 18 },
  { name: "Jazz", id: 19 },
  { name: "K-Pop", id: 20 },
  { name: "Karoake", id: 21 },
  { name: "Latin", id: 22 },
  { name: "Latin", id: 23 },
  { name: "Opera", id: 24 },
  { name: "World", id: 25 },
];
