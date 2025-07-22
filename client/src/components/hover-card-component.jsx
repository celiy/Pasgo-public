import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card"

export default function HoverCardComponent (props) {
    return (
        <>
        <div className={`border-b cursor-pointer ${props.className}`}>
            <HoverCard>
                <HoverCardTrigger>{props.name}</HoverCardTrigger>
                <HoverCardContent>
                    {props.desc}
                </HoverCardContent>
            </HoverCard>
        </div>
        </>
        
    )
}