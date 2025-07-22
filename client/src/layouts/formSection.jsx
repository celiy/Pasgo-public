import Helper from "@/elements/helper";
import React from "react";

export default function FormSection(props) {
    return (<>
        <div className='flex items-center gap-2 mb-2'>
            {props?.icon}

            <h4>
                {props?.title ?? "Algum erro aconteceu."}
            </h4>
            
            {props.helper && 
                <Helper 
                    type="text" 
                    desc="* Campos obrigatórios"
                />
            }
        </div>
        
        <section className="grid p-4 mb-6 border border-l-4 border-r-4 rounded-lg text-foreground/85">
            {props.children}
        </section>
    </>)
}

export function SectionHeader(props) {
    return (
        <div className={`col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-4 text-foreground ${props.className}`}>
            <h3>
                {props.children}
            </h3>
        </div>
    )
}