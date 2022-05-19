import { constructAuthHeaders, getTeamId } from "../utils/AuthUtils";

import axios from "axios";
import SongApi from "./SongApi";

const BINDERS_URL = process.env.REACT_APP_API_URL + "/binders";

export default class BinderApi {
  static search(name) {
    return axios.get(`${BINDERS_URL}?team_id=${getTeamId()}&name=${name}`, {
      headers: constructAuthHeaders(),
    });
  }

  static getAll() {
    let binders = localStorage.getItem("binders");

    if (!binders) {
      localStorage.setItem("binders", "[]");
      binders = [];
    } else {
      binders = JSON.parse(binders);
    }

    return { data: binders };
  }

  static getOneById(binderId) {
    let parsedId = parseInt(binderId);
    let { data: binders } = this.getAll();

    let binder = binders.find((b) => b.id === parsedId);

    let songs = SongApi.getAll();

    let songsInBinder = songs.filter((s) => binder.songs.includes(s.id));
    binder.songs = songsInBinder;
    return { data: binder };
  }

  static createOne(newBinder) {
    let { data: allBinders } = this.getAll();
    let nextId = this.calculateNextId(allBinders.map((b) => b.id));

    let binder = {
      id: nextId,
      songs: [],
      ...newBinder,
      created_at: new Date(),
      updated_at: new Date(),
    };

    allBinders.push(binder);
    this.setAllBindersInStorage(allBinders);

    return { data: binder };
  }

  static calculateNextId(ids) {
    let max = Math.max(...ids);
    return isFinite(max) ? max + 1 : 1;
  }

  static setAllBindersInStorage(binders) {
    let stringified = JSON.stringify(binders);
    localStorage.setItem("binders", stringified);
  }

  static setBinderInStorage(binder) {
    let { data: binders } = this.getAll();
    binders = binders.map((b) => (b.id === binder.id ? binder : b));
    this.setAllBindersInStorage(binders);
  }

  static updateOneById(binderId, updates) {
    let allowedParams = {};

    if (updates.name) allowedParams.name = updates.name.trim();
    if (updates.color) allowedParams.color = updates.color.trim();
    if (updates.description)
      allowedParams.description = updates.description.trim();
    if (updates.songs) allowedParams.songs = updates.songs;

    let { data: binder } = this.getOneById(binderId);
    binder = { ...binder, ...allowedParams, updated_at: new Date() };

    this.setBinderInStorage(binder);

    return { data: binder };
  }

  static addSongs(binderId, songIds) {
    let { data: binder } = this.getOneById(binderId);
    let songs = SongApi.getAll();

    let addedSongs = songs.filter((s) => songIds.includes(s.id));
    binder.songs = binder.songs.map((s) => s.id);
    binder.songs.push(...songIds);

    this.setBinderInStorage(binder);
    return { data: addedSongs };
  }

  static removeSongs(binderId, songId) {
    let { data: binder } = this.getOneById(binderId);

    binder.songs = binder.songs.map((s) => s.id);
    binder.songs = binder.songs.filter((s) => s !== songId);
    this.setBinderInStorage(binder);
  }

  static deleteOneById(id) {
    let parsedId = parseInt(id);
    let { data: binders } = this.getAll();
    binders = binders.filter((b) => b.id !== parsedId);

    this.setAllBindersInStorage(binders);
  }
}
