import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

function notFound(){
    const navigate = useNavigate()

    return(
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-6xl font-bold">404</h1>
            <p className="text-2xl">Página não encontrada</p>
            <p className="text-lg">Erro {navigator.onLine ? "404" : "offline"}</p>
            <Button className="mt-8 px-4 py-2" onClick={() => navigate(-1)}>Voltar</Button>
            <Button variant="outline" className="mt-2 px-4 py-2" onClick={() => navigate("/", { replace: true })}>Ir para a página inicial</Button>
        </div>
    )
}

export default notFound
