import { ActiveFilters } from '@/components/active-filters'
import { Button } from '@/components/ui/button'
import { Calendar } from "@/components/ui/calendar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Calendar as CalendarIcon, Filter, ListFilterPlus, Plus, RefreshCw, Search } from "lucide-react"
import moment from "moment"
import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function ItemQuery(props) {
    const [ currentOption, setCurrentOption ] = React.useState("");
    const [ filterOptions, setFilterOptions ] = React.useState([]);
    const [ filterType, setFilterType ]       = React.useState("");
    const [ filtersArr, setFiltersArr ]       = React.useState([]);
    const [ procura, setProcura ]             = React.useState("");
    const [ filters, setFilters ]             = React.useState("");
    const [ filtro, setFiltro ]               = React.useState("");

    const location = useLocation();
    const currentFragment = location.hash;

    let page;

    const translateFiltro = () => {
        try {
            if (filtro) {
                const translated = Object.entries(props?.filters).find((item) => (
                    item[1] === filtro
                ))

                if (translated) {
                    return translated[0];
                } else {
                    for (const [key, value] of Object.entries(props?.filters)) {
                        if (typeof value === "object" && value?.key === filtro?.key) {
                            return key;
                        }
                    }
                }
            } else {
                const translated = Object.entries(props?.filters).find((item, index) => (
                    index === 0
                ))

                setFiltro(translated[1]);
                if (translated) return translated[0];
            }
        } catch (err) {
            return "Erro";
        }
    }

    const handleInputChange = (event) => {
        setProcura(event.target.value);
    };

    const getFilters = (type, filtroParam = filtro, procuraParam = procura) => {
        let fields = [...filtersArr];

        if (!page){
            page = currentFragment.split("page=")[1];

            const i = fields.findIndex(f => f.startsWith("page="));
            if (i >= 0) fields[i] = "page="+page;
            if (!fields.includes("page="+page)) fields.push("page="+page);
        }

        if (type !== "page") {
            // Remove todos os filtros do tipo filtro=valor
            fields = fields.filter(f => !f.startsWith(filtroParam + "="));

            if (type === "unique" && procuraParam.length > 0) {
                fields.splice(1);
                fields.push(filtroParam + "=" + procuraParam);
            } else if (type === "unique" && procuraParam.length === 0) {
                fields.splice(1);
            }

            if (procuraParam.length > 0) {
                if (!fields.includes(filtroParam + "=" + procuraParam)) fields.push(filtroParam + "=" + procuraParam);
                const sortIndex = fields.findIndex(f => f === "sort=" + filtroParam);
                const procuraIndex = fields.findIndex(f => f === filtroParam + "=" + procuraParam);

                if (sortIndex >= 0 && procuraIndex >= 0) {
                    fields.splice(sortIndex, 1);
                }
            } else {
                fields = fields.filter(f => !f.startsWith(filtroParam + "="));
                if (!fields.includes("sort=" + filtroParam)) fields.push("sort=" + filtroParam);
            }
        }

        setFiltersArr(fields);
    };

    const refresh = (type) => {
        let filtroAtual = filtro;
        let procuraAtual = procura;
        
        if (filtroAtual?.key) {
            if (filtroAtual?.type && filtroAtual?.type === "date") {
                filtroAtual = `${filtroAtual.key}[${currentOption}]`;

                if (procuraAtual) procuraAtual = new Date(procuraAtual).toISOString();
                else {
                    const newDate = new Date().toISOString();
                    procuraAtual = newDate;
                    setProcura(newDate);
                }
            }

            if (filtroAtual?.type && filtroAtual?.type === "bool") {
                filtroAtual = filtroAtual.key;
                procuraAtual = currentOption;
            }

            if (filtroAtual?.type && filtroAtual?.type === "customValue") {
                procuraAtual = filtroAtual.customValue;
                filtroAtual = filtroAtual.key;
            }
        }

        getFilters(type, filtroAtual, procuraAtual);
    };

    const cycleOptions = () => {
        const options = [...filterOptions];

        const optionIndex = options.findIndex((item) => (
            item === currentOption
        ));

        if (optionIndex+1 >= options?.length) {
            setCurrentOption(options[0]);
        }

        if (optionIndex+1 < options?.length) {
            setCurrentOption(options[optionIndex+1]);
        }
    }

    const verifyFilterValue = (value) => {
        if (typeof value === "string") {
            setFilterType("string");
            return true;
        }

        if (typeof value === "object") {
            if (value.type === "bool") {
                setFilterType("bool");
                setFilterOptions(value.options);
                setCurrentOption(value.options[0]);
                setProcura(value.options[0]);
            }

            if (value.type === "date") {
                setFilterType("date");
                setFilterOptions(["gte", "lte"]);
                setCurrentOption("gte");
                setProcura(new Date());
            }

            if (value.type === "customValue") {
                setFilterType("customValue");
            }
        }
        
        return false;
    }

    useEffect(() => {
        verifyFilterValue(filtro);
        setProcura("");
        translateFiltro();
    }, [filtro]);

    useEffect(() => {
        if (filters) {
            props?.setFilters(filters);
        }
    }, [filters]);

    useEffect(() => {
        getFilters("page");
    }, [currentFragment]);

    useEffect(() => {
        window.addEventListener('item-deleted', refresh);
        return () => window.removeEventListener('item-deleted', refresh);
    }, [refresh]);
    
    return (
        <div className='mb-4'>
            <div className='grid grid-cols-1 gap-4 mb-4 md:grid-cols-[auto_auto] md:gap-6'>
                <Link
                    to={props?.addUrl}
                    className='shadow-md justify-self-end md:justify-self-start'
                >
                    <Button
                        variant="outline"
                        className='border-2 border-chart-2'
                    >
                        <Plus />
                        {props?.addLabel}
                    </Button>
                </Link>

                <div className='grid items-center justify-end gap-2 grid-cols-1 md:grid-cols-[auto_auto]'>
                    <div className='flex items-center justify-end row-end-3 sm:row-end-3 md:row-end-1'>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant='outline'
                                    disabled={props?.fetchLoading}
                                    onClick={refresh}
                                    className="rounded-r-none md:mr-2 md:rounded-[0.4rem] md:border-r border-r-0"
                                >
                                    <RefreshCw className={props?.fetchLoading ? 'animate-spin' : ''} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Recarregar
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant='outline'
                                    className="rounded-l-none md:rounded-[0.4rem]"
                                    onClick={refresh}
                                >
                                    <ListFilterPlus />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Adicionar a procura atual à lista de filtros
                            </TooltipContent>
                        </Tooltip>
                    </div>
                
                    <div className='flex items-center justify-end'>
                        {(filterType === "string" || filterType === "customValue") && 
                            <Input
                                placeholder={`Procurar por ${translateFiltro()}`}
                                className="rounded-r-none"
                                value={procura}
                                onChange={handleInputChange}
                                disabled={filterType === "customValue"}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        refresh("unique");
                                    }
                                }}
                            />
                        }

                        {filterType === "date" && 
                            <Popover className="rounded-r-none">
                                    <PopoverTrigger asChild className="rounded-r-none">
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal rounded-r-none",
                                                !procura && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="w-4 h-4 mr-2" />
                                            {procura ? moment(procura).format("DD/MM/YYYY") : <span>Selecione uma data</span>}
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={procura}
                                            onSelect={setProcura}
                                            initialFocus
                                        />
                                        
                                        {procura &&
                                            <div className="flex justify-center w-full mb-2">
                                                <Button 
                                                    variant='outline' 
                                                    onClick={cycleOptions}
                                                >
                                                    <span>
                                                        {currentOption === "lte" && <b>Antes </b>}
                                                        {currentOption === "gte" && <b>Depois </b>}
                                                        de {moment(procura).format("DD/MM/YYYY")}
                                                    </span>
                                                </Button>
                                            </div>
                                        }
                                    </PopoverContent>
                                </Popover>
                        }
                        
                        {filterType === "bool" && 
                            <Button 
                                variant='outline' 
                                onClick={cycleOptions}
                            >
                                {`${translateFiltro()}: ${currentOption}`}
                            </Button>
                        }

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant='outline'
                                    onClick={() => refresh("unique")}
                                    className="rounded-none border-x-0"
                                >
                                    <Search />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Procurar (Limpa a lista de filtros)
                            </TooltipContent>
                        </Tooltip>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="rounded-l-none"
                                >
                                    <Filter />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent 
                                className="w-56 bg-card/50 backdrop-blur-[12px] p-0"
                            >
                                <DropdownMenuLabel className="pt-2 pl-3 bg-card">
                                    Procurar por
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup 
                                    className='px-1 pb-1'
                                    value={filtro} 
                                    onValueChange={setFiltro}
                                >
                                    {Object.entries(props?.filters).map((item) => (
                                        <DropdownMenuRadioItem value={item[1]}>
                                            {item[0]}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            <ActiveFilters
                filterValue={setFilters}
                filterArray={setFiltersArr}
                params={filtersArr}
            />
        </div>)

}