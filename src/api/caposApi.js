import SongApi from "./SongApi";

export default class CaposApi {
  static create(capo, songId) {
    const newCapo = {
      id: 1,
      capo_key: capo,
      created_at: new Date(),
      updated_at: new Date(),
    };
    SongApi.updateOneById(songId, { capo: newCapo });

    return { data: newCapo };
  }

  static update(capoId, songId, updates) {
    let { data: song } = SongApi.getOneById(songId);
    let newCapo = { ...song.capo, ...updates, updated_at: new Date() };
    SongApi.updateOneById(songId, { capo: newCapo });

    return { data: newCapo };
  }

  static delete(capoId, songId) {
    SongApi.updateOneById(songId, { capo: null });
  }
}
