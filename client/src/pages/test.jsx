import { ModeToggle } from "@/components/mode-toggle"

export default function Test() {
    return (<>
        <div className="w-full h-[100vh]">
            <ModeToggle className='m-2'/>
            <div className="grid w-full h-full grid-cols-6 mb-40">
                <div className="w-full h-full bg-accent">bg-accent</div>
                <div className="w-full h-full text-background bg-primary">bg-primary</div>
                <div className="w-full h-full bg-primary-foreground">bg-primary-foreground</div>
                <div className="w-full h-full bg-ring">bg-ring</div>
                <div className="w-full h-full bg-secondary">bg-secondary</div>
                <div className="w-full h-full bg-border">bg-border</div>
                <div className="w-full h-full bg-card">bg-card</div>
                <div className="w-full h-full bg-background">bg-background</div>
                <div className="w-full h-full text-background bg-foreground">bg-foreground</div>
                <div className="w-full h-full bg-muted">bg-muted</div>
                <div className="w-full h-full bg-input">bg-input</div>
                <div className="w-full h-full bg-sidebar">bg-sidebar (background)</div>
                <div className="w-full h-full bg-sidebar-primary">bg-sidebar-primary</div>
                <div className="w-full h-full bg-sidebar-ring">bg-sidebar-ring</div>
                <div className="w-full h-full bg-sidebar-accent">bg-sidebar-accent</div>
                <div className="w-full h-full text-background bg-sidebar-accent-foreground">bg-sidebar-accent-foreground</div>
                <div className="w-full h-full bg-sidebar-border">bg-sidebar-border</div>
                <div className="w-full h-full bg-chart-1">bg-chart-1</div>
                <div className="w-full h-full bg-chart-2">bg-chart-2</div>
                <div className="w-full h-full bg-chart-3">bg-chart-3</div>
                <div className="w-full h-full bg-chart-4">bg-chart-4</div>
                <div className="w-full h-full bg-chart-5">bg-chart-5</div>
                <div className="w-full h-full bg-destructive">bg-destructive</div>
            </div>
            <p style={{fontSize: "10rem"}}>Pasgo</p>
        </div>
    </>)
}