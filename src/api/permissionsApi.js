export default class PermissionsApi {
  static getAll() {
    return { data: permissions };
  }

  static getOne(id) {
    return { data: permissions.find((p) => p.id === id) };
  }

  static getMemberPermissions() {
    let memberPermissions = permissions.filter((p) => p.name.includes("View"));
    return { data: memberPermissions };
  }
}

const permissions = [
  {
    id: 1,
    name: "View songs",
    description: "Allow user to view all songs",
    created_at: "2021-09-12T05:49:49.194Z",
    updated_at: "2021-09-12T05:49:49.194Z",
  },
  {
    id: 2,
    name: "Edit songs",
    description: "Allow user to edit any songs",
    created_at: "2021-09-12T05:49:49.204Z",
    updated_at: "2021-09-12T05:49:49.204Z",
  },
  {
    id: 3,
    name: "Delete songs",
    description: "Allow user to delete any songs",
    created_at: "2021-09-12T05:49:49.210Z",
    updated_at: "2021-09-12T05:49:49.210Z",
  },
  {
    id: 4,
    name: "Add songs",
    description: "Allow user to create or import songs",
    created_at: "2021-09-12T05:49:49.228Z",
    updated_at: "2021-09-12T05:49:49.228Z",
  },
  {
    id: 5,
    name: "View binders",
    description: "Allow user to view all binders",
    created_at: "2021-09-12T05:49:49.234Z",
    updated_at: "2021-09-12T05:49:49.234Z",
  },
  {
    id: 6,
    name: "Edit binders",
    description: "Allow user to edit any binders",
    created_at: "2021-09-12T05:49:49.242Z",
    updated_at: "2021-09-12T05:49:49.242Z",
  },
  {
    id: 7,
    name: "Delete binders",
    description: "Allow user to delete any binders",
    created_at: "2021-09-12T05:49:49.248Z",
    updated_at: "2021-09-12T05:49:49.248Z",
  },
  {
    id: 8,
    name: "Add binders",
    description: "Allow user to create binders",
    created_at: "2021-09-12T05:49:49.254Z",
    updated_at: "2021-09-12T05:49:49.254Z",
  },
  {
    id: 9,
    name: "View sets",
    description: "Allow user to view all sets",
    created_at: "2021-09-12T05:49:49.259Z",
    updated_at: "2021-09-12T05:49:49.259Z",
  },
  {
    id: 10,
    name: "Edit sets",
    description: "Allow user to edit any sets",
    created_at: "2021-09-12T05:49:49.264Z",
    updated_at: "2021-09-12T05:49:49.264Z",
  },
  {
    id: 11,
    name: "Delete sets",
    description: "Allow user to delete any sets",
    created_at: "2021-09-12T05:49:49.269Z",
    updated_at: "2021-09-12T05:49:49.269Z",
  },
  {
    id: 12,
    name: "Add sets",
    description: "Allow user to create sets",
    created_at: "2021-09-12T05:49:49.275Z",
    updated_at: "2021-09-12T05:49:49.275Z",
  },
  {
    id: 13,
    name: "Publish sets",
    description: "Allow user to publish sets",
    created_at: "2021-09-12T05:49:49.281Z",
    updated_at: "2021-09-12T05:49:49.281Z",
  },
  {
    id: 14,
    name: "Edit team",
    description:
      "Allow user to edit team information like name and profile picture",
    created_at: "2021-09-12T05:49:49.288Z",
    updated_at: "2021-09-12T05:49:49.288Z",
  },
  {
    id: 15,
    name: "Delete team",
    description: "Allow user to delete team",
    created_at: "2021-09-12T05:49:49.293Z",
    updated_at: "2021-09-12T05:49:49.293Z",
  },
  {
    id: 16,
    name: "Add members",
    description:
      "Allow user to add members to the team and resend or cancel invitations",
    created_at: "2021-09-12T05:49:49.301Z",
    updated_at: "2021-09-12T05:49:49.301Z",
  },
  {
    id: 17,
    name: "Remove members",
    description: "Allow user to remove members from the team",
    created_at: "2021-09-12T05:49:49.307Z",
    updated_at: "2021-09-12T05:49:49.307Z",
  },
  {
    id: 18,
    name: "View roles",
    description: "Allow user to view the role configuration page",
    created_at: "2021-09-12T05:49:49.313Z",
    updated_at: "2021-09-12T05:49:49.313Z",
  },
  {
    id: 19,
    name: "Add roles",
    description: "Allow user to create new roles in the team",
    created_at: "2021-09-12T05:49:49.319Z",
    updated_at: "2021-09-12T05:49:49.319Z",
  },
  {
    id: 20,
    name: "Delete roles",
    description: "Allow user to delete roles in the team",
    created_at: "2021-09-12T05:49:49.325Z",
    updated_at: "2021-09-12T05:49:49.325Z",
  },
  {
    id: 21,
    name: "Edit roles",
    description:
      "Allow user to edit roles, such as adding and removing permissions to the role",
    created_at: "2021-09-12T05:49:49.330Z",
    updated_at: "2021-09-12T05:49:49.330Z",
  },
  {
    id: 22,
    name: "Assign roles",
    description: "Allow user to assign roles to other members",
    created_at: "2021-09-12T05:49:49.335Z",
    updated_at: "2021-09-12T05:49:49.335Z",
  },
  {
    id: 23,
    name: "View events",
    description: "Allow user to view events on a calendar",
    created_at: "2021-10-14T23:05:13.125Z",
    updated_at: "2021-10-14T23:05:13.125Z",
  },
  {
    id: 24,
    name: "Add events",
    description: "Allow user to add events to the calendar",
    created_at: "2021-10-14T23:05:13.133Z",
    updated_at: "2021-10-14T23:05:13.133Z",
  },
  {
    id: 25,
    name: "Delete events",
    description: "Allow user to delete events from the calendar",
    created_at: "2021-10-14T23:05:13.139Z",
    updated_at: "2021-10-14T23:05:13.139Z",
  },
  {
    id: 26,
    name: "Edit events",
    description:
      "Allow user to edit events, such as modifying notifications and members",
    created_at: "2021-10-14T23:05:13.145Z",
    updated_at: "2021-10-14T23:05:13.145Z",
  },
  {
    id: 27,
    name: "View files",
    description: "Allow user to view and download files attached to a song",
    created_at: "2021-11-01T21:19:34.351Z",
    updated_at: "2021-11-01T21:19:34.351Z",
  },
  {
    id: 28,
    name: "Add files",
    description: "Allow user to attach files to a song",
    created_at: "2021-11-01T21:19:34.372Z",
    updated_at: "2021-11-01T21:19:34.372Z",
  },
  {
    id: 29,
    name: "Delete files",
    description: "Allow user to delete and unattach files from a song",
    created_at: "2021-11-01T21:19:34.388Z",
    updated_at: "2021-11-01T21:19:34.388Z",
  },
  {
    id: 30,
    name: "Edit files",
    description: "Allow user to edit file names attached to a song",
    created_at: "2021-11-01T21:19:34.398Z",
    updated_at: "2021-11-01T21:19:34.398Z",
  },
];
