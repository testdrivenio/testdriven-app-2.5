describe('Swagger', () => {
  it('should display the swagger docs correctly', () => {
    cy
      .visit('/')
      .get('h1').contains('All Users')
      .get('.navbar-burger').click()
      .get('a').contains('Swagger').click();

      cy.get('select > option').then((el) => {
        cy.location().then((loc) => {
          expect((el).text()).to.contain(loc.hostname);
        });
      });
  });
});
