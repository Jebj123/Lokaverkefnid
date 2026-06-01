const cartItem = {
  product: {
    id: 1, name: 'Persona 5 Royal', slug: 'persona-5-royal', description: '',
    price_cents: 5900, currency: 'ISK', stock_quantity: 10, is_active: true,
    shop_id: 'a95c999d-f19e-4335-8302-696193934e87',
    image_url: "https://static.wikia.nocookie.net/megamitensei/images/6/6c/P5R_Key_Art.jpg/revision/latest?cb=20210329153657", image_url_2: null, image_url_3: null,
    youtube_url: null, genre: ['Shooter'], platforms: ['PC', 'Ps5', 'Nintendo Switch'],
  },
  quantity: 1,
  platform: 'PC',
}

describe('Cart', () => {
  it('user sees empty cart message', () => {
    cy.visit('/cart', {
      onBeforeLoad(win) {
        win.localStorage.removeItem('cart')
      },
    })
    cy.get('main').contains('Your cart is empty.').should('be.visible')
  })

  it('user sees their cart items', () => {
    cy.visit('/cart', {
      onBeforeLoad(win) {
        win.localStorage.setItem('cart', JSON.stringify({ state: { items: [cartItem], totalItems: 1 }, version: 0 }))
      },
    })
    cy.get('main').contains('Persona 5 Royal').should('be.visible')
    cy.get('main').contains('5900').should('be.visible')
  })

  it('user sees correct total for multiple items', () => {
    const items = [
      cartItem,
      { ...cartItem, product: { ...cartItem.product, id: 2, name: 'Doom: The Dark Ages', price_cents: 4900, image_url: "https://upload.wikimedia.org/wikipedia/en/7/7f/DOOM%2C_The_Dark_Ages_Game_Cover.jpeg" }, platform: 'PS5' },
    ]
    cy.visit('/cart', {
      onBeforeLoad(win) {
        win.localStorage.setItem('cart', JSON.stringify({ state: { items, totalItems: 2 }, version: 0 }))
      },
    })
    cy.get('main').contains('Persona 5 Royal').should('be.visible')
    cy.get('main').contains('Doom: The Dark Ages').should('be.visible')
    cy.get('main').contains('10800').should('be.visible')
  })

  it('user removes an item from cart', () => {
    cy.visit('/cart', {
      onBeforeLoad(win) {
        win.localStorage.setItem('cart', JSON.stringify({ state: { items: [cartItem], totalItems: 1 }, version: 0 }))
      },
    })
    cy.get('main').contains('Persona 5 Royal').should('be.visible')
    cy.get('main').contains('Remove').click()
    cy.get('main').contains('Persona 5 Royal').should('not.exist')
  })

  it('user navigates to checkout from cart', () => {
    cy.visit('/cart', {
      onBeforeLoad(win) {
        win.localStorage.setItem('cart', JSON.stringify({ state: { items: [cartItem], totalItems: 1 }, version: 0 }))
      },
    })
    cy.get('main').contains('Checkout').click()
    cy.url().should('match', /\/(checkout|sign-in)/)
  })
})
