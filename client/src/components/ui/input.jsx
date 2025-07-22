import { cn } from "@/lib/utils"
import * as React from "react"
import { Label } from "./label"

const Input = React.forwardRef(
    ({ className, type, label, id, error, preventDefault, ...props }, ref) => {
        const validLabel = typeof label === "string" && label.trim() !== ""
        
        return (
            <div>
                {validLabel && (
                    <Label className="mb-1" htmlFor={id}>
                        {label}
                    </Label>
                )}
                <input
                    type={type}
                    className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        error && "border-red-500 focus-visible:ring-red-500",
                        className
                    )}
                    ref={ref}
                    id={id}
                    {...props}
                    onKeyPress={(e) => {
                        if (preventDefault && e.key === 'Enter') {
                            e.preventDefault()
                        }
                    }}
                />
                {error && (
                    <div className="mt-1 text-sm text-red-500">
                        {error}
                    </div>
                )}
            </div>
        )
    }
)

Input.displayName = "Input"
export { Input }

