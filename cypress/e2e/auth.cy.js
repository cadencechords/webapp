/// <reference types="cypress" />
import * as cheerio from 'cheerio';

const userToSignUp = {
  email: 'sign_up_user@cadencechords.testinator.com',
  password: 'cadence chords password',
};

describe('login', () => {
  it('Reroutes to the login page if no credentials found in local storage', () => {
    cy.visit('/');
    cy.findByText(/login to your account/i);

    cy.url().should('equal', `${Cypress.config().baseUrl}/login`);
  });
});

describe('sign up', () => {
  it.only('Allows signing up for a new account', () => {
    setupAndDeleteUser();

    cy.visit('/login');

    cy.findByRole('link', { name: 'sign up' }).click();
    cy.findByPlaceholderText('email').type(userToSignUp.email);
    cy.findByPlaceholderText('password').type(userToSignUp.password);
    cy.findByPlaceholderText('enter your password again').type(
      userToSignUp.password
    );

    cy.findByRole('button', { name: /sign up/i })
      .should('be.enabled')
      .click();

    cy.findByText(/thanks for signing up!/i);

    cy.wait(2000);

    const inboxName = getInboxNameFromEmail(userToSignUp.email);
    cy.getInbox(inboxName);

    cy.get('@inbox').then(inbox => {
      let { id, to } = inbox.msgs[0];

      cy.getMessageFromInbox(id, to);

      cy.get('@message').then(message => {
        const { body } = message.parts[0];

        const $ = cheerio.load(body);
        const href = $('a').prop('href');

        cy.visit(href);

        cy.findByRole('button', { name: /login/i }).click();

        cy.findByText(/login to your account/i);
        cy.findByPlaceholderText('email').type(userToSignUp.email);
        cy.findByPlaceholderText('password').type(userToSignUp.password);
        cy.findByRole('button', { name: /login/i }).click();

        cy.findByText(/Looks like you aren't a part of any teams yet/i);

        setupAndDeleteUser();
      });
    });
  });

  function setupAndDeleteUser() {
    const inboxName = getInboxNameFromEmail(userToSignUp.email);
    cy.clearInbox(inboxName);
    cy.login(userToSignUp.email, userToSignUp.password, {
      failOnStatusCode: false,
    });

    cy.get('@credentials').then(credentials => {
      cy.request({
        method: 'DELETE',
        url: `${Cypress.env('API_URL')}/users/me`,
        headers: credentials,
        failOnStatusCode: false,
      });
    });
  }
});

function getInboxNameFromEmail(email) {
  return email?.split('@')?.[0];
}
