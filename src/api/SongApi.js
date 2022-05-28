import GenreApi from './GenreApi';
import ThemeApi from './ThemeApi';
import BinderApi from './BinderApi';
import SetlistApi from './SetlistApi';

export default class SongApi {
  static search(name) {
    const query = name?.toLowerCase();
    let songs = this.getAll();
    let foundSongs = songs.filter(s => s.name?.toLowerCase()?.includes(query));

    return { data: foundSongs };
  }

  static getAll() {
    let songs = localStorage.getItem('songs');

    if (!songs) {
      localStorage.setItem('songs', '[]');
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
    let nextId = this.calculateNextId(songs.map(s => s.id));

    let song = {
      ...newSong,
      id: nextId,
      content: '',
      format: {
        font: 'Roboto Mono',
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
    localStorage.setItem('songs', JSON.stringify(songs));

    return { data: song };
  }

  static calculateNextId(ids) {
    let max = Math.max(...ids);
    return isFinite(max) ? max + 1 : 1;
  }

  static getOneById(songId) {
    let parsedId = parseInt(songId);
    let songs = this.getAll();

    let song = songs.find(s => s.id === parsedId);

    let { data: binders } = BinderApi.getAll();
    binders = binders.filter(b => b.songs.includes(parseInt(songId)));

    song.binders = binders.map(b => ({
      color: b.color,
      name: b.name,
      id: b.id,
    }));

    let { data: setlists } = SetlistApi.getAll();
    setlists = setlists.filter(s => s.songs.includes(parseInt(songId)));

    song.setlists = setlists.map(s => ({
      id: s.id,
      scheduled_date: s.scheduled_date,
    }));
    return { data: song };
  }

  static updateOneById(songId, updates) {
    let { data: song } = this.getOneById(songId);
    let updatedSong = { ...song, ...updates, updated_at: new Date() };
    this.setSongInStorage(updatedSong);

    return { data: updatedSong };
  }

  static setSongInStorage(song) {
    let songs = this.getAll();
    songs = songs.map(s => (s.id === song.id ? song : s));
    this.setAllSongsInStorage(songs);
  }

  static setAllSongsInStorage(songs) {
    let stringified = JSON.stringify(songs);
    localStorage.setItem('songs', stringified);
  }

  static addThemes(songId, themeIds) {
    let { data: allThemes } = ThemeApi.getAll();
    let { data: song } = this.getOneById(songId);

    let themesToAdd = allThemes.filter(t => themeIds.includes(t.id));
    song.themes = song.themes.concat(themesToAdd);
    this.setSongInStorage(song);

    return { data: themesToAdd };
  }

  static removeThemes(songId, themeId) {
    let { data: song } = this.getOneById(songId);
    let updatedThemes = song.themes.filter(
      themeInList => themeInList.id !== themeId
    );

    song.themes = updatedThemes;

    this.setSongInStorage(song);
  }

  static addGenres(songId, genreIds = []) {
    let { data: allGenres } = GenreApi.getAll();
    let { data: song } = this.getOneById(songId);

    let genresToAdd = allGenres.filter(g => genreIds.includes(g.id));
    song.genres = song.genres.concat(genresToAdd);
    this.setSongInStorage(song);

    return { data: genresToAdd };
  }

  static removeGenres(songId, genreId) {
    let { data: song } = this.getOneById(songId);
    let updatedGenres = song.genres.filter(
      genreInList => genreInList.id !== genreId
    );

    song.genres = updatedGenres;

    this.setSongInStorage(song);
  }

  static deleteOneById(id) {
    let songs = this.getAll();
    songs = songs.filter(s => s.id !== id);

    let { data: binders } = BinderApi.getAll();

    binders.forEach(binder => {
      binder.songs = binder.songs?.filter(s => s.id !== id && s !== id);
    });

    BinderApi.setAllBindersInStorage(binders);

    let { data: setlists } = SetlistApi.getAll();

    setlists.forEach(setlist => {
      setlist.songs = setlist.songs?.filter(s => s.id !== id && s !== id);
    });

    SetlistApi.setAllSetlistsInStorage(setlists);

    this.setAllSongsInStorage(songs);
  }

  static deleteBulk(ids) {
    ids?.forEach(id => this.deleteOneById(id));
  }
}
