import AlertDialogComponent from '@/components/alert-dialog-component.jsx';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Ellipsis, Pencil } from "lucide-react";
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

function formatedUrl(url, fields, item) {
    const itemWithId = {
        ...item,
        id: item._id
    }
    
    let finalParams = [];

    for (const [key, value] of Object.entries(itemWithId)) {
        if (fields?.includes(key)) {
            finalParams.push(`&${key}=${value}`);
        }
    }

    return url + "?update=true" + finalParams.join("");
}

export default function TableActions(props) {
    return (<>
        <Popover>
            <PopoverTrigger className='p-2 border-2 rounded-lg border-primary/80 w-fit max-w-[30px] md:max-w-[100px] bg-primary/5 shadow-md'>
                <Ellipsis className='max-w-[10px] md:max-w-[100px]'/>
            </PopoverTrigger>

            <PopoverContent className="w-full p-1">
                <AlertDialogComponent
                    tipo="search"
                    title={props.title}
                    content={props.children}
                />

                {props.editFields && props.editUrl && 
                    <Link to={formatedUrl(props.editUrl, props.editFields, props.item)}>
                        <Button 
                            className="rounded-none"
                            variant="outline"
                        >
                            <Pencil />
                        </Button>
                    </Link>
                }

                <AlertDialogComponent 
                    tipo="circlex"
                    url={props.deleteUrl + props.item?._id}
                    itens={
                        { 
                            id: props.item?._id, name: props.item?.name, tipo: props.item?.tipo, elemento: props.elemento 
                        }
                    }
                />
            </PopoverContent>
        </Popover>
    </>)
}