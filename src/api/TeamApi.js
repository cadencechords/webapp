import { constructAuthHeaders, getTeamId } from "../utils/AuthUtils";

import axios from "axios";

const TEAMS_URL = process.env.REACT_APP_API_URL + "/teams";
export default class TeamApi {
  static getAll() {
    return axios.get(process.env.REACT_APP_API_URL + "/teams", {
      headers: constructAuthHeaders(),
    });
  }

  static createOne(newTeam) {
    let teamParams = { name: newTeam.name, plan: newTeam.plan };

    return axios.post(process.env.REACT_APP_API_URL + "/teams", teamParams, {
      headers: constructAuthHeaders(),
    });
  }

  static getCurrentTeam() {
    let team = localStorage.getItem("team");

    if (!team) {
      setDefaultTeam();
      team = localStorage.getItem("team");
    }

    return { data: JSON.parse(team) };
  }

  static getMemberships() {
    return axios.get(`${TEAMS_URL}/${getTeamId()}/memberships`, {
      headers: constructAuthHeaders(),
    });
  }

  static update(updates) {
    let team = localStorage.getItem("team");

    if (!team) {
      setDefaultTeam();
      team = localStorage.getItem("team");
    }

    team = JSON.parse(team);

    team = { ...team, ...updates, updated_at: new Date() };
    team = JSON.stringify(team);
    localStorage.setItem("team", team);
  }

  static getProfilePicture() {
    let team = localStorage.getItem("team");

    if (!team) {
      setDefaultTeam();
      team = localStorage.getItem("team");
    }

    team = JSON.parse(team);

    return team.image_url;
  }

  static updateProfilePicture(url) {
    let team = localStorage.getItem("team");

    if (!team) {
      setDefaultTeam();
      team = localStorage.getItem("team");
    }

    team = JSON.parse(team);

    team.image_url = url;
    team = JSON.stringify(team);

    return localStorage.setItem("team", team);
  }
}

function setDefaultTeam() {
  let team = { name: "Testing Team", image_url: null };
  localStorage.setItem("team", JSON.stringify(team));
}
