import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function InfiniteScroll(props) {
    return (<>
        <div
            className={
                `${props.className ?? ""} carousel`
            }
        >
            <div className="infinite-group">
                {props.children?.map((item) => (
                    <div>{item}</div>
                ))}
            </div>

            <div aria-hidden className="infinite-group">
                {props.children?.map((item) => (
                    <div>{item}</div>
                ))}
            </div>
            
            <div aria-hidden className="infinite-group">
                {props.children?.map((item) => (
                    <div>{item}</div>
                ))}
            </div>
        </div>
    </>)
}

export function ScrollItem(props) {
    return (<>
        <div>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Card className="flex items-center justify-center transition-all h-fit bg-card/50 hover:scale-110 hover:bg-foreground/10 hover:rounded-sm">
                        <CardContent
                            className="p-0"
                        >
                            <div className="p-4 text-foreground/75 hover:text-foreground">
                                {props?.icon}
                            </div>
                        </CardContent>
                    </Card>
                </TooltipTrigger>
                <TooltipContent>
                    {props?.description}
                </TooltipContent>
            </Tooltip>
        </div>
    </>)
}