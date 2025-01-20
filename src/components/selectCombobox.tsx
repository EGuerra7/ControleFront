import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command"
import { cn } from "@/lib/utils"
import { Controller } from "react-hook-form"

interface SelectComboboxProps {
    control: any
    name: string
    items: {
        label: string
        value: string
    }[]
}

export default function SelectCombobox({ control, name, items }: SelectComboboxProps) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant={"outline"}
                            role="combobox"
                            aria-expanded={open}
                            className="min-w-[200px] justify-between text-gray-600 font-normal">
                            {field.value
                                ? items.find((item) => item.value === field.value)?.label
                                : "Selecione o produto..."
                            }
                            <ChevronsUpDown className="opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Procure o produto..." className="h-9" />
                            <CommandList>
                                <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                                <CommandGroup>
                                    {items.map((item) => (
                                        <CommandItem
                                            key={item.value}
                                            value={item.label}
                                            onSelect={(currentValue) => {
                                                setValue(currentValue === value ? "" : currentValue)
                                                field.onChange(item.value)
                                                setOpen(false)
                                            }}
                                        >
                                            {item.label}
                                            <Check
                                                className={cn(
                                                    "ml-auto",
                                                    value === item.value ? "opacity-100" : "opacity-0"
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