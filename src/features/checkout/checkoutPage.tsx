import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../cart/CartContext'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/Components/ui/form'
import { Input } from '@/Components/ui/input'
import { checkoutSchema, type CheckoutForm } from './checkoutSchema'

const CheckoutPage = () => {
  const { items, totalItems } = useCart()
  const navigate = useNavigate()

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { name: '', email: '', address: '', city: '', zip: '', cardNumber: '', cardExpiry: '', cardCvv: '' },
  })

  if (totalItems === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <p className="text-gray-500 text-lg">No items to checkout.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-[#6c47ff] text-white rounded-full px-6 py-2 text-sm font-medium hover:opacity-90 cursor-pointer"
        >
          Browse Products
        </button>
      </div>
    )
  }

  const total = items.reduce((sum, i) => sum + i.product.price_cents * i.quantity, 0)
  const currency = items[0]?.product.currency ?? ''

  const onSubmit = (data: CheckoutForm) => {
    console.log('Order submitted:', data)
    // TODO: send order to Supabase
  }

  return (
    <div className="px-6 py-10">
      <h1 className="text-2xl font-bold mb-6 underline">Checkout</h1>

      <div className="flex gap-8 items-start">
        <div className="flex flex-col gap-1 flex-1 border rounded-sm p-6 shadow-sm">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex items-center shadow-sm">
              {product.image_url && (
                <img src={product.image_url} alt={product.name} className="h-14 w-14 object-contain" />
              )}
              <div className="flex-1">
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-gray-500">Qty: {quantity}</p>
              </div>
              <p className="font-bold">{product.price_cents * quantity} {product.currency}</p>
            </div>
          ))}
          <div className="flex justify-between items-center border-t pt-4 mt-2">
            <p className="text-lg font-bold underline text-black">Total:</p>
            <p className="text-lg font-bold text-red-500 underline">{total} {currency}</p>
          </div>
        </div>

        <div className="flex-1">
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 border rounded-xl p-6 shadow-sm bg-gray-50">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Reykjavik" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem className="w-32">
                  <FormLabel>ZIP</FormLabel>
                  <FormControl>
                    <Input placeholder="101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <p className="text-sm font-semibold text-gray-700 mt-2">Payment Details</p>
          <FormField
            control={form.control}
            name="cardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Card Number</FormLabel>
                <FormControl>
                  <Input placeholder="1234567812345678" maxLength={16} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="cardExpiry"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <Input placeholder="MM/YY" maxLength={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cardCvv"
              render={({ field }) => (
                <FormItem className="w-32">
                  <FormLabel>CVV</FormLabel>
                  <FormControl>
                    <Input placeholder="123" maxLength={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <button
            type="submit"
            className="mt-2 bg-[#6c47ff] text-white rounded-full py-3 font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            Place Order
          </button>
        </form>
        </Form>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
