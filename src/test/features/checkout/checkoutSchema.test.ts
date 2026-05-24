import { describe, it, expect } from 'vitest'
import { checkoutSchema } from '@/features/checkout/checkoutSchema'

const valid = {
  name: 'Jon Bjarkason',
  email: 'jon@example.com',
  address: '123 Bryggjugata',
  city: 'Reykjavik',
  zip: '101',
  cardNumber: '1234567890123456',
  cardExpiry: '12/26',
  cardCvv: '123',
}

describe('checkoutSchema', () => {
  it('accepts a valid form', () => {
    expect(checkoutSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects empty required fields', () => {
    const result = checkoutSchema.safeParse({ ...valid, name: '' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = checkoutSchema.safeParse({ ...valid, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('rejects card number shorter than 16 digits', () => {
    const result = checkoutSchema.safeParse({ ...valid, cardNumber: '12345' })
    expect(result.success).toBe(false)
  })

  it('rejects card number with non-digits', () => {
    const result = checkoutSchema.safeParse({ ...valid, cardNumber: 'abcd1234abcd1234' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid expiry format', () => {
    const result = checkoutSchema.safeParse({ ...valid, cardExpiry: '1226' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid month in expiry', () => {
    const result = checkoutSchema.safeParse({ ...valid, cardExpiry: '13/26' })
    expect(result.success).toBe(false)
  })

  it('rejects CVV shorter than 3 digits', () => {
    const result = checkoutSchema.safeParse({ ...valid, cardCvv: '12' })
    expect(result.success).toBe(false)
  })

  it('accepts 4-digit CVV', () => {
    expect(checkoutSchema.safeParse({ ...valid, cardCvv: '1234' }).success).toBe(true)
  })
})
