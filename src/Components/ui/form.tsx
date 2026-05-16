import * as React from "react"
import { useFormContext, Controller, type ControllerProps, type FieldPath, type FieldValues, FormProvider } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Label } from "@/Components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = { name: TName }

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue)

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const FormItemContext = React.createContext<{ id: string }>({} as { id: string })

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId()
  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={cn("flex flex-col gap-1.5", className)} {...props} />
    </FormItemContext.Provider>
  )
}

function FormLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  const { id } = React.useContext(FormItemContext)
  return <Label htmlFor={id} className={className} {...props} />
}

function FormControl({ ...props }: React.ComponentProps<"div">) {
  const { id } = React.useContext(FormItemContext)
  return <div id={id} {...props} />
}

function FormMessage({ className, children, ...props }: React.ComponentProps<"p">) {
  const { name } = React.useContext(FormFieldContext)
  const { formState } = useFormContext()
  const error = formState.errors[name]
  const body = error ? String(error.message) : children
  if (!body) return null
  return (
    <p className={cn("text-sm text-red-500", className)} {...props}>
      {body}
    </p>
  )
}

export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage }
