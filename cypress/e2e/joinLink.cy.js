/// <reference types="cypress" />
const admin = {
  id: 4,
  email: 'join_link_team_owner@cadencechords.com',
  password: 'join_link_team_owner_password',
};

const memberToJoin = {
  id: 3,
  email: 'join_link_test@cadencechords.com',
  password: 'join_link_test_user_password',
};

const teamToJoin = {
  id: 4,
  joinLink: '0ebef1eeb5fc14338a3d',
};

describe('Join Link Page', () => {
  it('Allows a user to join a team by visiting the join link', () => {
    cy.login(memberToJoin.email, memberToJoin.password);
    cy.visit(`/join/${teamToJoin.joinLink}`);

    cy.findByText(/you are now joining/i);
    cy.findByText(memberToJoin.email);
    cy.findByRole('button', { name: /join/i }).click();

    cy.findByText(/hi join_link_test@cadencechords.com!/i);

    cleanup();
  });

  function cleanup() {
    cy.login(admin.email, admin.password);
    cy.get('@credentials').then(credentials => {
      cy.request({
        method: 'DELETE',
        url: `${Cypress.env('API_URL')}/users/${memberToJoin.id}/memberships/${
          teamToJoin.id
        }`,
        headers: credentials,
      });
    });
  }

  it('Requires the user to login if no credentials are found', () => {
    cy.visit(`/join/${teamToJoin.joinLink}`);
    cy.findByText(/you need to be logged in first/i);

    cy.findByPlaceholderText('email').type(memberToJoin.email);
    cy.findByPlaceholderText('password').type(memberToJoin.password);
    cy.findByRole('button', { name: /login/i }).click();

    cy.findByText(/you are now joining/i);
    cy.findByText(memberToJoin.email);
    cy.findByRole('button', { name: /join/i }).click();

    cy.findByText(/hi join_link_test@cadencechords.com!/i);

    cleanup();
  });

  it('Does not allow joining team if already on team', () => {
    cy.login(admin.email, admin.password);
    cy.visit(`/join/${teamToJoin.joinLink}`);

    cy.findByText(/you're already on/i);
    cy.findByRole('button', { name: /go to team/i }).click();

    cy.findByText(`Hi ${admin.email}!`);
  });

  it('Allows for signing in as another user if already on team', () => {
    cy.login(admin.email, admin.password);
    cy.visit(`/join/${teamToJoin.joinLink}`);

    cy.findByText(/you're already on/i);
    cy.findByRole('button', { name: /use other user/i }).click();

    cy.findByPlaceholderText('email').type(memberToJoin.email);
    cy.findByPlaceholderText('password').type(memberToJoin.password);
    cy.findByRole('button', { name: /login/i }).click();

    cy.findByText(/you are now joining/i);
    cy.findByRole('button', { name: /join/i }).click();

    cy.findByText(/hi join_link_test@cadencechords.com!/i);

    cleanup();
  });
});
