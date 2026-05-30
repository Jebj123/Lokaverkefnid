const orderItems = [
  {
    product: {
    id: 1, name: 'Persona 5 Royal', slug: 'persona-5-royal', description: '',
    price_cents: 5900, currency: 'ISK', stock_quantity: 10, is_active: true,
    shop_id: 'a95c999d-f19e-4335-8302-696193934e87',
    image_url: "https://static.wikia.nocookie.net/megamitensei/images/6/6c/P5R_Key_Art.jpg/revision/latest?cb=20210329153657", image_url_2: null, image_url_3: null,
    youtube_url: null, genre: ['Shooter'], platforms: ['PC', 'Xbox'],
    },
    quantity: 2,
    platform: 'PC',
  },
]

const visitWithSnapshot = () => {
  cy.visit('/order-complete', {
    onBeforeLoad(win) {
      win.sessionStorage.setItem('orderSnapshot', JSON.stringify(orderItems))
      // Stub removeItem so React StrictMode's double-invoke doesn't clear the snapshot
      const original = win.sessionStorage.removeItem.bind(win.sessionStorage)
      win.sessionStorage.removeItem = (key: string) => {
        if (key !== 'orderSnapshot') original(key)
      }
    },
  })
}

describe('Order Complete', () => {
  it('user sees their order summary after purchase', () => {
    visitWithSnapshot()
    cy.get('main').contains('Order Complete').should('be.visible')
    cy.get('main').contains('Persona 5 Royal').should('be.visible')
    cy.get('main').contains('Thank you').should('be.visible')
  })

  it('user can continue shopping after order', () => {
    visitWithSnapshot()
    cy.get('main').contains('Continue Shopping').click()
    cy.url().should('eq', Cypress.config('baseUrl') + '/')
  })

  it('user sees order items on the order complete page', () => {
    visitWithSnapshot()
    cy.get('main').contains('Order Complete').should('be.visible')
    cy.get('main').contains('Persona 5 Royal').should('be.visible')
  })
})
