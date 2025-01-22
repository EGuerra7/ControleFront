import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { Check, ChevronsUpDown } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command'
import { cn } from '@/lib/utils'
import { Control, Controller } from 'react-hook-form'
import { createLoanFormSchema } from '@/app/loan/page'

interface SelectComboboxProps {
  control: Control<createLoanFormSchema>
  name:
    | 'responsible'
    | 'products'
    | `products.${number}`
    | `products.${number}.id`
    | `products.${number}.loan_quantity`
  items: {
    id: string
    name: string
    quantity: number
    category: string
    localization: string
  }[]
}

export default function SelectCombobox({
  control,
  name,
  items,
}: SelectComboboxProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              role="combobox"
              aria-expanded={open}
              className="min-w-[200px] justify-between text-gray-600 font-normal"
            >
              {field.value
                ? items.find((item) => item.id === field.value)?.name
                : 'Selecione o produto...'}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput
                placeholder="Procure o produto..."
                className="h-9"
              />
              <CommandList>
                <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                <CommandGroup>
                  {items.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.name}
                      onSelect={(currentValue: string) => {
                        setValue(currentValue === value ? '' : currentValue)
                        field.onChange(item.id)
                        setOpen(false)
                      }}
                    >
                      {item.name} ({item.quantity})
                      <Check
                        className={cn(
                          'ml-auto',
                          value === item.id ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    />
  )
}
