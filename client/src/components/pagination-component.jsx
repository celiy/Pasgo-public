import { Button } from '@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

export default function PaginationComponent(props) {
    const [page, setPage] = useState(1);
    const [currents, setCurrents] = useState([]);

    const setCurrent = (funcProp) => {
        setPage(funcProp);
    }
    
    const setPrevious = () => {
        if (page > 1) {
            setPage(page-1);
        }
    }

    const setNext = () => {
        if (page < props.pages) {
            setPage(page+1);
        }
    }

    useEffect(() => {
        const url = new URL(window.location.href);
        const pageParam = url.hash.match(/page=(\d+)/);
        
        if (pageParam) {
            setPage(parseInt(pageParam[1]));
        }
    }, [window.location.href]);
    
    useEffect(() => {
        let pages = [];
        for (let n=0; n<props.pages; n++) {
            pages.push
            (<Link key={n} to={`#page=${n+1}`}>
                <PaginationItem key={n}>
                    <Button className="h-8 p-2 md:p-4 md:h-10"
                        onClick={() => setCurrent(n+1)} variant={page === n+1 ? 'outline' : 'ghost'}
                    >
                        {n+1}
                    </Button>
                </PaginationItem>
            </Link>
            );
        }
        
        let newcurrents = [];
        for (let n=0;n<pages.length;n++) {
            if (page === 1) {
                newcurrents.push(pages[0]);
                newcurrents.push(pages[1]);
                newcurrents.push(pages[2]);
                break;
            } else if (page < pages.length){
                newcurrents.push(pages[page-2]);
                newcurrents.push(pages[page-1]);
                if (page + 1 !== pages.length) newcurrents.push(pages[page]);
                break;
            } else if (page === pages.length) {
                newcurrents.push(pages[pages.length-2]);
                newcurrents.push(pages[pages.length-1]);
                break;
            }
        }

        setCurrents(newcurrents);
    }, [page, props.pages]);

    if (!props.pages || props.pages <= 1) {
        return null;
    }
    
    return (
        <Pagination className='mt-4'>
            <PaginationContent>
                <PaginationItem>
                    <Button className="h-8 p-2 md:p-4 md:h-10"
                        onClick={setPrevious} 
                        variant='ghost'
                    >
                        <ChevronLeft />
                    </Button>
                </PaginationItem>
                {page > 3 && <>
                <PaginationItem key={1}>
                    <Button className="h-8 p-2 md:p-4 md:h-10"
                        onClick={() => setCurrent(1)} 
                        variant='ghost'
                    >1</Button>
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                </>}
                {currents}
                {page < props.pages && <>
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem key={props.pages}>
                    <Button className="h-8 p-2 md:p-4 md:h-10"
                        onClick={() => setCurrent(props.pages)} 
                        variant='ghost'
                    >
                        {props.pages}
                    </Button>
                </PaginationItem>
                </>}
                <PaginationItem>
                    <Button className="h-8 p-2 md:p-4 md:h-10"
                        onClick={setNext} 
                        variant='ghost'
                    >
                        <ChevronRight />
                    </Button>
                </PaginationItem>
            </PaginationContent>
            <Navigate to={`#page=${page}`} />
        </Pagination>
    )
}

{/* <Pagination>
    <PaginationContent>
        <PaginationItem>
            <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
            <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
            <PaginationNext href="#" />
        </PaginationItem>
    </PaginationContent>
</Pagination> */}