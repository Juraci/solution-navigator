describe('Solution Navigator', () => {
  it('creates nodes', () => {
    cy.visit('/');

    const title = 'Persist the items in the store';

    cy.get('[data-test-create-node]').click();
    cy.url().should('include', '/nodes/');

    cy.get('[data-test-node-title]').type('Persist the items in the store');
    cy.get('[data-test-node-title-save]').click();
    cy.get('[data-test-node-content]').type('User localstorage for persistence');

    cy.get('[data-test-node-item]').should('have.length', 1);
    cy.get('.p-card').eq(0).find('.p-card-title').should('have.text', title);
  });
});
