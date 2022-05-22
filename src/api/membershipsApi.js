import UserOne from "../images/user 1.jpg";
import UserTwo from "../images/user 2.jpeg";
import UserThree from "../images/user 3.jpeg";
import UserFour from "../images/user 4.jpeg";
import UserFive from "../images/user 5.jpeg";
import UserSix from "../images/user 6.jpeg";
import RolesApi from "./rolesApi";

export default class MembershipsApi {
  static assignRole(memberId, roleId) {
    let { data: member } = this.getOne(memberId);
    member.role = roleId;

    let members = JSON.parse(localStorage.getItem("members"));

    members = members.map((m) => (m.id === member.id ? member : m));
    this.setAllMembersInStorage(members);
  }

  static assignBulkRole(memberIds = [], roleId) {
    const parsedId = parseInt(roleId);

    let { data: allMembers } = this.getAllWithoutMe();
    allMembers.forEach((m) => {
      if (memberIds.includes(m.id)) {
        m.role = parsedId;
      }
    });

    this.setAllMembersInStorage(allMembers);

    let assignedMembers = allMembers.filter((m) => memberIds.includes(m.id));

    return { data: assignedMembers };
  }

  static getOne(id) {
    let parsedId = parseInt(id);
    let { data: members } = this.getAll();
    let member = members?.find((m) => m.id === parsedId);

    return { data: member };
  }

  static getAll() {
    let members = localStorage.getItem("members");

    if (!members) {
      setDefaultMembers();
      members = localStorage.getItem("members");
    }

    let { data: me } = this.getMyMember();

    let { data: roles } = RolesApi.getAll();

    members = [me, ...JSON.parse(members)];

    members.forEach((m) => {
      m.role = roles.find((r) => r.id === m.role);
    });

    return { data: members };
  }

  static getAllWithoutMe() {
    let members = localStorage.getItem("members");

    if (!members) {
      setDefaultMembers();
      members = localStorage.getItem("members");
    }

    members = JSON.parse(members);

    return { data: members };
  }

  static getMyMember() {
    let me = localStorage.getItem("me");

    if (!me) {
      setDefaultMe();
      me = localStorage.getItem("me");
    }

    me = JSON.parse(me);
    return { data: me };
  }

  static updateMyMember(updates) {
    let { data: me } = this.getMyMember();
    me = { ...me, ...updates };

    localStorage.setItem("me", JSON.stringify(me));
  }

  static deleteById(id) {
    let parsedId = parseInt(id);
    let { data: members } = this.getAllWithoutMe();
    members = members.filter((m) => m.id !== parsedId);

    this.setAllMembersInStorage(members);
  }

  static setAllMembersInStorage(members) {
    let stringified = JSON.stringify(members);
    localStorage.setItem("members", stringified);
  }
}

function setDefaultMe() {
  localStorage.setItem(
    "me",
    JSON.stringify({
      id: 1,
      email: "testing@cadencechords.com",
      first_name: "Test",
      last_name: "User",
      image_url: null,
      position: "Leader",
      joined_team_at: "2022-02-13T03:02:22.694Z",
      created_at: "2022-02-13T03:02:22.694Z",
      phone_number: "202-555-0128",
      role: 1,
    })
  );
}

function setDefaultMembers() {
  localStorage.setItem(
    "members",
    JSON.stringify([
      {
        id: 2,
        email: "clintonclark@gmail.com",
        first_name: "Clinton",
        last_name: "Clark",
        image_url: UserOne,
        position: "Singer",
        joined_team_at: "2022-02-15T03:02:22.694Z",
        created_at: "2022-02-15T03:02:22.694Z",
        role: 2,
      },
      {
        id: 3,
        email: "deannaroberts@gmail.com",
        first_name: "Deanna",
        last_name: "Roberts",
        image_url: UserSix,
        position: "Singer",
        joined_team_at: "2022-02-15T03:02:22.694Z",
        created_at: "2022-02-15T03:02:22.694Z",
        role: 2,
      },
      {
        id: 4,
        email: "marysmith@gmail.com",
        first_name: "Mary",
        last_name: "Pedrott",
        image_url: UserThree,
        position: "PIANIST",
        joined_team_at: "2022-02-15T03:02:22.694Z",
        created_at: "2022-02-15T03:02:22.694Z",
        role: 2,
      },
      {
        id: 5,
        email: "mattscott@gmail.com",
        first_name: "Matthew",
        last_name: "Scott",
        image_url: UserTwo,
        position: "Drummer",
        joined_team_at: "2022-02-14T03:02:22.694Z",
        created_at: "2022-02-14T03:02:22.694Z",
        role: 2,
      },
      {
        id: 6,
        email: "daleleroy@gmail.com",
        first_name: "Dale",
        last_name: "Leroy",
        image_url: UserFive,
        position: "Acoustic Guitarist",
        joined_team_at: "2022-02-15T03:02:22.694Z",
        created_at: "2022-02-15T03:02:22.694Z",
        role: 2,
      },
      {
        id: 7,
        email: "nancymcmanis@gmail.com",
        first_name: "Nancy",
        last_name: "McManis",
        image_url: UserFour,
        position: "Bass",
        created_at: "2022-02-15T03:02:22.694Z",
        role: 2,
      },
    ])
  );
}
