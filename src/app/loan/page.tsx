"use client"

import SelectInput from "@/components/selectInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleX, Plus } from "lucide-react";
import { z } from 'zod'
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import SelectCombobox from "@/components/selectCombobox";

const CreateLoanFormSchema = z.object({
    responsible: z.string().min(3),
    product: z.array(
        z.object({
            productId: z.string(),
            loan_quantity: z.number()
        })
    )

})

export type createLoanFormSchema = z.infer<typeof CreateLoanFormSchema>

export default function Loan() {
    const { control, register, handleSubmit, reset } = useForm<createLoanFormSchema>({
        resolver: zodResolver(CreateLoanFormSchema),
        defaultValues: {
            responsible: "",
            product: [{ productId: "", loan_quantity: 1 }],
        },
    })

    function handleAddProduct() {
        append({ productId: "", loan_quantity: 1 })
    }

    function handleRemoveProduct(index: number) {
        remove(index)
    }

    const { fields, append, remove } = useFieldArray({
        control,
        name: "product",
    });


    const onSubmit = (data: any) => {
        console.log(data)
        reset()
    }

    const items = [{ label: "Borracha", value: "2" }, { label: "Tesoura", value: "1" }]

    return (
        <>
            <div className="flex items-center justify-center w-full">
                <div className="border-2 rounded py-8 px-12 flex flex-col gap-7 text-center ">
                    <h1 className=" text-lg font-medium">Empréstimo</h1>
                    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-5">
                            <Input {...register('responsible')} placeholder="Responsável" />
                            <div className="flex flex-col gap-3">
                                {fields.map((field, index) => {
                                    return (
                                        <div key={field.id} className="flex gap-4 items-stretch">
                                            <SelectCombobox
                                                name={`product.${index}.productId`}
                                                control={control}
                                                items={items}
                                            />
                                            <Input {...register(`product.${index}.loan_quantity`, { valueAsNumber: true })} className="text-center" size={1} placeholder="Qtd." />
                                            <Button className="text-gray-600 font-normal" type="button" variant={"ghost"} size={"sm"} disabled={fields.length === 1} onClick={() => handleRemoveProduct(index)}>
                                                <CircleX />
                                            </Button>

                                        </div>
                                    )
                                })}
                            </div>
                            <Button type="button" onClick={handleAddProduct} variant={"outline"} size={"sm"}><Plus /></Button>
                        </div>

                        <Button type="submit" variant={"secondary"}>Confirmar</Button>
                    </form>
                </div>

            </div>
        </>
    )
}