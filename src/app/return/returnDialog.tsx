"use client"

import { z } from "zod";
import { Button } from "../../components/ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const ReturnProductsBodySchema = z.object({
    products: z.array(
        z.object({
            projectId: z.string(),
            name: z.string(),
            return_quantity: z.coerce.number(),
        })
    )
})



type returnProductsSchema = z.infer<typeof ReturnProductsBodySchema>

export default function ReturnDialog(){
    const { register, handleSubmit, control } = useForm<returnProductsSchema>({
        resolver: zodResolver(ReturnProductsBodySchema),
        defaultValues: {
            products: [
                {projectId: '1', name: 'Borracha', return_quantity: 0},
                {projectId: '2', name: 'Tesoura' , return_quantity: 0},
            ]
        }
    })

    const { fields } = useFieldArray({
        control,
        name: "products",
      });

    const handleReturn = (data: returnProductsSchema) => {
        alert("deu")
        console.log(data);
    }

    return (
        <DialogContent className="max-w-md w-full flex flex-col justify-center items-center gap-10">
            <DialogHeader>
                <DialogTitle>À devolver</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleReturn)}>
                <div className="w-[70%] flex flex-col gap-2">
                    {fields.map((field, index) => {
                        return (
                            <div key={field.id}>
                                <div  className="grid grid-cols-2 gap-[25%]">
                                    <span>{field.name}</span>
                                    <Input {...register(`products.${index}.return_quantity`)}  type="number" />
                                    <input
                                    type="hidden"
                                    {...register(`products.${index}.projectId`)}
                                    value={field.projectId} 
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
                <DialogFooter>
                    <DialogClose asChild> 
                        <Button type="submit" variant={"green"}>Confirmar</Button>
                    </DialogClose>
                </DialogFooter>
            </form>
        </DialogContent>
    )
}