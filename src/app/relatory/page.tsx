"use client"

import SelectInput from "@/components/selectInput";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollText, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import CreateCategoryDialog from "./createCategoryDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LoanStatus, { LoanStatusType } from "@/components/loan-status";

type Loan = {
    id: string,
    responsible: string,
    products:{
        name: string
    } [],
    date: string,
    status: LoanStatusType
}

const SearchProductsSchema = z.object({
    responsible: z.string().optional(),
    status: z.enum(['LOAN', 'COMPLETED', 'ALL']).optional(),
})

export enum LOANSTATUSENUM {
    LOAN = "LOAN",
    COMPLETED = "COMPLETED",
  }


type searchProductSchema = z.infer<typeof SearchProductsSchema>
export default function Relatory() {
    const items = [
        {name: 'Todas', value: 'ALL'},
        {name: "Concluídas", value: "COMPLETED"},
        {name: "Emprestado", value:"LOAN"},
    ]

    const {register, handleSubmit, control } = useForm<searchProductSchema>({
        resolver: zodResolver(SearchProductsSchema),
        defaultValues: {
          responsible: '',
          status: 'ALL',
      },
      })

    const loans: Loan[] = [
        {id: '1', responsible: 'Erick Guerra', products: [{name: 'Borracha'}, {name: 'Tesoura'}], date: '2023-11-15T14:37:52', status: LOANSTATUSENUM.COMPLETED},
        {id: '2', responsible: 'Erick Guerra', products: [{name: 'Cola quente'}, {name: 'Pistola de cola quente'}, {name: 'Lapís de cor'}, {name: 'Tinta'}, {name: 'E.V.A'},], date: '2025-01-07T08:21:45' , status: LOANSTATUSENUM.LOAN}
    ]

    const handleSearch = (data: searchProductSchema) => {
        if(!data.responsible && !data.status){
            return
        }
        console.log(data);
    }

    return (
        <main className="w-full flex flex-col gap-5 items-center p-6">
            <h1 className="font-medium text-[25px]">Devolução</h1>
            <div className="flex w-[90%] justify-between">
                <form className="flex gap-3" onSubmit={handleSubmit(handleSearch)}>
                <Input {...register("responsible")} placeholder="Procure por responsável..."/>
                <SelectInput 
                    control={control} 
                    {...register('status')}  
                    items={items} 
                    width="w-[180px]" 
                    placeholder="Categoria"
                />
                <Button type="submit" variant={"secondary"}><Search size={24}/></Button>
                </form>

                <Dialog>
                    <DialogTrigger asChild>
                    <Button variant={"outline"}>Adicionar uma categoria</Button>
                    </DialogTrigger>
                    <CreateCategoryDialog />
                </Dialog> 
            </div>
            <div className="flex flex-col justify-center w-[90%]">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead></TableHead>
                            <TableHead>Responsável</TableHead>
                            <TableHead>Produtos</TableHead>
                            <TableHead>Emprestado há</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loans.map((loan, index) => {
                            const productNames = loans[index].products.map((product, i, arr) => {
                                if (i === arr.length - 1) {
                                  return product.name; 
                                }
                                return product.name + ', ';
                              }).join('');

                              // Substitui a última vírgula por ' e '
                              const finalProductsNames = productNames.replace(/,([^,]*)$/, ' e$1');

                            return (
                                <TableRow key={loan.id}>
                                    <TableCell>
                                        <Button variant={"ghost"} size={"icon"}>
                                            <ScrollText/>
                                        </Button>
                                    </TableCell>
                                    <TableCell>{loan.responsible}</TableCell>
                                    <TableCell className="max-w-50 mr-1" key={loan.id}>
                                        <span>{finalProductsNames}</span> 
                                    </TableCell>
                                    <TableCell>
                                        {formatDistanceToNow(loan.date, {
                                            locale: ptBR,
                                            addSuffix: true,
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        <LoanStatus status={loan.status}/>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        
                    </TableBody>
                </Table>
            </div>
        </main>    
    )
}