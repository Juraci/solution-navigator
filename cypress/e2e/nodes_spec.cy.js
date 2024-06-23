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

  it('allows the deletion of nodes', () => {
    cy.visit('/');
    cy.get('[data-test-create-node]').click();

    cy.get('[data-test-node-delete]').click();
    cy.get('.p-confirm-dialog-accept').click();

    cy.get('[data-test-node-item]').should('have.length', 0);
  });

  it('allows the creation of nodes within nodes', () => {
    cy.visit('/');

    cy.get('[data-test-create-node]').click();

    cy.get('[data-test-node-add-child-node]').click();

    cy.get('[data-test-child-node-item]').should('have.length', 1);

    cy.get('[data-test-child-node-item]').within(() => {
      cy.get('[data-test-child-node-edit]').click();
      cy.get('[data-test-child-node-title]').type('This is a sub task');
      cy.get('[data-test-child-node-title]').type('{enter}');
      cy.get('[data-test-child-node-title]').should('have.text', 'This is a sub task');
      cy.get('[data-test-child-node-add-child-node]').click();
    });

    cy.get('[data-test-child-node-item]').should('have.length', 2);
    cy.get('[data-test-child-node-item]')
      .eq(1)
      .within(() => {
        cy.get('[data-test-child-node-edit]').click();
        cy.get('[data-test-child-node-title]').type('This is a sub task lvl 2');
        cy.get('[data-test-child-node-title]').type('{enter}');
        cy.get('[data-test-child-node-title]').should('have.text', 'This is a sub task lvl 2');
      });
  });

  it('allows deleting nodes within nodes', () => {
    cy.visit('/');

    cy.get('[data-test-create-node]').click();

    cy.get('[data-test-node-add-child-node]').click();

    cy.get('[data-test-child-node-item]').should('have.length', 1);

    cy.get('[data-test-child-node-item]').within(() => {
      cy.get('[data-test-child-node-edit]').click();
      cy.get('[data-test-child-node-title]').type('This is a sub task');
      cy.get('[data-test-child-node-title]').type('{enter}');
      cy.get('[data-test-child-node-title]').should('have.text', 'This is a sub task');
      cy.get('[data-test-child-node-delete]').click();
    });

    cy.get('[data-test-child-node-item]').should('have.length', 0);
  });

  it('allows seeing more details from a child node', () => {
    cy.visit('/');

    cy.get('[data-test-create-node]').click();

    cy.get('[data-test-node-add-child-node]').click();

    cy.get('[data-test-child-node-item]').should('have.length', 1);

    cy.get('[data-test-child-node-item]').within(() => {
      cy.get('[data-test-child-node-edit]').click();
      cy.get('[data-test-child-node-title]').type('This is a sub task');
      cy.get('[data-test-child-node-title]').type('{enter}');
      cy.get('[data-test-child-node-title]').should('have.text', 'This is a sub task');
      cy.get('[data-test-child-node-show]').click();
    });

    cy.get('[data-test-node-title]').should('have.text', 'This is a sub task');
  });

  context('when the node does not exist', () => {
    it('displays a not found message and a link back to home', () => {
      cy.visit('/nodes/62090d47-3104-4d50-b384-54728a0208dd');

      cy.get('[data-test-node-not-found-message]').should('have.text', 'Node not found');
    });
  });
});
