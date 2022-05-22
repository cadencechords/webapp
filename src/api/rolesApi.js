import PermissionsApi from "./permissionsApi";
import MembershipsApi from "./membershipsApi";

export default class RolesApi {
  static getAll() {
    let roles = localStorage.getItem("roles");

    if (!roles) {
      setDefaultRoles();
      roles = localStorage.getItem("roles");
    }

    roles = JSON.parse(roles);

    return { data: roles };
  }

  static getOne(id) {
    let parsedId = parseInt(id);
    let { data: roles } = this.getAll();

    let role = roles.find((r) => r.id === parsedId);

    return { data: role };
  }

  static addPermission(roleId, permissionName) {
    let { data: allPermissions } = PermissionsApi.getAll();
    let { data: role } = this.getOne(roleId);

    let permissionToAdd = allPermissions.find((p) => p.name === permissionName);
    role.permissions.push(permissionToAdd);

    this.setRoleInStorage(role);
  }

  static removePermission(roleId, permissionName) {
    let { data: role } = this.getOne(roleId);

    role.permissions = role.permissions.filter(
      (p) => p.name !== permissionName
    );

    this.setRoleInStorage(role);
  }

  static updateOne(updates, roleId) {
    let { data: role } = this.getOne(roleId);

    role = { ...role, ...updates, updated_at: new Date() };
    this.setRoleInStorage(role);

    return { data: role };
  }

  static setRoleInStorage(role) {
    let { data: roles } = this.getAll();
    roles = roles.map((r) => (r.id === role.id ? role : r));
    this.setAllRolesInStorage(roles);
  }

  static createOne(newRole) {
    let { data: allRoles } = this.getAll();
    let nextId = this.calculateNextId(allRoles.map((r) => r.id));

    let role = {
      id: nextId,
      permissions: PermissionsApi.getMemberPermissions().data,
      ...newRole,
      created_at: new Date(),
      updated_at: new Date(),
    };

    allRoles.push(role);
    this.setAllRolesInStorage(allRoles);

    return { data: role };
  }

  static calculateNextId(ids) {
    let max = Math.max(...ids);
    return isFinite(max) ? max + 1 : 3;
  }

  static setAllRolesInStorage(roles) {
    let stringified = JSON.stringify(roles);
    localStorage.setItem("roles", stringified);
  }

  static deleteOne(roleId) {
    let parsedId = parseInt(roleId);
    let { data: roles } = this.getAll();
    let roleToDelete = roles.find((r) => r.id === parsedId);

    let { data: members } = MembershipsApi.getAllWithoutMe();
    let membersInThisRole = members.filter((m) => m.role === roleToDelete.id);
    let memberIds = membersInThisRole.map((m) => m.id);

    let memberRole = roles.find((r) => r.name === "Member");
    MembershipsApi.assignBulkRole(memberIds, memberRole.id);

    roles = roles.filter((r) => r.id !== roleToDelete.id);

    this.setAllRolesInStorage(roles);
  }
}

function setDefaultRoles() {
  localStorage.setItem(
    "roles",
    JSON.stringify([
      {
        created_at: "2022-02-10T05:52:53.047Z",
        updated_at: "2022-02-10T05:52:53.047Z",
        description: "Members in this role have full access and privileges.",
        id: 1,
        is_admin: true,
        is_member: false,
        name: "Admin",
        memberships: [],
        permissions: PermissionsApi.getAll().data,
      },
      {
        created_at: "2022-02-10T05:52:53.047Z",
        description:
          "Members in this role have read only access to songs, binders and sets. Members receive this role by default when they join a team.",
        id: 2,
        is_admin: false,
        is_member: true,
        name: "Member",
        updated_at: "2022-02-10T05:52:53.047Z",
        memberships: [],
        permissions: PermissionsApi.getMemberPermissions().data,
      },
    ])
  );
}
