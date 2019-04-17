describe('Swagger', () => {
  it('should display the swagger docs correctly', () => {
    cy
      .visit('/')
      .get('.navbar-burger').click()
      .get('a').contains('Swagger').click();

      cy.get('select > option').then((el) => {
        expect((el).text()).to.contain(Cypress.env('LOAD_BALANCER_DNS_NAME'));
      });
  });
});
