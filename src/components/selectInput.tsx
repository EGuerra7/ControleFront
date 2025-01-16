import { Control, Controller } from "react-hook-form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";


interface Item {
    name: string
    value: string
}

interface SelectInputProps {
    name: string
    control: any
    placeholder?: string
    width?: string
    items: Item[]
}

export default function SelectInput({ placeholder, width, items, name, control }: SelectInputProps){
    return (
        <Controller
        name={name}
        control={control}
        render={({ field }) => (
            <Select 
            {...field}
            onValueChange={(value) => field.onChange(value)} 
            value={field.value || ""}
            >
                <SelectTrigger className={`${width}`}>
                    <SelectValue placeholder={placeholder}/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {items.map(item => {
                            return (
                                <SelectItem key={item.value} value={item.value}>{item.name}</SelectItem>
                            )
                        })}
                    </SelectGroup>
                </SelectContent>
            </Select>
    )} />
    )
}