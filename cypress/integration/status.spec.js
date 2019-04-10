const randomstring = require('randomstring');

const username = randomstring.generate();
const email = `${username}@test.com`;
const password = 'greaterthanten';


describe('Status', () => {
  it('should not display user info if a user is not logged in', () => {
    cy
      .visit('/status')
      .get('p').contains('You must be logged in to view this.')
      .get('a').contains('User Status').should('not.be.visible')
      .get('a').contains('Log Out').should('not.be.visible')
      .get('a').contains('Register')
      .get('a').contains('Log In');
  });

  it('should display user info if a user is logged in', () => {
    // register user
    cy
      .visit('/register')
      .get('input[name="username"]').type(username)
      .get('input[name="email"]').type(email)
      .get('input[name="password"]').type(password)
      .get('input[type="submit"]').click()
      .get('.navbar-burger').click();

    cy.wait(500);

    // assert '/status' is displayed properly
    cy.visit('/status');
    cy.get('.navbar-burger').click();
    cy.contains('User Status').click();
    cy.get('li > strong').contains('User ID:')
      .get('li > strong').contains('Email:')
      .get('li').contains(email)
      .get('li > strong').contains('Username:')
      .get('li').contains(username)
      .get('a').contains('User Status')
      .get('a').contains('Log Out')
      .get('a').contains('Register').should('not.be.visible')
      .get('a').contains('Log In').should('not.be.visible');
  });
});
