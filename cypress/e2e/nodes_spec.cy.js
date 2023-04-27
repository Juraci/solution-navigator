describe('Solution Navigator', () => {
  it('creates nodes', () => {
    cy.visit('/');

    const title = 'Persist the items in the store';

    cy.get('[data-test-input]').type('Persist the items in the store');
    cy.get('[data-test-btn]').click();

    cy.get('[data-test-node-item]').should('have.length', 1);
    cy.get('[data-test-node-item]').eq(0).find('[data-test-node-title]').should('have.text', title);
  });
});
