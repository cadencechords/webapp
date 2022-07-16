/// <reference types="cypress" />

import '@testing-library/cypress/add-commands';

Cypress.Commands.add('login', function login(email, password, options = {}) {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('API_URL')}/auth/sign_in`,
    body: { email, password },
    ...options,
  })
    .then(response => {
      localStorage.setItem('uid', response.headers.uid);
      localStorage.setItem('access-token', response.headers['access-token']);
      localStorage.setItem('client', response.headers.client);

      return {
        'access-token': response.headers['access-token'],
        client: response.headers.client,
        uid: response.headers.uid,
      };
    })
    .as('credentials');
});

Cypress.Commands.add('getInbox', function getInbox(inbox) {
  cy.request({
    url: `https://mailinator.com/api/v2/domains/private/inboxes/${inbox}`,
    method: 'GET',
    headers: {
      Authorization: Cypress.env('MAILINATOR_API_KEY'),
    },
  })
    .then(response => response.body)
    .as('inbox');
});

Cypress.Commands.add(
  'getMessageFromInbox',
  function getMessageFromInbox(messageId, inboxName) {
    cy.request({
      url: `https://mailinator.com/api/v2/domains/private/inboxes/${inboxName}/messages/${messageId}`,
      method: 'GET',
      headers: {
        Authorization: Cypress.env('MAILINATOR_API_KEY'),
      },
    })
      .then(response => response.body)
      .as('message');
  }
);

Cypress.Commands.add('clearInbox', function clearInbox(inbox) {
  cy.request({
    url: `https://mailinator.com/api/v2/domains/private/inboxes/${inbox}`,
    method: 'DELETE',
    headers: {
      Authorization: Cypress.env('MAILINATOR_API_KEY'),
    },
  });
});
