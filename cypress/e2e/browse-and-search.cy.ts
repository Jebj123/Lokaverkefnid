const interceptEmpty = () =>
  cy.intercept('GET', '**/rest/v1/products**', { statusCode: 200, body: [] })

describe('Browse and Search', () => {
  it('user visits the homepage', () => {
    cy.visit('/')
    cy.get('header').should('be.visible')
  })

  it('user types in search and sees dropdown results', () => {
    cy.visit('/')
    cy.get('input[placeholder*="earch"]').type('a')
    cy.get('[data-testid="search-dropdown"] li').should('have.length.greaterThan', 0)
  })

  it('user clears search and dropdown disappears', () => {
    cy.visit('/')
    cy.get('input[placeholder*="earch"]').type('a').clear()
    cy.get('[data-testid="search-dropdown"]').should('not.exist')
  })

  it('user sees no results message when nothing matches', () => {
    interceptEmpty()
    cy.visit('/')
    cy.get('input[placeholder*="earch"]').type('zzznomatch')
    cy.get('[data-testid="search-dropdown"]').contains('No results').should('be.visible')
  })

  it('user presses enter on search and lands on results page', () => {
    cy.visit('/')
    cy.get('input[placeholder*="earch"]').type('a{enter}')
    cy.url().should('include', '/search')
  })
})
