"use client"

import { z } from "zod";
import { Button } from "../../components/ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GetLoansResponse, Loan } from "@/api/loans/get-loans";
import { returnLoan } from "@/api/loans/return-loans";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client-provider";

interface ReturnDialogProps {
    loan: Loan
}

const ReturnProductsBodySchema = z.object({
    loanId: z.string().uuid(),
    products: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            loan_quantity: z.coerce.number(),
            return_quantity: z.coerce.number(),
        })
    )
})

type returnProductsSchema = z.infer<typeof ReturnProductsBodySchema>

export default function ReturnDialog({ loan }: ReturnDialogProps) {

    const { register, handleSubmit, control } = useForm<returnProductsSchema>({
        resolver: zodResolver(ReturnProductsBodySchema),
        defaultValues: {
            loanId: loan.id,
            products: loan.products.map((product) => ({
                id: product.product.id,
                name: product.product.name,
                loan_quantity: product.loan_quantity,
                return_quantity: 0,
            })),
        }
    })

    const { fields } = useFieldArray({
        control,
        name: "products",
    })

    function updateLoanStateToCompleted(loanId: string) {
        const loanListCache = queryClient.getQueriesData<GetLoansResponse>({
            queryKey: ['loansReturn']
        })

        loanListCache.forEach(([cacheKey, cacheData]) => {
            if (!cacheData) {
                return
            }

            queryClient.setQueryData<GetLoansResponse>(cacheKey, {
                ...cacheData,
                loans: cacheData.loans.map((loan) => {
                    if (loan.id === loanId) {
                        return { ...loan, state: 'COMPLETED' }
                    }

                    return loan
                })
            })

            const filteredLoans = cacheData.loans.filter(loan => loan.id !== loanId)


            queryClient.setQueryData<GetLoansResponse>(cacheKey, {
                ...cacheData,
                loans: filteredLoans
            })
        })
    }

    async function returnLoanAPI(data: returnProductsSchema) {

    }

    const { mutateAsync: dispatchReturnLoan } = useMutation({
        mutationFn: returnLoan,
        async onSuccess(_, { loanId }) {
            alert('Retorno feito com sucesso!')
            updateLoanStateToCompleted(loanId)
        }
    })

    return (
        <DialogContent className="max-w-md w-full flex flex-col justify-center items-center gap-10">
            <DialogHeader>
                <DialogTitle>À devolver</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            <form className="flex flex-col gap-8 items-center" onSubmit={handleSubmit((data) => {
                const requestData = {
                    loanId: data.loanId,
                    products: data.products.map(({ id, return_quantity }) => ({
                        id,
                        return_quantity,
                    })),
                }

                dispatchReturnLoan(requestData)
            })}>
                <div className="w-[70%] flex flex-col gap-2">
                    <div className="grid items-center justify-between grid-cols-3 border-b-2">
                        <span className="text-left font-medium">Produto</span>
                        <span className="text-center font-medium">Quantidade</span>
                        <span className="text-center font-medium">Retorno</span>
                    </div>
                    {fields.map((field, index) => {
                        return (
                            <div key={field.id}>
                                <div className="grid items-center grid-cols-3">
                                    <span className="text-left">{field.name}</span>
                                    <span className="text-sm text-center">{field.loan_quantity}</span>
                                    <Input {...register(`products.${index}.return_quantity`)} className="text-center" />
                                    <input
                                        type="hidden"
                                        {...register(`products.${index}.id`)}
                                        value={field.id}
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

