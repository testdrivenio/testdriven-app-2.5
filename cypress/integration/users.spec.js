describe('All Users', () => {
  it('should display the all-users page correctly if a user is not logged in', () => {
    cy
      .visit('/all-users')
      .get('h1').contains('All Users')
      .get('.navbar-burger').click()
      .get('a').contains('User Status').should('not.be.visible')
      .get('a').contains('Log Out').should('not.be.visible')
      .get('a').contains('Register')
      .get('a').contains('Log In')
      .get('a').contains('Swagger')
      .get('a').contains('Users')
      .get('.notification.is-success').should('not.be.visible');
  });
});
