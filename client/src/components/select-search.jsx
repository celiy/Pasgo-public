import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { useState } from 'react';

export default function SelectSearch(props) {
    const [ selectedValue, setSelectedValue ] = useState('');
    const [ lastSelected, setLastSelected ]   = useState(null);
    const [ searchValue, setSearchValue ]     = useState('');
    const [ lastTyped, setLastTyped ]         = useState(null);
    const [ value, setValue ]                 = useState("");
    const [ open, setOpen ]                   = useState(false);
    
    const { itens, onChange, onSearchChange, id } = props;

    const handleChange = (value, id) => {
        const date = new Date();

        if (!lastTyped) {
            setLastTyped(date);
            onSearchChange(value, id);
            return;
        }

        if (lastTyped && date - lastTyped > 400) {
            onSearchChange(value, id);
            setLastTyped(date);
            return;
        }

        setSearchValue(value);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between w-full overflow-hidden text-ellipsis whitespace-nowrap"
                >
                    {value
                        ? itens.find((item) => item.label === value)?.label
                        : "Selecionar..."}
                    <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Procurar..."
                        value={searchValue}
                        onValueChange={(currentValue) => {
                            setSearchValue(currentValue); // Atualiza o estado local
                            
                            if (onSearchChange) {
                                handleChange(currentValue, id);
                            }
                        }}
                    />
                    <CommandList>
                        <CommandEmpty>Nada foi encontrado</CommandEmpty>
                        <CommandGroup>
                            {itens.map((item) => (
                                <CommandItem
                                    key={item.value}
                                    value={item.label}
                                    onSelect={(currentValue) => {
                                        setLastSelected(currentValue);

                                        if (lastSelected === currentValue) {
                                            setLastSelected(null);
                                            setValue("");
                                            setOpen(false);
                                            if (onChange) {
                                                onChange(""); 
                                            }
                                            return;
                                        }

                                        const newValue = currentValue === value ? "" : currentValue;
                                        setValue(newValue);
                                        setOpen(false);
                                        if (onChange) {
                                            onChange(item.value); 
                                        }
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            (value === item.value ? "opacity-100" : "opacity-0"),
                                            (lastSelected === item.label ? "opacity-100" : "opacity-0")
                                        )}
                                    />
                                    {item.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
