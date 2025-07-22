import { RotateCw } from "lucide-react"

const Loading = () => {
    return (<>
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10 backdrop-blur-[1px] rounded">
            <div className="grid h-full justify-items-center place-items-center">
                <div className="flex gap-2">
                    <h4>Carregando</h4>
                    <RotateCw className="animate-spin"/>
                </div>
            </div>
        </div>
    </>)
}

export default Loading