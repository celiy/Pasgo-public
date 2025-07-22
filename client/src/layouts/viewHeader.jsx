import { DMA } from "@/hooks/getDatePTBR";
import React from "react";

export default function ViewHeader(props) {
    return (
        <div className='grid grid-cols-2'>
            <div className='flex items-center gap-2'>
                {props?.icon}
                <h3>
                    {props?.title ?? "Algum erro aconteceu."}
                </h3>
                <h4>
                    {props?.total}
                </h4>
            </div>
            <div className='justify-self-end'>
                <DMA />
            </div>
        </div>
    )
}