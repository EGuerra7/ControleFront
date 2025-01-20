import ReturnDialog from '@/app/return/returnDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

export default function Return() {
  return (
    <main className="flex flex-col gap-6 p-6 text-center w-[95%]">
      <h1 className="font-medium text-[25px]">Devolução</h1>
      <div className="text-left w-[25%]">
        <Input placeholder="Pesquise o responsável..." />
      </div>
      {/* Returns list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card className="pt-4">
          <CardContent className="flex flex-col gap-2 text-left">
            <span className="text-base">
              <b className="font-medium">Responsável: </b>Erick Guerra
            </span>
            <span className="text-base">
              <b className="font-medium">Produtos: </b>Tesoura e Borracha
            </span>
          </CardContent>
          <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={'green'}>Devolver</Button>
              </DialogTrigger>
              <ReturnDialog />
            </Dialog>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
