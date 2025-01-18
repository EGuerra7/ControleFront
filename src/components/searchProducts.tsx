import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from 'next/compat/router'
import { useSearchParams } from 'next/navigation'
import { useForm } from "react-hook-form"
import { z } from "zod";
import { Input } from "./ui/input";
import SelectInput from "./selectInput";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const SearchProductsSchema = z.object({
    name: z.string().optional(),
    category: z.string().optional(),
})
  
type searchProductSchema = z.infer<typeof SearchProductsSchema>

export default function SearchProducts(){
    const router = useRouter()
    const [name, setName] = useState<string | undefined>(undefined);
    const [category, setCategory] = useState<string | undefined>(undefined);

    useEffect(() => {
      if (router && !router.isReady || !router) {
        return
      }
      const { name, category } = router.query;
      setName(Array.isArray(name) ? name[0] : name); 
      setCategory(Array.isArray(category) ? category[0] : category);
    }, [router])


    const items = [{name: 'Todas', value: 'all'},{name: "Papelaria", value: "Papelaria"}, {name: "Eletrônicos", value:"eletronics"}, {name: "Marcenaria", value: "Marcenaria"}]

    const {register, handleSubmit, control } = useForm<searchProductSchema>({
        resolver: zodResolver(SearchProductsSchema),
        defaultValues: {
          name: name ?? '',
          category: category ?? '', 
      },
      })
      

      const  handleSearch =  ({ name, category }: searchProductSchema) => {
        if(!name && !category){
          return
        }
        if (router?.isReady) {
          const searchParams = new URLSearchParams(window.location.search);
      
            if(name) {
              searchParams.set('name', name)
            } else {
              searchParams.delete('name')
            }
            
            if(category) {
              searchParams.set('category', category)
            } else {
              searchParams.delete('category')
            }
      
            searchParams.set('page', '1')
      
            router.push({
              pathname: router.pathname,
              query: Object.fromEntries(searchParams.entries()),
            });
          }

        } 
    return (
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
    )
}