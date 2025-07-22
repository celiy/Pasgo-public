import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Ellipsis } from "lucide-react";
import { Button } from "./ui/button";

export default function TableComponent(props) {
  let itens = props.itens;
  if (!itens) { itens = {} }
  let elemento = props.elemento;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            {/* MAIN */}
          </TableHead>
          <TableHead>
            {/* NORMAL */}
          </TableHead>
          <TableHead className="text-right w-[100px]">
            {/* ACTIONS */}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.isArray(itens) ? (
          itens.map(item =>
            <TableRow key={item.id}>
              <TableCell className="font-medium max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                {/* MAIN */}
              </TableCell>
              <TableCell>
                {/* SECONDARY */}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex space-x-2 justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button><Ellipsis /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Acões</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                       {/* Conteudo de dropdown */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          )) : (<></>)}
      </TableBody>
    </Table>
  )
}
