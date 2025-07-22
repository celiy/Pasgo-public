import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useEffect, useState } from "react";

const Helper = (props) => {
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();
        
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (props.type === "card") {
        return (<>
            {isMobile && 
                <AlertDialog>
                    <AlertDialogTrigger>
                        <Button variant="outline" className="w-fit bg-card hover:bg-card/50">
                            {props.title}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{props.title}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {props.desc}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction>
                                Ok
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            || 
                <HoverCard openDelay={0} closeDelay={0}>
                    <HoverCardTrigger 
                        className="flex items-center px-4 py-2 text-sm border rounded cursor-default bg-card hover:bg-card/50"
                    >
                        {props.title}
                    </HoverCardTrigger>
                    <HoverCardContent>
                        {props.desc}
                    </HoverCardContent>
                </HoverCard>
            }
        </>)
    }
    
    if (props.type === "text") {
        return (<>
            <span className="text-sm text-muted-foreground">
                <p style={ {lineHeight: '1.1rem'} }>
                    {props.desc}
                </p>
            </span>
        </>)
    }
}

export default Helper