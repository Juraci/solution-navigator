describe('Solution Navigator', () => {
  it('creates nodes', () => {
    cy.visit('/');

    const title = 'Persist the items in the store';

    cy.get('[data-test-input]').type('Persist the items in the store');
    cy.get('[data-test-btn]').click();

    cy.get('[data-test-node-item]').should('have.length', 1);
    cy.get('.p-card').eq(0).find('.p-card-title').should('have.text', title);
    cy.get('[data-test-input]').should('have.value', '');
  });
});
