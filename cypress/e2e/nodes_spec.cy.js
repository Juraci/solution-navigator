describe('Solution Navigator', () => {
  const rootNodeUuid = '5b2fa173-b6d4-4e91-8c16-9c5ab76397b8';
  const leafNodeUuid = '860639dd-92ab-4220-9513-4488329db5dd';
  const initialState = {
    nodes: [
      {
        uuid: '860639dd-92ab-4220-9513-4488329db5dd',
        title: 'my child node level 1',
        content: '',
        resolved: false,
        childNodes: [],
        parentNode: 'd1d551f6-ff27-4bf5-86be-cc2fb5ca6caf',
        pomodoroCount: 0,
        createdAt: '2024-06-23T20:41:32.307Z',
        updatedAt: '2024-06-23T20:41:41.734Z',
      },
      {
        uuid: 'd1d551f6-ff27-4bf5-86be-cc2fb5ca6caf',
        title: 'my child node',
        content: '',
        resolved: false,
        childNodes: ['860639dd-92ab-4220-9513-4488329db5dd'],
        parentNode: '5b2fa173-b6d4-4e91-8c16-9c5ab76397b8',
        pomodoroCount: 0,
        createdAt: '2024-06-23T20:41:19.297Z',
        updatedAt: '2024-06-23T20:41:32.314Z',
      },
      {
        uuid: '5b2fa173-b6d4-4e91-8c16-9c5ab76397b8',
        title: 'my title',
        content: 'my content',
        resolved: false,
        childNodes: ['d1d551f6-ff27-4bf5-86be-cc2fb5ca6caf'],
        parentNode: null,
        pomodoroCount: 0,
        createdAt: '2024-06-23T20:25:52.892Z',
        updatedAt: '2024-06-23T20:41:19.326Z',
      },
    ],
  };

  it('creates nodes', () => {
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

  it('deletes nodes', () => {
    cy.visit(`/nodes/${rootNodeUuid}`, {
      onBeforeLoad(win) {
        win.localStorage.setItem('NodeStore', JSON.stringify(initialState));
      },
    });

    cy.get('[data-test-node-delete]').click();
    cy.get('.p-confirmdialog-accept-button').click();

    cy.get('[data-test-node-item]').should('have.length', 0);
  });

  it('creates nodes within nodes', () => {
    cy.visit(`/nodes/${leafNodeUuid}`, {
      onBeforeLoad(win) {
        win.localStorage.setItem('NodeStore', JSON.stringify(initialState));
      },
    });

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

  it('deletes nodes within nodes', () => {
    cy.visit(`/nodes/${rootNodeUuid}`, {
      onBeforeLoad(win) {
        win.localStorage.setItem('NodeStore', JSON.stringify(initialState));
      },
    });

    cy.get('[data-test-child-node-item]')
      .eq(0)
      .within(() => {
        cy.get('[data-test-child-node-delete]').click();
      });

    cy.get('[data-test-child-node-item]').should('have.length', 0);
  });

  it('see more details from a child node', () => {
    cy.visit(`/nodes/${rootNodeUuid}`, {
      onBeforeLoad(win) {
        win.localStorage.setItem('NodeStore', JSON.stringify(initialState));
      },
    });

    cy.get('[data-test-child-node-item]')
      .eq(1)
      .within(() => {
        cy.get('[data-test-child-node-show]').click();
      });

    cy.get('[data-test-node-title]').should('have.text', 'my child node level 1');
  });

  it('expands the node hidding the side panel', () => {
    cy.visit(`/nodes/${rootNodeUuid}`, {
      onBeforeLoad(win) {
        win.localStorage.setItem('NodeStore', JSON.stringify(initialState));
      },
    });

    cy.get('[data-test-node-expand]').click();
    cy.get('.side-panel').should('not.be.visible');
  });

  context('when the node does not exist', () => {
    it('displays a not found message', () => {
      cy.visit('/nodes/62090d47-3104-4d50-b384-54728a0208dd');

      cy.get('[data-test-node-not-found-message]').should('have.text', 'Node not found');
    });
  });

  it('go back to the root node', () => {
    cy.visit(`/nodes/${leafNodeUuid}`, {
      onBeforeLoad(win) {
        win.localStorage.setItem('NodeStore', JSON.stringify(initialState));
      },
    });

    cy.get('[data-test-node-go-back-to-root]').click();
    cy.url().should('include', `/nodes/${rootNodeUuid}`);
  });

  context('when a child node does not exist', () => {
    it('removes the reference from the parent node', () => {
      const customInitialState = {
        nodes: initialState.nodes.filter((n) => n.uuid !== leafNodeUuid),
      };

      cy.visit(`/nodes/${rootNodeUuid}`, {
        onBeforeLoad(win) {
          win.localStorage.setItem('NodeStore', JSON.stringify(customInitialState));
        },
      });

      cy.get('[data-test-child-node-item]').should('have.length', 1);
    });
  });
});
