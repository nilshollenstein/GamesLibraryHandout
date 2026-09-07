/// <reference types="cypress" />
/*
* Stellt sicher, dass keine falschen Daten gespeichert werden
* Stellt ausserdem auch sicher, dass dem Benutzer gesagt wird, das kein Bild/ kein gültiges Bild vorhanden ist, anstatt nichts zu sagen
* */
describe('Formular-Abbruch und Bild-Darstellung', () => {
  const uniqueSuffix = () => Date.now().toString();

  beforeEach(() => {
    cy.visitApp();
  });

  it('verwirft beim Abbrechen des Bearbeitens alle Änderungen (Originaldaten bleiben)', () => {
    const title = `Cypress Cancel Test ${uniqueSuffix()}`;
    const shouldNotSaveTitle = 'Dieser Titel darf nie gespeichert werden'

    cy.createGameViaForm({
      title,
      description: 'Originalbeschreibung',
      releaseDate: '2020-05-20',
    });

    cy.intercept('PUT', '/api/games/*').as('updateGame');
    cy.contains('.game-card', title).within(() => {
      cy.get('.game-card__btn--edit').click();
    });
    cy.fillGameForm({
      title: shouldNotSaveTitle,
      description: 'Diese Beschreibung darf nie gespeichert werden',
    });
    cy.get('.game-form__btn--cancel').click();


    cy.get('.game-form').should('not.exist');
    cy.get('@updateGame.all').should('have.length', 0);
    cy.contains('.game-card__title', title).should('be.visible');
    cy.contains('.game-card__title', shouldNotSaveTitle).should('not.exist');
    cy.contains('.game-card', title).within(() => {
      cy.get('.game-card__description').should('contain.text', 'Originalbeschreibung');
    });

    cy.deleteGameByTitle(title);
  });

  it('onError-Fallback zeigt "No Image" an bei ungültiger URL', () => {
    const title = `Cypress Invalid URL ${uniqueSuffix()}`;

    cy.createGameViaForm({
      title,
      imageUrl: '/dieses-bild-existiert-nicht.jpg',
      releaseDate: '2018-09-09',
    });

    cy.contains('.game-card', title).within(() => {
      cy.get('.game-card__no-image').should('be.visible').and('contain.text', 'No Image');
      cy.get('.game-card__image').should('not.exist');
    });

    cy.deleteGameByTitle(title);
  });

  it('onError-Fallback zeigt "No Image" an bei nicht vorhandener URL', () => {
    const title = `Cypress Ohne-Bild ${uniqueSuffix()}`;

    cy.createGameViaForm({
      title,
      releaseDate: '2017-04-04',
    });

    cy.contains('.game-card', title).within(() => {
      cy.get('.game-card__no-image').should('be.visible').and('contain.text', 'No Image');
      cy.get('.game-card__image').should('not.exist');
    });

    cy.deleteGameByTitle(title);
  });
});
