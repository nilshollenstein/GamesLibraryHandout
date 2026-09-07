/// <reference types="cypress" />
/*
  Stellt sicher, dass die Suche mit allen möglichen Szenarien klarkommt
  Wenn hier Fehler auftauchen, könnte es die User-Experience verschlechtern
 */
describe('Erweiterte Suche', () => {
  beforeEach(() => {
    cy.visitApp();
  });

  it('übersteht eine Suche mit Sonderzeichen ohne Absturz', () => {
    cy.searchFor('%&"<>äöü#@').its('response.statusCode').should('eq', 200);
    cy.get('.game-list__status-title').should('contain.text', 'No Games Found');
  });

  it('übersteht eine Suche mit einem sehr langen Suchbegriff (250 Zeichen)', () => {
    const longTerm = 'x'.repeat(250);
    cy.searchFor(longTerm).its('response.statusCode').should('eq', 200);
    cy.get('.game-list__status-title').should('contain.text', 'No Games Found');
  });

  it('Suche wird nur durch Button oder Enter ausgelöst', () => {
    cy.intercept('GET', '/api/games/search*').as('search');

    cy.get('.search-bar__input').type('Portal');
    cy.get('@search.all').should('have.length', 0);

    cy.get('.search-bar__button').click();
    cy.wait('@search');
    cy.get('@search.all').should('have.length', 1);

    cy.get('.search-bar__input').type('{enter}');
    cy.wait('@search');
    cy.get('@search.all').should('have.length', 2);
  });
});
