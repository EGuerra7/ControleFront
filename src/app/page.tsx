"use client"

import CreateProductDialog from "@/components/createProductDialog"
import Pagination from "@/components/pagination"
import SelectInput from "@/components/selectInput"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil, Search } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod";

const SearchProductsSchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
})

type searchProductSchema = z.infer<typeof SearchProductsSchema>

export default function Home() {
  const {register, handleSubmit, control } = useForm<searchProductSchema>({
    resolver: zodResolver(SearchProductsSchema),
    defaultValues: {
      name: '',
      category: '' 
  },
  })

  const items = [{name: 'Todas', value: 'all'},{name: "Papelaria", value: "Papelaria"}, {name: "Eletrônicos", value:"eletronics"}, {name: "Marcenaria", value: "Marcenaria"}]
  const products = Array(10).fill({
    id: 1,
    name: "Borracha",
    category: 'Papelaria',
    quantity: 5,
    localization: "Na segunda prateleira, ao lado da janela"
  })

  const handleSearch = (data: searchProductSchema) => {
    if(!data.name && !data.category){
      return
    }
    console.log(data);
  }

  return (
   <div className="relative flex flex-col gap-6 items-center w-full flex-1 p-6">
    <h1 className="text-[25px] font-medium">Estoque</h1>
    <div className="flex w-[90%] justify-between">
      <div>
        <form className="flex gap-3" onSubmit={handleSubmit(handleSearch)}>
          <Input {...register('name')} placeholder="Procure por nome..."/>
          <SelectInput 
            control={control} 
            {...register('category')}  
            items={items} 
            width="w-[180px]" 
            placeholder="Categoria"
          />
          <Button type="submit" variant={"secondary"}><Search size={24}/></Button>
        </form>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"outline"}>Adicionar um produto</Button>
        </DialogTrigger>
        <CreateProductDialog />
      </Dialog> 
    </div>

    <div className="flex flex-col justify-center w-[90%]">
      <Table className="mb-5">
        <TableHeader>
          <TableRow>
            <TableHead className="text-base">Produto</TableHead>
            <TableHead className="text-base">Categoria</TableHead>
            <TableHead className="text-base">Qtd.</TableHead>
            <TableHead className="text-base">Localização</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => {
            return (
              <TableRow key={index}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.localization}</TableCell>
                <TableCell><Button variant={"ghost"} size={"icon"} ><Pencil/></Button></TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <Pagination />
    </div>
    
   </div>
   
  );
}
