import SongApi from "./SongApi";

export default class FormatApi {
  static updateOneById(id, updates) {
    let { data: song } = SongApi.getOneById(id);
    song.format = { ...song.format, ...updates };

    SongApi.setSongInStorage(song);
  }

  static createOne(format) {}
}
