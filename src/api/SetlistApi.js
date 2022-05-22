import SongApi from "./SongApi";

export default class SetlistApi {
  static search(name) {
    const query = name?.toLowerCase();
    let { data: sets } = this.getAll();
    let foundSets = sets.filter((s) => s.name?.toLowerCase()?.includes(query));

    return { data: foundSets };
  }

  static getAll() {
    let setlists = localStorage.getItem("setlists");

    if (!setlists) {
      localStorage.setItem("setlists", "[]");
      setlists = [];
    } else {
      setlists = JSON.parse(setlists);
    }

    return { data: setlists };
  }

  static getOne(setlistId) {
    let parsedId = parseInt(setlistId);
    let { data: setlists } = this.getAll();

    let setlist = setlists.find((s) => s.id === parsedId);

    let songs = SongApi.getAll();

    let songsInSetlist = songs.filter((s) => setlist.songs.includes(s.id));
    setlist.songs = songsInSetlist;

    return { data: setlist };
  }

  static createOne(newSetlist) {
    let allowedParams = {};

    if (newSetlist.name) allowedParams.name = newSetlist.name;
    if (newSetlist.scheduledDate)
      allowedParams.scheduled_date = newSetlist.scheduledDate;

    let { data: setlists } = this.getAll();
    let nextId = this.calculateNextId(setlists.map((s) => s.id));

    let setlist = {
      ...allowedParams,
      id: nextId,
      created_at: new Date(),
      updated_at: new Date(),
      songs: [],
    };

    setlists.push(setlist);
    this.setAllSetlistsInStorage(setlists);

    return { data: setlist };
  }

  static calculateNextId(ids) {
    let max = Math.max(...ids);
    return isFinite(max) ? max + 1 : 1;
  }

  static setAllSetlistsInStorage(setlists) {
    let stringified = JSON.stringify(setlists);
    localStorage.setItem("setlists", stringified);
  }

  static setSetlistInStorage(setlist) {
    let { data: setlists } = this.getAll();
    setlists = setlists.map((s) => (s.id === setlist.id ? setlist : s));
    this.setAllSetlistsInStorage(setlists);
  }

  static addSongs(setlistId, songIds) {
    let { data: setlist } = this.getOne(setlistId);
    let songs = SongApi.getAll();

    let addedSongs = songs.filter((s) => songIds.includes(s.id));
    setlist.songs = setlist.songs.map((s) => s.id);
    setlist.songs.push(...songIds);

    this.setSetlistInStorage(setlist);
    return { data: addedSongs };
  }

  static removeSong(setlistId, songId) {
    let { data: setlist } = this.getOne(setlistId);

    setlist.songs = setlist.songs.map((s) => s.id);
    setlist.songs = setlist.songs.filter((s) => s !== songId);
    this.setSetlistInStorage(setlist);
  }

  static deleteOne(setlistId) {
    let parsedId = parseInt(setlistId);
    let { data: setlists } = this.getAll();
    setlists = setlists.filter((s) => s.id !== parsedId);

    this.setAllSetlistsInStorage(setlists);
  }

  static updateOne(updates, setlistId) {
    if (updates) {
      let allowedParams = {};

      if (updates.name) allowedParams.name = updates.name;
      if (updates.scheduledDate)
        allowedParams.scheduled_date = updates.scheduledDate;

      let { data: setlist } = this.getOne(setlistId);
      setlist = { ...setlist, ...allowedParams, updated_at: new Date() };

      this.setSetlistInStorage(setlist);

      return { data: setlist };
    }
  }

  static updateSongOrder(setlistId, reorderedSongs) {
    let { data: setlist } = this.getOne(setlistId);

    let songIds = reorderedSongs.map((s) => s.id);

    setlist.songs = songIds;

    this.setSetlistInStorage(setlist);
  }
}
