import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  currentTeam: {
    members: [],
    subscription: {
      plan_name: "Starter",
      status: "active",
      stripe_price_id: null,
      stripe_product_id: null,
      stripe_subscription_id: null,
      team_id: 1,
      user_id: 1,
      created_at: "2022-02-13T03:02:23.470Z",
      updated_at: "2022-02-13T03:02:23.470Z",
    },
    team: {
      created_at: "2022-02-13T03:02:22.554Z",
      updated_at: "2022-02-13T03:02:22.554Z",
      id: 1,
      image_url: null,
      name: "Testing Team",
    },
  },
  currentUser: {
    email: "testing@cadencechords.com",
    first_name: "Test",
    last_name: "User",
    id: 1,
    timezone: "America/New_York",
    phone_number: "(111) 111-1111",
    uid: "testing@cadencechords.com",
    image_url: null,
    role: {
      id: 1,
      name: "Admin",
      description: "Members in this role have full access and privileges.",
      team_id: 1,
      created_at: "2022-02-13T03:02:22.584Z",
      updated_at: "2022-02-13T03:02:22.584Z",
      is_admin: true,
      is_member: false,
      permissions: [
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
          description:
            "Allow user to view and download files attached to a song",
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
      ],
    },
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },

    setCurrentTeam: (state, action) => {
      state.currentTeam = action.payload;
    },

    setMembership: (state, action) => {
      state.currentUser.role = action.payload.role;
    },

    updatePosition: (state, action) => {
      let members = state.currentTeam.members;
      let myId = action.payload.id;
      let me = members.find((m) => m.id === myId);
      me.position = action.payload.position;
    },

    logOut: (state) => {},
  },
});

export const {
  setCurrentUser,
  setCurrentTeam,
  logOut,
  setMembership,
  updatePosition,
} = authSlice.actions;

export default authSlice.reducer;

export const selectCredentials = (state) => {
  return {
    accessToken: state.auth.accessToken,
    client: state.auth.client,
    uid: state.auth.uid,
  };
};

export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectCurrentTeam = (state) => state.auth.currentTeam;
export const selectCurrentMember = (state) => {
  let permissions = state.auth.currentUser.role?.permissions?.map(
    (permission) => permission.name
  );
  return {
    permissions,
    ...state.auth.currentUser,
    can: () => {
      return true;
    },
  };
};

export const selectHasCredentials = (state) =>
  state.auth.accessToken && state.auth.client && state.auth.uid;
