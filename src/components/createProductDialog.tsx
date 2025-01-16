import { z } from "zod";
import SelectInput from "./selectInput";
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";

const CreateProductBodySchema = z.object({
    name: z.string(),
    category: z.string(),
    quantity: z.coerce.number(),
    localization: z.string()
})

type createProductSchema = z.infer<typeof CreateProductBodySchema>

export default function CreateProductDialog(){
    const items = [{name: "Papelaria", value: "Papelaria"}, {name: "Eletrônicos", value:"eletronics"}, {name: "Marcenaria", value: "Marcenaria"}]
    
    const {register, handleSubmit, control} = useForm<createProductSchema>({
        resolver: zodResolver(CreateProductBodySchema)
    })

    const handleCreateProduct = (data: createProductSchema) => {
        console.log(data);
    }

    return (
        <DialogContent className="max-w-2xl max-h-[50%] h-full w-full px-20 py-5">
            <DialogHeader>
                <DialogTitle className="text-center">Adicionar produto</DialogTitle>
            </DialogHeader>
            <form className="flex flex-col gap-5" onSubmit={handleSubmit(handleCreateProduct)}>
                <div className="flex flex-col gap-3">
                    <div>
                        <Label className="mb-1" htmlFor="name">Nome:</Label>
                        <Input {...register('name')}   name="name" type="text"/>
                    </div>
                    <div className="grid grid-cols-2 gap-10">
                        <div>
                            <Label className="mb-1">Categoria:</Label>
                            <SelectInput 
                                control={control} 
                                {...register('category')}  
                                items={items} 
                            />
                        </div>
                        <div>
                            <Label className="mb-1" htmlFor="quantity">Quantidade:</Label>
                            <Input {...register('quantity')} name="quantity" type="text"/>
                        </div>  
                    </div>
                    <div>
                        <Label className="mb-1" htmlFor="localization">Localização:</Label>
                        <Input {...register('localization')} name="localization" type="text"/>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="submit" size={"lg"}>Confirmar</Button>
                    </DialogClose>
                </DialogFooter>
            </form>
            
        </DialogContent>
        

    )
}