describe('Solution Navigator', () => {
  it('allows the creation of nodes', () => {
    cy.visit('/');

    const title = 'Persist the items in the store';

    cy.get('[data-test-create-node]').click();
    cy.get('[data-test-node-item]').should('have.length', 1);
    cy.url().should('include', '/nodes/');

    cy.get('[data-test-node-title]').click();
    cy.get('[data-test-node-title]').type('Persist the items in the store');
    cy.get('[data-test-node-title]').type('{enter}');

    cy.get('[data-test-node-content]').dblclick();
    cy.get('[data-test-node-content]').type('Use localstorage for persistence');

    cy.get('.p-card').eq(0).find('.p-card-title').should('have.text', title);
  });

  it('allows the delition of nodes', () => {
    cy.visit('/');
    cy.get('[data-test-create-node]').click();

    cy.get('[data-test-node-delete]').click();
    cy.get('.p-confirm-dialog-accept').click();

    cy.get('[data-test-node-item]').should('have.length', 0);
  });

  context('when the node does not exist', () => {
    it('displays a not found message and a link back to home', () => {
      cy.visit('/nodes/62090d47-3104-4d50-b384-54728a0208dd');

      cy.get('[data-test-node-not-found-message]').should('have.text', 'Node not found');
    });
  });
});
