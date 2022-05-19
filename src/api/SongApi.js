import { constructAuthHeaders, getTeamId } from "../utils/AuthUtils";

import axios from "axios";
import GenreApi from "./GenreApi";
import ThemeApi from "./ThemeApi";
import BinderApi from "./BinderApi";

const SONGS_URL = process.env.REACT_APP_API_URL + "/songs";

export default class SongApi {
  static search(name) {
    return axios.get(`${SONGS_URL}?team_id=${getTeamId()}&name=${name}`, {
      headers: constructAuthHeaders(),
    });
  }

  static getAll() {
    let songs = localStorage.getItem("songs");

    if (!songs) {
      localStorage.setItem("songs", "[]");
      songs = [];
    } else {
      songs = JSON.parse(songs);
      songs.sort((a, b) =>
        a.name?.toLowerCase()?.localeCompare(b.name?.toLowerCase())
      );
    }

    return songs;
  }

  static createOne(newSong) {
    let songs = this.getAll();
    let nextId = this.calculateNextId(songs.map((s) => s.id));

    let song = {
      ...newSong,
      id: nextId,
      content: "",
      format: {
        font: "Roboto Mono",
        font_size: 18,
        bold_chords: false,
        italic_chords: false,
      },
      themes: [],
      genres: [],
      tracks: [],
      binders: [],
      original_key: null,
      transposed_key: null,
      bpm: null,
      meter: null,
      setlists: [],
      created_at: new Date(),
      updated_at: new Date(),
    };

    songs.push(song);
    localStorage.setItem("songs", JSON.stringify(songs));

    return { data: song };
  }

  static calculateNextId(ids) {
    let max = Math.max(...ids);
    return isFinite(max) ? max + 1 : 1;
  }

  static getOneById(songId) {
    let parsedId = parseInt(songId);
    let songs = this.getAll();

    let song = songs.find((s) => s.id === parsedId);

    let { data: binders } = BinderApi.getAll();
    binders = binders.filter((b) => b.songs.includes(parseInt(songId)));

    song.binders = binders.map((b) => ({
      color: b.color,
      name: b.name,
      id: b.id,
    }));
    return { data: song };
  }

  static updateOneById(songId, updates) {
    let allowedParams = {};

    if (updates.name) allowedParams.name = updates.name;
    if (updates.bpm) allowedParams.bpm = updates.bpm;
    if (updates.artist) allowedParams.artist = updates.artist;
    if (updates.meter) allowedParams.meter = updates.meter;
    if (updates.original_key) allowedParams.original_key = updates.original_key;
    if (updates.transposed_key)
      allowedParams.transposed_key = updates.transposed_key;
    if (updates.content) allowedParams.content = updates.content;
    if (updates.scroll_speed) allowedParams.scroll_speed = updates.scroll_speed;
    if (updates.roadmap) allowedParams.roadmap = updates.roadmap;

    let { data: song } = this.getOneById(songId);
    let updatedSong = { ...song, ...allowedParams, updated_at: new Date() };
    this.setSongInStorage(updatedSong);

    return { data: updatedSong };
  }

  static setSongInStorage(song) {
    let songs = this.getAll();
    songs = songs.map((s) => (s.id === song.id ? song : s));
    this.setAllSongsInStorage(songs);
  }

  static setAllSongsInStorage(songs) {
    let stringified = JSON.stringify(songs);
    localStorage.setItem("songs", stringified);
  }

  static addThemes(songId, themeIds) {
    let { data: allThemes } = ThemeApi.getAll();
    let { data: song } = this.getOneById(songId);

    let themesToAdd = allThemes.filter((t) => themeIds.includes(t.id));
    song.themes = song.themes.concat(themesToAdd);
    this.setSongInStorage(song);

    return { data: themesToAdd };
  }

  static removeThemes(songId, themeId) {
    let { data: song } = this.getOneById(songId);
    let updatedThemes = song.themes.filter(
      (themeInList) => themeInList.id !== themeId
    );

    song.themes = updatedThemes;

    this.setSongInStorage(song);
  }

  static addGenres(songId, genreIds = []) {
    let { data: allGenres } = GenreApi.getAll();
    let { data: song } = this.getOneById(songId);

    let genresToAdd = allGenres.filter((g) => genreIds.includes(g.id));
    song.genres = song.genres.concat(genresToAdd);
    this.setSongInStorage(song);

    return { data: genresToAdd };
  }

  static removeGenres(songId, genreId) {
    let { data: song } = this.getOneById(songId);
    let updatedGenres = song.genres.filter(
      (genreInList) => genreInList.id !== genreId
    );

    song.genres = updatedGenres;

    this.setSongInStorage(song);
  }

  static deleteOneById(id) {
    let songs = this.getAll();
    songs = songs.filter((s) => s.id !== id);

    let { data: binders } = BinderApi.getAll();

    binders.forEach((binder) => {
      console.log(binder);
      binder.songs = binder.songs?.filter((s) => s.id !== id && s !== id);
    });

    BinderApi.setAllBindersInStorage(binders);

    this.setAllSongsInStorage(songs);
  }
}
