import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { postRequest } from "@/hooks/axiosHook";
import { Frown, Meh, MessageSquare, Smile } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Helper from "./helper";

const FeedBack = (props) => {
    const { postData, data, postLoading, error } = postRequest('/api/v1/user/support');
    const [ message, setMessage ] = useState('');
    const [ score , setScore ] = useState(0);
    const [ isOpen, setIsOpen ] = useState(false);

    async function sendFeedBack() {
        try {
            const resposta = await postData({ message: message, type: "feedback", score: score });
    
            if (resposta.status == "success") {
                setMessage("");
                setScore(0);
                toast.success("Obrigado pelo seu FeedBack.");
            }
            
            return true;
        } catch (err) {
            toast.error(err.message);

            return false;
        }
    }
    
    const onCancel = () => {
        setIsOpen(false);
    };

    const onClose = async () => {
        if (await sendFeedBack()) setIsOpen(false);
    };

    const onOpen = () => {
        setIsOpen(true);
    };

    return (<>
        <AlertDialog open={isOpen}>
            <AlertDialogTrigger>
                <Button 
                    onClick={onOpen}
                    variant="ghost" 
                    className="w-full h-6 px-2 py-0 m-0"
                >
                    <MessageSquare />
                    FeedBack
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Enviar FeedBack</AlertDialogTitle>
                    <AlertDialogDescription>
                        <div className="flex flex-col items-center w-full">
                            <h4 className="font-medium">O quão satisfeito você está com a plataforma?</h4>
                            <div className="flex gap-2 mt-1 mb-8">
                                <Frown 
                                    onClick={() => {setScore(1); toast("Ruim")}}
                                    className={`w-10 h-10 transition-all hover:text-red-500 ${score == 1 ? 'text-red-500' : ''}`}
                                /> 
                                <Meh 
                                    onClick={() => {setScore(2); toast("Médio")}}
                                    className={`w-10 h-10 transition-all hover:text-yellow-500 ${score == 2 ? 'text-yellow-500' : ''}`}
                                /> 
                                <Smile 
                                    onClick={() => {setScore(3); toast("Bom")}}
                                    className={`w-10 h-10 transition-all hover:text-green-600 ${score == 3 ? 'text-green-600' : ''}`}
                                /> 
                            </div>

                            <h4 className="mb-1 font-medium">Escreva aqui o seu FeedBack</h4>
                            
                            <Textarea 
                                className="mb-1"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)} 
                            />
                            <Helper desc="Escolha um nível de satisfação e escreva o seu FeedBack (Mínimo 10 caracteres)." type="text" />
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction 
                        disabled={postLoading || message.length <= 10 || score == 0} 
                        onClick={onClose}
                    >
                        Enviar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>)
}

export default FeedBack