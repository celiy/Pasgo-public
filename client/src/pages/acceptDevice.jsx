import AlertDialogComponent from '@/components/alert-dialog-component.jsx';
import { postRequest } from '@/hooks/axiosHook';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function AcceptDevice() {
    const [params, setParams] = React.useState(useParams());
    const navigate = useNavigate();
    const { postData, loading, postError, postedData } = postRequest('/api/v1/auth/accept-device');

    React.useEffect(() => {
        if (params.ip) {
            const postIp = async (itens) => {
                await postData(itens);
            }

            postIp({ ipToken: params.ip });
        }
    }, [params]);

    React.useEffect(() => {
        if (postedData) {
            navigate('/dashboard/inicio')
        }
    }, [postedData]);

    return (<>
        {(postError) && 
            <AlertDialogComponent
            tipo='warning'
            title='Erro!'
            desc={postError.message}
            onClose={() => {navigate('/')}}/>
        }
    </>)
}