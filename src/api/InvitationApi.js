export default class InvitationApi {
  static createOne({ email }) {
    let { data: allInvitations } = this.getAll();
    let nextId = this.calculateNextId(allInvitations.map((i) => i.id));

    let invitation = {
      id: nextId,
      email,
      created_at: new Date(),
      updated_at: new Date(),
    };

    allInvitations.push(invitation);
    this.setAllInvitesInStorage(allInvitations);

    return { data: invitation };
  }

  static calculateNextId(ids) {
    let max = Math.max(...ids);
    return isFinite(max) ? max + 1 : 1;
  }

  static setAllInvitesInStorage(invitations) {
    let stringified = JSON.stringify(invitations);
    localStorage.setItem("invitations", stringified);
  }

  static setInviteInStorage(invitation) {
    let { data: invitations } = this.getAll();
    invitations = invitations.map((i) =>
      i.id === invitation.id ? invitation : i
    );
    this.setAllInvitesInStorage(invitations);
  }

  static getAll() {
    let invitations = localStorage.getItem("invitations");

    if (!invitations) {
      localStorage.setItem("invitations", "[]");
      invitations = [];
    } else {
      invitations = JSON.parse(invitations);
    }

    return { data: invitations };
  }

  static deleteOne(invitationId) {
    let parsedId = parseInt(invitationId);
    let { data: invitations } = this.getAll();
    invitations = invitations.filter((i) => i.id !== parsedId);

    this.setAllInvitesInStorage(invitations);
  }
}
