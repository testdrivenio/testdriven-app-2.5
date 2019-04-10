const randomstring = require('randomstring');

const username = randomstring.generate();
const email = `${username}@test.com`;
const password = 'greaterthanten';


describe('Message', () => {
  it(`should display flash messages correctly`, () => {
    // register user
    cy
      .visit('/register')
      .get('input[name="username"]').type(username)
      .get('input[name="email"]').type(email)
      .get('input[name="password"]').type(password)
      .get('input[type="submit"]').click()

    // assert flash messages are removed when user clicks the 'x'
    cy
      .get('.notification.is-success').contains('Welcome!')
      .get('.delete').click()
      .get('.notification.is-success').should('not.be.visible');

    // log a user out
    cy.get('.navbar-burger').click();
    cy.contains('Log Out').click();

    // attempt to log in
    cy
      .visit('/login')
      .get('input[name="email"]').type('incorrect@email.com')
      .get('input[name="password"]').type(password)
      .get('input[type="submit"]').click();

    // assert correct message is flashed
    cy
      .get('.notification.is-success').should('not.be.visible')
      .get('.notification.is-danger').contains('User does not exist.');

    // log a user in
    cy
      .get('input[name="email"]').clear().type(email)
      .get('input[name="password"]').clear().type(password)
      .get('input[type="submit"]').click()
      .wait(100);

    // assert flash message is removed when a new message is flashed
    cy
      .get('.notification.is-success').contains('Welcome!')
      .get('.notification.is-danger').should('not.be.visible');


    // log a user out
    cy.get('.navbar-burger').click();
    cy.contains('Log Out').click();

    // log a user in
    cy
      .contains('Log In').click()
      .get('input[name="email"]').type(email)
      .get('input[name="password"]').type(password)
      .get('input[type="submit"]').click()
      .wait(100);

    // assert flash message is removed after three seconds
    cy
      .get('.notification.is-success').contains('Welcome!')
      .wait(4000)
      .get('.notification.is-success').should('not.be.visible');
  });
});
