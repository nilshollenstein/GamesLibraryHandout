/// <reference types="cypress" />
/*
* Fehler sorgen nicht dafür dass die App abstürzt und die Experience des Nutzers nicht unterbrochen wird
* Ausserdem geht es sicher, dass keine falschen Daten gespeichert werden
* */
describe('Fehlerbehandlung', () => {
  const uniqueSuffix = () => Date.now().toString();

  it('zeigt Fehlermeldung an, wenn erster Load einen 500-Error erhält', () => {
    cy.intercept('GET', '/api/games', {
      statusCode: 500,
      body: { error: 'Internal Server Error' },
    }).as('getGamesError');

    cy.visit('/');
    cy.wait('@getGamesError');

    cy.get('.home-page__error')
      .should('be.visible')
      .and('contain.text', 'Fehler beim Laden der Spiele.');
  });

  it('zeigt eine Fehlermeldung an, wenn die Suche mit 500 fehlschlägt', () => {
    cy.visitApp();

    cy.intercept('GET', '/api/games/search*', {
      statusCode: 500,
      body: { error: 'Internal Server Error' },
    }).as('searchError');

    cy.get('.search-bar__input').type('Portal');
    cy.get('.search-bar__button').click();
    cy.wait('@searchError');

    // Kein leerer/kaputter Bildschirm, sondern eine klare Meldung
    cy.get('.home-page__error')
      .should('be.visible')
      .and('contain.text', 'Fehler bei der Suche.');
  });

  it('legt bei einem Netzwerkfehler während des Erstellens kein Spiel an und zeigt einen Fehler-Banner', () => {
    const title = `Cypress Netzwerkfehler ${uniqueSuffix()}`;
    cy.visitApp();

    cy.intercept('POST', '/api/games', { forceNetworkError: true }).as('createGameError');

    cy.openAddGameForm();
    cy.fillGameForm({ title, releaseDate: '2015-02-02' });
    cy.get('.game-form__btn--submit').click();
    cy.wait('@createGameError');

    cy.contains('.game-card__title', title).should('not.exist');
    cy.get('.home-page__error')
      .should('be.visible')
      .and('contain.text', 'Fehler beim Erstellen des Spiels.');

    cy.get('.game-form').should('not.exist');
  });

});
