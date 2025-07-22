import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AnimatedLayout from '@/hooks/AnimatedLayout';
import { ChevronUp } from "lucide-react";
import React, { useEffect, useRef, useState } from 'react';

function TermsAndConditions() {
    const [width, setWidth] = useState(window.innerWidth);
    const targetRef = useRef(null);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    const isMobile = width < 768;

    function showBackToTop(show) {
        const topDownItems = document.querySelectorAll('#item-down-top');
        if (show) {
            topDownItems.forEach(item => item.classList.add('animate'));
        } else {
            topDownItems.forEach(item => item.classList.remove('animate'));
        }
    }

    useEffect(() => {
        const checkScrollDistance = () => {
            if (!targetRef.current) return;
            const rect = targetRef.current.getBoundingClientRect();
            const distanceFromViewport = Math.abs(rect.top);
            const threshold = isMobile ? 400 : 800;

            if (distanceFromViewport > threshold) {
                handleScrolledTooFar(true);
            } else {
                handleScrolledTooFar(false);
            }
        };

        window.addEventListener('scroll', checkScrollDistance);

        return () => {
            window.removeEventListener('scroll', checkScrollDistance);
        };
    }, []);

    const handleScrolledTooFar = (scrolledTooFar) => {
        if (scrolledTooFar) showBackToTop(true);
        else showBackToTop(false);
    };

    function scrollTo(id) {
        const element = document.querySelector(`#${id}`);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
            });
        }
    }

    useEffect(() => {
        const hash = window.location.hash;

        if (hash) {
            const element = document.querySelector(hash);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center'
                });
            }
        } else {
            const start = document.getElementById("start");
            if (start) {
                start.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center'
                });
            }
        }

    }, [])

    return (
        <AnimatedLayout>

            <div id="item-down-top"
                className="fixed z-50 bottom-4 right-4"
            >
                <Button className="flex gap-2"
                    onClick={() => scrollTo("start")}>
                    <ChevronUp />Voltar para o topo
                </Button>
            </div>

            <div id="start" ref={targetRef} />
            <section className="grid items-center mx-auto mt-16 sm:mt-24 md:mt-32 w-home-responsive gap-14">
                <header className='grid grid-cols-1 gap-6 py-8 mx-auto'>
                    <div className='grid gap-2 place-self-start'>
                        <h1>Termos de uso e política de privacidade</h1>
                        <h3 className='text-primary'>Por favor leia ambos para usar nossa aplicação.</h3>
                        <p className='font-medium leading-6 text-justify'>
                            Aviso! Qualquer violação dos nossos termos de uso pode resultar em sua conta sendo terminada e você como pessoa ser bloqueada de usar nossos serviços. Por favor leia com atenção e entenda seus direitos como uma pessoa.
                        </p>
                        <div className="grid grid-cols-1 gap-2 mt-4 md:grid-cols-2">
                            <Button variant="outline"
                                onClick={() => scrollTo("termos")}
                            >
                                Ir para Termos de uso
                            </Button>
                            <Button variant="outline"
                                onClick={() => scrollTo("privacidade")}
                            >
                                Ir para Políticas de privacidade
                            </Button>
                        </div>
                    </div>
                </header>
            </section>

            <section className="grid items-center w-full mt-10 border-y-2 gap-14 bg-sidebar/50">
                <article className='grid py-8 mx-auto mt-8 w-home-responsive'>
                    <div id="termos">
                        <h1>TERMOS DE USO</h1>
                        <h4>Última atualização em 06 de Maio, 2025</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-8 mt-10">
                        <div className="text-justify place-self-start">
                            <h2>ACORDO COM NOSSOS TERMOS LEGAIS</h2>
                            <p>
                                Nós operamos, bem como quaisquer outros produtos e serviços relacionados que façam referência ou link para estes Termos Legais (os "Termos Legais") (coletivamente, os "Serviços"). <br /><br />

                                Você pode entrar em contato conosco por e-mail em <a href="https://mail.google.com/mail/?view=cm&fs=1&to=sasbrazilian@gmail.com" className="underline">sasbrazilian@gmail.com</a> <br /><br />

                                Estes Termos Legais constituem um acordo legalmente vinculativo celebrado entre você, seja pessoalmente ou em nome de uma entidade ("você"), relativo ao seu acesso e uso dos Serviços. Você concorda que, ao acessar os Serviços, leu, entendeu e concordou em estar vinculado por todos estes Termos Legais. SE VOCÊ NÃO CONCORDA COM TODOS ESTES TERMOS LEGAIS, VOCÊ ESTÁ EXPRESSAMENTE PROIBIDO DE USAR OS SERVIÇOS E DEVE INTERROMPER O USO IMEDIATAMENTE. <br /><br />

                                Termos e condições adicionais ou documentos que possam ser publicados nos Serviços periodicamente são hereby expressly incorporados por referência. Reservamo-nos o direito, a nosso exclusivo critério, de fazer alterações ou modificações a estes Termos Legais a qualquer momento e por qualquer motivo. Alertaremos você sobre quaisquer alterações atualizando a data da "Última atualização" destes Termos Legais, e você renuncia a qualquer direito de receber aviso específico sobre cada alteração. É sua responsabilidade revisar periodicamente estes Termos Legais para se manter informado sobre atualizações. Você estará sujeito e será considerado ciente e terá aceitado as alterações em quaisquer Termos Legais revisados pelo seu uso contínuo dos Serviços após a data em que os Termos Legais revisados forem publicados. <br /><br />

                                Recomendamos que você imprima uma cópia destes Termos Legais para seus registros.
                            </p>
                        </div>
                        <div className="place-self-start">
                            <h2 className="text-left">TABELA DE CONTEÚDOS</h2>
                            <p className="text-left">
                                {
                                    [
                                        "1. NOSSOS SERVIÇOS",
                                        "2. DIREITOS DE PROPRIEDADE INTELECTUAL",
                                        "3. DECLARAÇÕES DO USUÁRIO",
                                        "4. ATIVIDADES PROIBIDAS",
                                        "5. CONTRIBUIÇÕES GERADAS PELO USUÁRIO",
                                        "6. LICENÇA DE CONTRIBUIÇÃO",
                                        "7. GERENCIAMENTO DOS SERVIÇOS",
                                        "8. PRAZO E RESCISÃO",
                                        "9. MODIFICAÇÕES E INTERRUPÇÕES",
                                        "10. LEI APLICÁVEL",
                                        "11. RESOLUÇÃO DE DISPUTAS",
                                        "12. CORREÇÕES",
                                        "13. ISENÇÃO DE GARANTIAS",
                                        "14. LIMITAÇÕES DE RESPONSABILIDADE",
                                        "15. INDENIZAÇÃO",
                                        "16. DADOS DO USUÁRIO",
                                        "17. COMUNICAÇÕES ELETRÔNICAS, TRANSAÇÕES E ASSINATURAS",
                                        "18. DISPOSIÇÕES DIVERSAS",
                                        "19. CONTATE-NOS"
                                    ].map((item, index) => <>
                                        <button key={index} onClick={() => scrollTo(`t${index + 1}`)}>
                                            <b className="underline">
                                                {item}
                                            </b>
                                        </button>
                                        <br />
                                    </>)
                                }
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="t1">1. NOSSOS SERVIÇOS</h2>
                            <p>
                                As informações fornecidas ao usar os Serviços não se destinam à distribuição ou uso por qualquer pessoa ou entidade em qualquer jurisdição ou país onde tal distribuição ou uso seria contrário à lei ou regulamento ou que nos sujeitaria a qualquer requisito de registro dentro de tal jurisdição ou país. <br /><br />

                                Consequentemente, as pessoas que optarem por acessar os Serviços de outros locais o fazem por sua própria conta e risco e são as únicas responsáveis pelo cumprimento das leis locais, se e na medida em que as leis locais forem aplicáveis.
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="t2">2. DIREITOS DE PROPRIEDADE INTELECTUAL</h2>
                            <p>
                                <b className="mb-2">Nossa propriedade intelectual</b><br />
                                Somos proprietários ou licenciantes de todos os direitos de propriedade intelectual em nossos Serviços, incluindo todo código-fonte, bancos de dados, funcionalidades, softwares, designs de sites, áudio, vídeo, texto, fotografias e gráficos nos Serviços (coletivamente, o "Conteúdo"), bem como as marcas registradas, marcas de serviço e logotipos contidos (as "Marcas"). <br /><br />

                                Nosso Conteúdo e Marcas são protegidos por leis de direitos autorais e de marcas registradas (e diversas outras leis de propriedade intelectual e concorrência desleal) e tratados internacionais. <br /><br />

                                O Conteúdo e as Marcas são disponibilizados nos Serviços "COMO ESTÁ" exclusivamente para seu uso pessoal, não comercial ou para fins comerciais internos. <br /><br />

                                <b>Seu uso de nossos Serviços</b><br />
                                Sujeito à sua conformidade com estes Termos Legais, incluindo a seção <button onClick={() => scrollTo("t4")}><b className="underline">"ATIVIDADES PROIBIDAS"</b></button> abaixo, concedemos a você uma licença não exclusiva, intransferível e revogável para:<br />
                                <li className="mt-2">acessar os Serviços; e</li>
                                <li>baixar ou imprimir uma cópia de qualquer parte do Conteúdo a que você teve acesso devidamente autorizado,</li>
                                <li>exclusivamente para seu uso pessoal, não comercial ou para fins comerciais internos.</li><br />

                                Exceto conforme estabelecido nesta seção ou em outras partes de nossos Termos Legais, nenhuma parte dos Serviços e nenhum Conteúdo ou Marcas poderão ser copiados, reproduzidos, agregados, republicados, carregados, publicados, exibidos publicamente, codificados, traduzidos, transmitidos, distribuídos, vendidos, licenciados ou explorados para qualquer finalidade comercial, sem nossa permissão prévia por escrito. <br /><br />

                                Se desejar fazer qualquer uso dos Serviços, Conteúdo ou Marcas além do estabelecido nesta seção ou em outras partes de nossos Termos Legais, encaminhe seu pedido para: <a href="https://mail.google.com/mail/?view=cm&fs=1&to=sasbrazilian@gmail.com" className="underline">sasbrazilian@gmail.com</a>. Se concedermos permissão para publicar, reproduzir ou exibir publicamente qualquer parte de nossos Serviços ou Conteúdo, você deve nos identificar como proprietários ou licenciadores dos Serviços, Conteúdo ou Marcas e garantir que qualquer aviso de direitos autorais ou propriedade seja exibido visivelmente ao publicar, reproduzir ou exibir nosso Conteúdo. <br /><br />

                                <b>Reservamos todos os direitos não expressamente concedidos a você sobre os Serviços, Conteúdo e Marcas.</b> <br /><br />

                                Qualquer violação destes Direitos de Propriedade Intelectual constituirá uma violação material de nossos Termos Legais e seu direito de usar nossos Serviços será imediatamente rescindido. <br /><br />

                                <b className="mb-2">Suas submissões</b><br />
                                Revise atentamente esta seção e a seção <button onClick={() => scrollTo("t4")}><b className="underline">"ATIVIDADES PROIBIDAS"</b></button> antes de usar nossos Serviços para entender (a) os direitos que você nos concede e (b) as obrigações que você assume ao postar ou enviar qualquer conteúdo através dos Serviços. <br /><br />

                                <b>Submissões:</b> Ao nos enviar diretamente qualquer pergunta, comentário, sugestão, ideia, feedback ou outra informação sobre os Serviços ("Submissões"), você concorda em ceder a nós todos os direitos de propriedade intelectual sobre tal Submissão. Você reconhece que seremos proprietários desta Submissão e teremos direito ao seu uso e divulgação irrestritos para qualquer finalidade lícita, comercial ou não, sem reconhecimento ou compensação a você. <br /><br />

                                <b>Você é responsável pelo que publica ou envia:</b> <br />
                                Ao nos enviar Submissões através de qualquer parte dos Serviços, você:<br />
                                <li className="mt-2">confirma que leu e concorda com nossa seção <button onClick={() => scrollTo("t4")}><b className="underline">"ATIVIDADES PROIBIDAS"</b></button> e não publicará, enviará ou transmitirá através dos Serviços qualquer Submissão ilegal, assediadora, de ódio, prejudicial, difamatória, obscena, intimidadora, abusiva, discriminatória, ameaçadora a qualquer pessoa ou grupo, sexualmente explícita, falsa, imprecisa, enganosa ou fraudulenta;</li>
                                <li>na medida permitida pela lei aplicável, renuncia a quaisquer direitos morais sobre tal Submissão;</li>
                                <li>garante que qualquer Submissão é original sua ou que você possui os direitos e licenças necessários para enviá-la e tem plena autoridade para nos conceder os direitos mencionados acima em relação às suas Submissões; e</li>
                                <li>declara e garante que suas Submissões não constituem informação confidencial.</li>
                                <li>Você é o único responsável por suas Submissões e concorda expressamente em nos reembolsar por quaisquer perdas que possamos sofrer devido à sua violação de (a) esta seção, (b) direitos de propriedade intelectual de terceiros, ou (c) leis aplicáveis.</li>
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="t3">3. DECLARAÇÕES DO USUÁRIO</h2>
                            <p>
                                <b className="mb-2">Ao usar os Serviços, você declara e garante que: </b> <br />
                                (1) você tem capacidade legal e concorda em cumprir estes Termos Legais; <br />
                                (2) não é menor de idade na jurisdição onde reside; <br />
                                (3) é brasileiro e reside em território nacional brasileiro; <br />
                                (4) não acessará os Serviços por meio de bots, scripts ou outros métodos automatizados/não humanos; <br />
                                (5) não usará os Serviços para fins ilegais ou não autorizados; e <br />
                                (6) seu uso dos Serviços não violará nenhuma lei ou regulamento aplicável. <br /><br />

                                Se você fornecer qualquer informação falsa, imprecisa, desatualizada ou incompleta, reservamo-nos o direito de suspender ou encerrar sua conta e recusar qualquer uso atual ou futuro dos Serviços (ou qualquer parte deles).
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="t4">4. ATIVIDADES PROIBIDAS</h2>
                            <p>
                                Você não poderá acessar ou usar os Serviços para qualquer finalidade além daquela para a qual disponibilizamos os Serviços. Os Serviços não podem ser usados em conexão com quaisquer empreendimentos comerciais, exceto aqueles especificamente endossados ou aprovados por nós. <br /><br />

                                <b className="mb-2">Como usuário dos Serviços, você concorda em não:</b>
                                <div className="flex flex-col gap-1">
                                    <li>Recuperar dados ou conteúdo de forma sistemática dos Serviços para criar ou compilar, direta ou indiretamente, uma coleção, compilação, banco de dados ou diretório sem permissão por escrito nossa.</li>
                                    <li>Enganar, fraudar ou induzir em erro a nós e outros usuários, especialmente em tentativas de obter informações sensíveis de contas como senhas de usuários.</li>
                                    <li>Contornar, desativar ou interferir em recursos de segurança dos Serviços, incluindo recursos que previnem ou restringem o uso/cópia de Conteúdo ou impõem limitações ao uso dos Serviços e/ou do Conteúdo neles contido.</li>
                                    <li>Difamar, manchar ou de qualquer forma prejudicar, em nossa avaliação, a nós e/ou aos Serviços.</li>
                                    <li>Usar informações obtidas dos Serviços para assediar, abusar ou prejudicar outra pessoa.</li>
                                    <li>Fazer uso inadequado de nossos serviços de suporte ou enviar relatórios falsos de abuso ou má conduta.</li>
                                    <li>Usar os Serviços de forma inconsistente com leis ou regulamentos aplicáveis.</li>
                                    <li>Realizar framing não autorizado ou links para os Serviços.</li>
                                    <li>Carregar ou transmitir (ou tentar) vírus, cavalos de Troia ou outros materiais, incluindo uso excessivo de letras maiúsculas e spam (postagem repetitiva contínua), que interfiram no uso ininterrupto dos Serviços ou modifiquem, prejudiquem, interrompam ou interfiram no uso, funcionalidades, operação ou manutenção dos Serviços.</li>
                                    <li>Utilizar qualquer sistema automatizado, como scripts para enviar comentários/mensagens, ou ferramentas de mineração de dados, robôs ou similares para coleta e extração de dados.</li>
                                    <li>Remover avisos de direitos autorais ou outros direitos proprietários de qualquer Conteúdo.</li>
                                    <li>Tentar se passar por outro usuário/pessoa ou usar o nome de usuário de terceiros.</li>
                                    <li>Carregar ou transmitir (ou tentar) qualquer material que atue como mecanismo de coleta/transmissão passiva ou ativa de informações, incluindo formats gráficos transparentes ("gifs"), pixels 1x1, web bugs, cookies ou dispositivos similares (conhecidos como "spyware", "mecanismos de coleta passiva" ou "pcms").</li>
                                    <li>Interferir, interromper ou sobrecarregar indevidamente os Serviços ou redes/serviços conectados a eles.</li>
                                    <li>Assediar, irritar, intimidar ou ameaçar nossos funcionários ou agentes envolvidos na prestação dos Serviços.</li>
                                    <li>Tentar contornar medidas de restrição de acesso aos Serviços ou qualquer parte deles.
                                        <li>Copiar ou adaptar o software dos Serviços, incluindo Flash, PHP, HTML, JavaScript ou outros códigos.</li>
                                        <li>Exceto conforme permitido por lei, decifrar, descompilar, desmontar ou fazer engenharia reversa de qualquer software dos Serviços.</li>
                                        <li>Exceto resultados de uso padrão de motores de busca/navegadores, usar, lançar, desenvolver ou distribuir sistemas automatizados como spiders, robôs, utilitários de trapaça, scrapers ou leitores offline que acessem os Serviços.</li>
                                        Usar agentes de compra para realizar aquisições nos Serviços.</li>
                                    <li>Fazer uso não autorizado dos Serviços, incluindo coleta de nomes de usuário/emails por meios eletrônicos para envio de spam ou criação de contas por meios automatizados sob falsos pretextos.</li>
                                    <li>Usar os Serviços para competir conosco ou para qualquer empreendimento comercial gerador de receita.</li>
                                </div>
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="t5">5. CONTRIBUIÇÕES GERADAS PELO USUÁRIO</h2>
                            <p>
                                Os Serviços não permitem que os usuários enviem ou postem conteúdo. Podemos oferecer a você a oportunidade de criar, enviar, publicar, exibir, transmitir, executar, publicar, distribuir ou transmitir conteúdo e materiais para nós ou através dos Serviços, incluindo, entre outros, texto, escritos, vídeo, áudio, fotografias, gráficos, comentários, sugestões, informações pessoais ou outros materiais (coletivamente, "Contribuições"). As Contribuições podem ser visualizadas por outros usuários dos Serviços e através de sites de terceiros.
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="t6">6. LICENÇA DE CONTRIBUIÇÃO</h2>
                            <p>
                                Você e os Serviços concordam que podemos acessar, armazenar, processar e usar quaisquer informações e dados pessoais que você fornecer e suas escolhas (incluindo configurações). <br /><br />

                                Ao enviar sugestões ou outros feedbacks sobre os Serviços, você concorda que podemos usar e compartilhar tais feedbacks para qualquer finalidade sem compensação a você. <br /><br />

                                <b>Não reivindicamos qualquer propriedade sobre suas Contribuições.</b> Você mantém a propriedade total de todas as suas Contribuições e quaisquer direitos de propriedade intelectual ou outros direitos proprietários associados a elas. Não somos responsáveis por quaisquer declarações ou representações em suas Contribuições fornecidas por você em qualquer área dos Serviços. Você é o único responsável por suas Contribuições aos Serviços e concorda expressamente em isentar-nos de qualquer e toda responsabilidade e em abster-se de qualquer ação legal contra nós relacionada às suas Contribuições.
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="t7">7. GERENCIAMENTO DOS SERVIÇOS</h2>
                            <p>
                                <b className="mb-2">Nós reservamos o direito de, mas não somos obrigados a: </b><br />
                                (1) monitorar os Serviços quanto a violações destes Termos Legais; <br />
                                (2) tomar as medidas legais cabíveis contra qualquer pessoa que, a nosso exclusivo critério, viole a lei ou estes Termos Legais, incluindo, entre outros, reportar tal usuário às autoridades policiais; <br />
                                (3) a nosso exclusivo critério e sem limitação, recusar, restringir acesso, limitar a disponibilidade ou desativar (na medida do tecnicamente viável) quaisquer de suas Contribuições ou parte delas; <br />
                                (4) a nosso exclusivo critério e sem limitação, aviso prévio ou responsabilidade, remover dos Serviços ou desativar arquivos e conteúdos excessivamente grandes ou que sobrecarreguem nossos sistemas de qualquer forma; <br />
                                (5) gerenciar os Serviços de outra forma de modo a proteger nossos direitos e propriedade e facilitar o funcionamento adequado dos Serviços.
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="t8">8. PRAZO E RESCISÃO</h2>
                            <p>
                                Estes Termos Legais permanecerão em pleno vigor e efeito enquanto você usar os Serviços. SEM LIMITAR QUALQUER OUTRA DISPOSIÇÃO DESTES TERMOS LEGAIS, RESERVAMO-NOS O DIREITO DE, A NOSSO EXCLUSIVO CRITÉRIO E SEM AVISO PRÉVIO OU RESPONSABILIDADE, NEGAR ACESSO E USO DOS SERVIÇOS (INCLUINDO O BLOQUEIO DE DETERMINADOS ENDEREÇOS IP), A QUALQUER PESSOA POR QUALQUER MOTIVO OU SEM MOTIVO, INCLUINDO, ENTRE OUTROS, POR VIOLAÇÃO DE QUALQUER DECLARAÇÃO, GARANTIA OU COMPROMISSO CONTIDO NESTES TERMOS LEGAIS OU DE QUALQUER LEI OU REGULAMENTO APLICÁVEL. PODEMOS ENCERRAR SEU USO OU PARTICIPAÇÃO NOS SERVIÇOS OU EXCLUIR QUALQUER CONTEÚDO OU INFORMAÇÃO QUE VOCÊ PUBLICOU A QUALQUER MOMENTO, SEM AVISO PRÉVIO, A NOSSO EXCLUSIVO CRITÉRIO. <br /><br />

                                Se encerrarmos ou suspendermos sua conta por qualquer motivo, você está proibido de registrar e criar uma nova conta em seu nome, um nome falso ou emprestado, ou o nome de qualquer terceiro, mesmo que esteja atuando em nome desse terceiro. Além de encerrar ou suspender sua conta, reservamo-nos o direito de tomar as medidas legais cabíveis, incluindo, entre outras, a busca de reparações cíveis, criminais e medidas judiciais injuntivas.
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="t9">9. MODIFICAÇÕES E INTERRUPÇÕES</h2>
                            <p>
                                Reservamo-nos o direito de alterar, modificar ou remover o conteúdo dos Serviços a qualquer momento ou por qualquer motivo, a nosso exclusivo critério e sem aviso prévio. No entanto, não temos obrigação de atualizar qualquer informação em nossos Serviços. Não seremos responsáveis perante você ou qualquer terceiro por qualquer modificação, alteração de preço, suspensão ou descontinuação dos Serviços. <br /><br />

                                Não podemos garantir que os Serviços estarão disponíveis o tempo todo. Podemos enfrentar problemas de hardware, software, ou outros, ou precisar realizar manutenção relacionada aos Serviços, resultando em interrupções, atrasos ou erros. Reservamo-nos o direito de alterar, revisar, atualizar, suspender, descontinuar ou modificar os Serviços a qualquer momento ou por qualquer motivo sem aviso prévio. Você concorda que não temos qualquer responsabilidade por perdas, danos ou inconvenientes causados por sua incapacidade de acessar ou usar os Serviços durante qualquer tempo de inatividade ou descontinuação dos Serviços. Nada nestes Termos Legais será interpretado como obrigando-nos a manter e dar suporte aos Serviços ou a fornecer correções, atualizações ou novas versões relacionadas a eles.
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="t10">10. LEI APLICÁVEL</h2>
                            <p>
                                Estes Termos Legais serão regidos e interpretados de acordo com as leis do Brasil. Você e o Brasil consentem de forma irrevogável que os tribunais do Brasil terão jurisdição exclusiva para resolver qualquer disputa que possa surgir em conexão com estes Termos Legais.
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="t11">11. RESOLUÇÃO DE DISPUTAS</h2>
                            <p>
                                <b className="mb-2">Negociação Informal</b> <br />
                                Para agilizar a resolução e controlar os custos de qualquer disputa, controvérsia ou reclamação relacionada a estes Termos Legais (cada uma uma "Disputa" e coletivamente, as "Disputas") apresentada por você ou por nós (individualmente, uma "Parte" e coletivamente, as "Partes"), as Partes concordam em primeiro tentar negociar qualquer Disputa (exceto aquelas expressamente previstas abaixo) informalmente por pelo menos 7 dias antes de iniciar uma arbitragem. Essas negociações informais começam com uma notificação por escrito de uma Parte para a outra.<br /><br />

                                <b>Arbitragem Vinculante</b> <br />
                                As Partes concordam que qualquer arbitragem será limitada à Disputa entre as Partes individualmente. Na máxima extensão permitida por lei: (a) nenhuma arbitragem será unida a outro processo; (b) não há direito ou autoridade para que qualquer Disputa seja arbitrada em base de ação coletiva ou utilizando procedimentos de ação coletiva; e (c) não há direito ou autoridade para que qualquer Disputa seja apresentada em capacidade representativa em nome do público geral ou de outras pessoas. <br /><br />

                                <b className="mb-2">Exceções às Negociações Informais e Arbitragem</b> <br />
                                As Partes concordam que as seguintes Disputas não estão sujeitas às disposições acima sobre negociações informais e arbitragem vinculante: (a) Disputas que busquem fazer valer ou proteger, ou que concernem à validade de direitos de propriedade intelectual de uma Parte; (b) Disputas relacionadas a ou decorrentes de alegações de roubo, pirataria, invasão de privacidade ou uso não autorizado; e (c) qualquer pedido de medida liminar. Se esta disposição for considerada ilegal ou inexequível, nenhuma Parte optará por arbitrar qualquer Disputa enquadrada na parte considerada ilegal/inexequível, e tal Disputa será decidida por tribunal competente dentro da jurisdição listada acima, com as Partes concordando em se submeter à jurisdição pessoal desse tribunal.
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="t12">12. CORREÇÕES</h2>
                            <p>
                                Pode haver informações nos Serviços que contenham erros tipográficos, imprecisões ou omissões, incluindo descrições, preços, disponibilidade e diversas outras informações. Reservamo-nos o direito de corrigir quaisquer erros, imprecisões ou omissões e de alterar ou atualizar as informações nos Serviços a qualquer momento, sem aviso prévio.
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="t13">13. ISENÇÃO DE GARANTIAS</h2>
                            <p>
                                OS SERVIÇOS SÃO FORNECIDOS "COMO ESTÃO" E "COMO DISPONÍVEIS". VOCÊ CONCORDA QUE SEU USO DOS SERVIÇOS SERÁ POR SUA CONTA E RISCO. NA MÁXIMA EXTENSÃO PERMITIDA POR LEI, RENUNCIAMOS A TODAS AS GARANTIAS, EXPRESSAS OU IMPLÍCITAS, RELACIONADAS AOS SERVIÇOS E AO SEU USO DOS MESMOS, INCLUINDO, SEM LIMITAÇÃO, AS GARANTIAS IMPLÍCITAS DE COMERCIALIZAÇÃO, ADEQUAÇÃO A UM PROPÓSITO ESPECÍFICO E NÃO VIOLAÇÃO. NÃO GARANTIMOS OU DECLARAMOS QUE O CONTEÚDO DOS SERVIÇOS OU DE QUALQUER SITE OU APLICATIVO MÓVEL VINCULADO AOS SERVIÇOS SEJA PRECISO OU COMPLETO, E NÃO ASSUMIMOS QUALQUER RESPONSABILIDADE POR: (1) ERROS, EQUÍVOCOS OU IMPRECISÕES DE CONTEÚDO E MATERIAIS; (2) DANOS PESSOAIS OU MATERIAIS DE QUALQUER NATUREZA DECORRENTES DO SEU ACESSO OU USO DOS SERVIÇOS; (3) QUALQUER ACESSO NÃO AUTORIZADO AOS NOSSOS SERVIDORES SEGUROS E/OU A QUALQUER INFORMAÇÃO PESSOAL E/OU FINANCEIRA ARMAZENADA NELES; (4) QUALQUER INTERRUPÇÃO OU SUSPENSÃO DE TRANSMISSÃO DE/PARA OS SERVIÇOS; (5) QUALQUER BUG, VÍRUS, CAVALOS DE TROIA OU SIMILARES QUE POSSAM SER TRANSMITIDOS POR TERCEIROS ATRAVÉS DOS SERVIÇOS; E/OU (6) ERROS OU OMISSÕES EM CONTEÚDO/MATERIAIS OU DANOS DECORRENTES DO USO DE QUALQUER CONTEÚDO DISPONIBILIZADO NOS SERVIÇOS. NÃO RESPONSABILIZAMOS POR PRODUTOS/SERVIÇOS DE TERCEIROS ANUNCIADOS NOS SERVIÇOS, QUALQUER SITE HIPERLINKADO OU ANÚNCIO, E NÃO MONITORAMOS TRANSACÕES ENTRE VOCÊ E TERCEIROS. AO ADQUIRIR PRODUTOS/SERVIÇOS ATRAVÉS DOS SERVIÇOS, USE SEU BOM SENSO E AGUDE COM CAUTELA.
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="t14">14. LIMITAÇÕES DE RESPONSABILIDADE</h2>
                            <p>
                                EM NENHUM CASO NÓS, NOSSOS DIRETORES, FUNCIONÁRIOS OU AGENTES SEREMOS RESPONSÁVEIS PERANTE VOCÊ OU TERCEIROS POR QUAISQUER DANOS DIRETOS, INDIRETOS, CONSEQUENCIAIS, EXEMPLARES, INCIDENTAIS, ESPECIAIS OU PUNITIVOS, INCLUINDO PERDA DE LUCRO, RECEITA, PERDA DE DADOS OU OUTROS DANOS DECORRENTES DO SEU USO DOS SERVIÇOS, MESMO SE AVISADOS DA POSSIBILIDADE DE TAIS DANOS. NÃO OBSTANTE QUALQUER DISPOSIÇÃO EM CONTRÁRIO AQUI CONTIDA, NOSSA RESPONSABILIDADE PARA COM VOCÊ POR QUALQUER MOTIVO E INDEPENDENTEMENTE DA FORMA DA AÇÃO SERÁ SEMPRE LIMITADA AO MENOR VALOR ENTRE O VALOR PAGO, SE HOUVER, POR VOCÊ A NÓS OU CERTAS LEIS ESTADUAIS DOS EUA E LEIS INTERNACIONAIS NÃO PERMITEM LIMITAÇÕES EM GARANTIAS IMPLÍCITAS OU A EXCLUSÃO/LIMITAÇÃO DE CERTOS DANOS. SE ESSAS LEIS SE APLICAREM A VOCÊ, ALGUMAS OU TODAS AS RENÚNCIAS/LIMITAÇÕES ACIMA PODEM NÃO SE APLICAR, E VOCÊ PODERÁ TER DIREITOS ADICIONAIS.
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="t15">15. INDENIZAÇÃO</h2>
                            <p>
                                Você concorda em defender, indenizar e isentar de responsabilidade nós, nossas subsidiárias, afiliadas e todos os nossos diretores, agentes, parceiros e funcionários, de e contra quaisquer perdas, danos, responsabilidades, reclamações ou demandas, incluindo honorários e despesas razoáveis de advogados, feitas por terceiros decorrentes ou relacionados a: (1) uso dos Serviços; (2) violação destes Termos Legais; (3) quebra de quaisquer declarações e garantias previstas nestes Termos Legais; (4) violação de direitos de terceiros, incluindo, mas não se limitando a, direitos de propriedade intelectual; ou (5) qualquer ato prejudicial manifesto contra outro usuário dos Serviços com quem você se conectou através dos Serviços. Não obstante o exposto acima, reservamo-nos o direito, às suas custas, de assumir a defesa e controle exclusivos de qualquer questão sujeita a esta indenização, e você concorda em cooperar, às suas custas, com nossa defesa nessas reclamações. Faremos esforços razoáveis para notificá-lo sobre qualquer reclamação, ação ou processo sujeito a esta indenização assim que tomarmos conhecimento.
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="t16">16. DADOS DO USUÁRIO</h2>
                            <p>
                                Manteremos certos dados que você transmitir aos Serviços para gerenciar seu desempenho, bem como dados relacionados ao seu uso dos Serviços. Embora realizemos backups rotineiros dos dados, você é o único responsável por todos os dados transmitidos ou relacionados a qualquer atividade realizada através dos Serviços.
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="t17">17. COMUNICAÇÕES ELETRÔNICAS, TRANSAÇÕES E ASSINATURAS</h2>
                            <p>
                                Acessar os Serviços, enviar e-mails e preencher formulários online constituem comunicações eletrônicas. Você consente em receber comunicações eletrônicas e concorda que todos os acordos, avisos, divulgações e demais comunicações que lhe fornecermos eletronicamente, via e-mail e nos Serviços, satisfazem qualquer exigência legal de que tal comunicação seja por escrito. VOCÊ POR MEIO DESTE CONCORDA COM O USO DE ASSINATURAS ELETRÔNICAS, CONTRATOS, ORDENS E OUTROS REGISTROS, E COM A ENTREGA ELETRÔNICA DE NOTIFICAÇÕES, POLÍTICAS E REGISTROS DE TRANSAÇÕES INICIADAS OU CONCLUÍDAS POR NÓS OU ATRAVÉS DOS SERVIÇOS. Você por meio deste renuncia a quaisquer direitos ou exigências sob estatutos, regulamentos, regras, portarias ou outras leis em qualquer jurisdição que exijam assinatura original, entrega ou retenção de registros não eletrônicos, ou a pagamentos/concessão de créditos por outros meios que não eletrônicos.
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="t18">18. DISPOSIÇÕES DIVERSAS</h2>
                            <p>
                                Estes Termos Legais e quaisquer políticas ou regras operacionais publicadas por nós nos Serviços ou relativos aos Serviços constituem o acordo completo e entendimento entre você e nós. Nossa falha em exercer ou exigir qualquer direito ou disposição destes Termos Legais não operará como renúncia a tal direito ou disposição. Estes Termos Legais operam na máxima extensão permitida por lei. Podemos ceder quaisquer ou todos nossos direitos e obrigações a terceiros a qualquer momento. Não seremos responsáveis ou responsabilizados por quaisquer perdas, danos, atrasos ou falhas de ação causadas por qualquer motivo fora de nosso controle razoável. Se qualquer disposição ou parte de uma disposição destes Termos Legais for considerada ilegal, inválida ou inexequível, tal disposição ou parte será considerada separável destes Termos Legais e não afetará a validade e aplicabilidade das disposições restantes. Nenhum relacionamento de joint venture, parceria, emprego ou agência é criado entre você e nós como resultado destes Termos Legais ou uso dos Serviços. Você concorda que estes Termos Legais não serão interpretados contra nós pelo fato de termos redigido os mesmos. Você por meio deste renuncia a quaisquer defesas baseadas na forma eletrônica destes Termos Legais e na ausência de assinaturas das partes para execução destes Termos Legais.
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="t19">19. CONTATE-NOS</h2>
                            <p>
                                Para registrar uma reclamação sobre os Serviços ou obter mais informações sobre seu uso, entre em contato conosco em: <a href="https://mail.google.com/mail/?view=cm&fs=1&to=sasbrazilian@gmail.com" className="underline">sasbrazilian@gmail.com</a>.
                            </p>
                        </div>
                    </div>
                </article>
            </section>

            <Separator className="my-10" />

            <section className="grid items-center w-full border-y-2 gap-14 bg-sidebar/50">
                <article className='grid py-8 mx-auto mt-8 w-home-responsive'>
                    <div>
                        <h1 id="privacidade">POLÍTICA DE PRIVACIDADE</h1>
                        <h4>Última atualização em 06 de Maio, 2025</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-8 mt-10">
                        <div className="text-justify place-self-start">
                            <p>
                                Esta Política de Privacidade da Pasgo descreve como e por que podemos acessar, coletar, armazenar, usar e/ou compartilhar ('processar') suas informações pessoais quando você usa nossos serviços ('Serviços'), incluindo quando você:
                                <li className="mt-2">Visite nosso site em <a href="https://pasgo.com.br" className="underline">pasgo.com.br</a>, ou qualquer site nosso que link para esta Política de Privacidade.</li>
                                <li>Utiliza o Pasgo - Aplicação Web inteiramente gratuita de gestão empresarial (ERP) para micro e pequenas empresas.</li>
                                <li>Interage conosco de outras formas relacionadas, incluindo vendas, marketing ou eventos.</li> <br />
                                <b>Dúvidas ou preocupações?</b> Ler esta Política de Privacidade ajudará você a entender seus direitos de privacidade e opções. Somos responsáveis por tomar decisões sobre como suas informações pessoais são processadas. Se você não concordar com nossas políticas e práticas, por favor não use nossos Serviços. Se ainda tiver dúvidas ou preocupações, entre em contato conosco em <a href="https://mail.google.com/mail/?view=cm&fs=1&to=sasbrazilian@gmail.com" className="underline">sasbrazilian@gmail.com.</a>
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2>RESUMO DOS PONTOS PRINCIPAIS</h2>
                            <p>
                                Este resumo fornece os principais pontos de nossa Política de Privacidade, mas você pode obter mais detalhes sobre qualquer tópico clicando no link após cada ponto-chave ou usando nosso índice abaixo para encontrar a seção desejada. <br /><br />

                                <b>Quais informações pessoais processamos?</b> Ao visitar, usar ou navegar em nossos Serviços, podemos processar informações pessoais dependendo de como você interage conosco, das escolhas feitas e dos recursos utilizados. Saiba mais sobre <button onClick={() => scrollTo("p1")}><b className="underline">as informações pessoais que você nos divulga.</b></button> <br /><br />

                                <b>Processamos dados pessoais sensíveis?</b> Algumas informações podem ser consideradas 'especiais' ou 'sensíveis' em certas jurisdições, como origem racial/étnica, orientação sexual ou crenças religiosas. Não processamos dados pessoais sensíveis. <br /><br />

                                <b>Coletamos informações de terceiros?</b> Não coletamos informações de terceiros. <br /><br />

                                <b>Como processamos suas informações?</b> Processamos para fornecer, melhorar e administrar os Serviços, comunicar-nos, prevenir fraudes e cumprir a lei. Também podemos processar com seu consentimento. Só processamos quando há razão legal válida. Saiba mais sobre <button onClick={() => scrollTo("p2")}><b className="underline">como processamos suas informações.</b></button> <br /><br />

                                <b>Com quem compartilhamos informações?</b> Podemos compartilhar em situações específicas e com terceiros específicos. Saiba mais sobre <button onClick={() => scrollTo("p3")}><b className="underline">quando e com quem compartilhamos suas informações.</b></button> <br /><br />

                                <b>Como protegemos suas informações?</b> Implementamos processos organizacionais e técnicos para proteger seus dados. Porém, nenhuma transmissão ou armazenamento é 100% seguro, não podendo garantir que hackers ou terceiros não consigam acessar/roubar/modificar informações. Saiba mais sobre <button onClick={() => scrollTo("p7")}><b className="underline">nossas medidas de segurança.</b></button> <br /><br />

                                <b>Quais são seus direitos?</b> Dependendo de sua localização, leis locais podem garantir direitos sobre seus dados. Saiba mais sobre <button onClick={() => scrollTo("p9")}><b className="underline">seus direitos de privacidade.</b></button> <br /><br />

                                <b>Como exercer seus direitos?</b> A maneira mais fácil é entrando em contato. Analisaremos solicitações conforme leis de proteção de dados aplicáveis. <br /><br />

                                <b>Quer detalhes sobre o uso de suas informações?</b> <button onClick={() => scrollTo("privacidade")}><b className="underline">Revise a Política de Privacidade completa.</b></button>
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2>TABELA DE CONTEÚDOS</h2>
                            <p>
                                {
                                    [
                                        "1. QUE INFORMAÇÕES COLETAMOS?",
                                        "2. COMO PROCESSAMOS SUAS INFORMAÇÕES?",
                                        "3. QUANDO E COM QUEM COMPARTILHAMOS SUAS INFORMAÇÕES PESSOAIS?",
                                        "4. QUAL É NOSSA POSIÇÃO SOBRE SITES DE TERCEIROS?",
                                        "5. USAMOS COOKIES E OUTRAS TECNOLOGIAS DE RASTREAMENTO?",
                                        "6. POR QUANTO TEMPO MANTEMOS SUAS INFORMAÇÕES?",
                                        "7. COMO MANTEMOS SUAS INFORMAÇÕES SEGURAS?",
                                        "8. COLETAMOS INFORMAÇÕES DE MENORES?",
                                        "9. QUAIS SÃO SEUS DIREITOS DE PRIVACIDADE?",
                                        "10. CONTROLES PARA RECURSOS DE NÃO RASTREAR",
                                        "11. FAZEMOS ATUALIZAÇÕES NESTE AVISO?",
                                        "12. COMO VOCÊ PODE NOS CONTATAR SOBRE ESTE AVISO?",
                                        "13. COMO VOCÊ PODE REVISAR, ATUALIZAR OU EXCLUIR OS DADOS QUE COLETAMOS SOBRE VOCÊ?"
                                    ].map((item, index) => <><button key={index} onClick={() => scrollTo(`p${index + 1}`)}><b className="underline">{item}</b></button><br /></>)
                                }
                                <b className="underline">
                                </b>
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="p1">1. QUE INFORMAÇÕES COLETAMOS?</h2>
                            <h3>Informações pessoais que você fornece para a gente</h3>
                            <p>
                                <b>Em resumo:</b> Coletamos informações pessoais que você nos fornece. <br /><br />

                                Coletamos informações pessoais que você fornece voluntariamente ao se registrar nos Serviços, demonstrar interesse em obter informações sobre nós ou nossos produtos/Serviços, participar de atividades nos Serviços ou entrar em contato conosco. <br /><br />

                                <b>Informações Pessoais Fornecidas por Você.</b> As informações coletadas dependem do contexto de sua interação com os Serviços, escolhas feitas e recursos utilizados. As informações podem incluir:<br />
                                <li className="mt-2">Nomes</li>
                                <li>Números de telefone</li>
                                <li>Endereços de e-mail</li>
                                <li><b>CPF ou CNPJ:</b> obrigatório para validar sua identidade e garantir que o usuário é residente no Brasil.</li>
                                <li>RG</li>
                                <li>Localizações</li>
                                <li>Senhas</li>
                                <li>Dados de contato ou autenticação</li>
                                <li><b>Informações Sensíveis.</b> Não processamos informações sensíveis.</li><br />

                                Todas as informações pessoais fornecidas devem ser verdadeiras, completas e precisas, e você deve nos notificar sobre quaisquer alterações.<br /><br />
                                <b>Google API</b><br />
                                Nosso uso de informações das APIs do Google seguirá a <a href="https://developers.google.com/terms/api-services-user-data-policy" className="underline">Política de Dados do Usuário dos Serviços de API do Google</a>, incluindo os <a href="https://developers.google.com/terms/api-services-user-data-policy#limited-use" className="underline">Requisitos de Uso Limitado</a>.
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="p2">2. COMO PROCESSAMOS SUAS INFORMAÇÕES?</h2>
                            <p>
                                <b>Em resumo:</b> Processamos suas informações para fornecer, melhorar e administrar nossos Serviços, comunicar-nos com você, prevenir fraudes e cumprir a lei. Também podemos processar suas informações para outros fins com seu consentimento. <br /><br />

                                Processamos suas informações pessoais por diversas razões, dependendo de como você interage com nossos Serviços, incluindo:<br />
                                <li className="mt-2"><b>Para facilitar criação/autenticação de contas e gerenciar usuários.</b> Processamos para permitir criação/login e manter contas ativas.</li>
                                <li><b>Fornecer e entregar serviços ao usuário.</b> Processamos para oferecer os serviços solicitados.</li>
                                <li><b>Responder solicitações e oferecer suporte.</b> Processamos para resolver questões relacionadas aos serviços.</li>
                                <li><b>Enviar informações administrativas.</b> Processamos para comunicar mudanças em termos/políticas e detalhes de produtos.</li>
                                <li><b>Solicitar feedback.</b> Processamos para obter avaliações sobre seu uso dos Serviços.</li>
                                <li><b>Proteger nossos Serviços.</b> Processamos para manter segurança, incluindo monitoramento e prevenção de fraudes.</li>
                                <li><b>Avaliar e melhorar Serviços/produtos/marketing.</b> Processamos para identificar tendências de uso e aprimorar experiências.</li>
                                <li><b>Medir eficácia de campanhas.</b> Processamos para entender como oferecer promoções mais relevantes.</li>
                                <li><b>Cumprir obrigações legais.</b> Processamos para atender exigências legais, responder a requisições jurídicas e defender direitos legais.</li>
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="p3">3. QUANDO E COM QUEM COMPARTILHAMOS SUAS INFORMAÇÕES PESSOAIS?</h2>
                            <p>
                                <b>Em resumo:</b> Não compartilhamos suas informações pessoais com ninguém.<br /><br />

                                Não temos nenhuma relação ou compromisso com qualquer outro orgão de terceiro, motivo ou razão para compartilhar suas informações pessoais.
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="p4">4. QUAL É NOSSA POSIÇÃO SOBRE SITES DE TERCEIROS?</h2>
                            <p>
                                <b>Em resumo:</b> Não somos responsáveis pela segurança de quaisquer informações compartilhadas com terceiros que possam estar vinculados ou anunciar em nossos Serviços, mas que não são afiliados a nós.<br /><br />

                                Os Serviços podem conter links para sites, serviços online ou aplicativos móveis de terceiros e/ou anúncios de terceiros não afiliados, que podem linkar para outros sites/serviços. Portanto, não garantimos quaisquer desses terceiros e não seremos responsáveis por perdas ou danos decorrentes do uso desses serviços. A inclusão de um link não implica endosso nosso. Não garantimos a segurança e privacidade dos dados fornecidos a sites de terceiros. Dados coletados por terceiros não são cobertos por esta Política. Não nos responsabilizamos por conteúdo, práticas de privacidade/segurança de terceiros, incluindo sites/serviços vinculados aos Serviços. Você deve revisar as políticas desses terceiros e contatá-los diretamente para esclarecer dúvidas.
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="p5">5. USAMOS COOKIES E OUTRAS TECNOLOGIAS DE RASTREAMENTO?</h2>
                            <p>
                                <b>Em resumo:</b> Não utilizamos cookies e outras tecnologias de rastreamento para coletar ou armazenar suas informações. <br /><br />

                                Não utilizamos cookies e tecnologias de rastreamento similares (como web beacons e pixels de rastreamento) para coletar dados quando você interage com nossos Serviços.
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="p6">6. POR QUANTO TEMPO MANTEMOS SUAS INFORMAÇÕES?</h2>
                            <p>
                                <b>Em resumo:</b> Mantemos suas informações por até 1 ano a partir da data de criação da conta. Após esse período, solicitaremos um novo consentimento para continuar com a conta ativa. Caso você não aceite, sua conta e dados serão marcados para exclusão em até 90 dias. <br /><br />
                                
                                Caso você como usuário não tenha efetuado a ação de login em um ano, iremos alertar você sobre o período de inatividade pelo seu e-mail cadastrado, que sua conta será excluída em 90 (noventa) dias. Após o período de 1 (um) ano e 90 (noventa) dias, se você não efetuar o login novamente, sua conta e seus dados serão excluídos após esse período. Se você desejar excluir seus dados, você pode fazer essa solicitação diretamente em seu perfil. Após a solicitação, seus dados serão marcados para exclusão e você poderá recuperá-los em até 30 dias. Após esse período, a exclusão será definitiva.<br /><br />
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="p7">7. COMO MANTEMOS SUAS INFORMAÇÕES SEGURAS?</h2>
                            <p>
                                <b>Em resumo:</b> Buscamos proteger suas informações pessoais através de um sistema de medidas técnicas, organizacionais de segurança e backup de dados.<br /><br />

                                Implementamos medidas de segurança técnicas e organizacionais adequadas e razoáveis para proteger quaisquer informações pessoais que processamos. Fazemos backups rotineiros de seus dados, garantindo que nenhuma perda ou corrupção seja permanente. Caso ocorra qualquer falha técnica, temos recursos para recuperar os seus dados. No entanto, apesar de nossos esforços, nenhuma transmissão eletrônica pela Internet ou tecnologia de armazenamento pode ser garantida como 100% segura. Portanto, não podemos prometer ou garantir que hackers, cibercriminosos ou terceiros não autorizados não consigam violar nossa segurança e coletar, acessar, roubar ou modificar suas informações indevidamente. Nós fazemos o nosso melhor para segurar os dados do usuário e se alguma descrepância, ataque for percebido por nós, iremos te alertar o quanto antes e tomar as medidas necessárias para segurar seus dados.
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="p8">8. COLETAMOS INFORMAÇÕES DE MENORES?</h2>
                            <p>
                                <b>Em resumo:</b> Não coletamos intencionalmente dados de ou direcionamos marketing a menores de 18 anos. <br /><br />

                                Não coletamos intencionalmente, solicitamos dados ou direcionamos marketing a menores de 18 anos, tampouco vendemos tais informações pessoais. Ao usar os Serviços, você declara ter pelo menos 18 anos ou ser pai/mãe/responsável por um menor e consentir com o uso dos Serviços por esse dependente. Se descobrirmos que informações pessoais de usuários menores de 18 anos foram coletadas, desativaremos a conta e tomaremos medidas razoáveis para excluir prontamente esses dados de nossos registros. Se você tomar conhecimento de qualquer dado que possamos ter coletado de menores de 18 anos, entre em contato conosco em <a href="https://mail.google.com/mail/?view=cm&fs=1&to=sasbrazilian@gmail.com" className="underline">sasbrazilian@gmail.com.</a>
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="p9">9. QUAIS SÃO SEUS DIREITOS DE PRIVACIDADE?</h2>
                            <p>
                                <b>Em resumo:</b> Você pode revisar, alterar ou encerrar sua conta a qualquer momento, dependendo de seu país, província ou estado de residência. <br /><br />

                                <b>Retirada de consentimento:</b> Se dependermos de seu consentimento para processar suas informações (que pode ser expresso e/ou tácito conforme a lei aplicável), você tem o direito de retirar seu consentimento a qualquer momento. Você pode fazê-lo entrando em contato através dos detalhes na seção <button onClick={() => scrollTo("p12")}><b className="underline">'COMO VOCÊ PODE NOS CONTATAR SOBRE ESTE AVISO?'</b></button> abaixo. <br /><br />

                                Entretanto, isso não afetará a legalidade do processamento anterior à retirada nem, quando permitido por lei, o processamento baseado em fundamentos legais além do consentimento. <br /><br />

                                <b>Informações da Conta</b>
                                <li className="mt-2">Para revisar/alterar informações ou encerrar sua conta a qualquer momento, entre em contato conosco.</li>
                                <li>Faça login nas configurações da conta para atualizar suas informações.</li>
                                <li className="mb-2">Ao solicitar encerramento da conta, desativaremos ou excluiremos seus dados de nossas bases ativas. Podemos reter algumas informações para prevenir fraudes, solucionar problemas, auxiliar investigações, cumprir termos legais e/ou exigências legais.</li>

                                <b>Cookies e tecnologias similares:</b> A maioria dos navegadores aceita cookies por padrão. Você pode configurar seu navegador para remover/rejeitar cookies, mas isso pode afetar funcionalidades dos Serviços. Também pode desativar anúncios direcionados. <br /><br />

                                Para dúvidas sobre direitos de privacidade, envie e-mail para <a href="https://mail.google.com/mail/?view=cm&fs=1&to=sasbrazilian@gmail.com" className="underline">sasbrazilian@gmail.com.</a>
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="p10">10. CONTROLES PARA RECURSOS DE NÃO RASTREAR</h2>
                            <p>
                                A maioria dos navegadores web e algumas plataformas e aplicações móveis incluem um recurso ou configuração “Não Rastrear” (DNT) que você pode ativar para sinalizar sua preferência de privacidade de não ter dados sobre suas atividades de navegação online monitorados e coletados. Nesta fase, nenhum padrão tecnológico uniforme para reconhecer e implementar sinais DNT foi finalizado. Dessa forma, atualmente não respondemos a sinais DNT do navegador nem a qualquer outro mecanismo que comunique automaticamente sua escolha de não ser rastreado online. Caso um padrão para rastreamento online seja adotado e sejamos obrigados a segui-lo no futuro, informaremos sobre essa prática em uma versão revisada deste Aviso de Privacidade.
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="p11">11. FAZEMOS ATUALIZAÇÕES NESTE AVISO?</h2>
                            <p>
                                <b>Em resumo:</b> Sim, atualizaremos este Aviso de Privacidade conforme necessário para permanecer em conformidade com as leis relevantes. <br /><br />

                                <b>Podemos atualizar este Aviso de Privacidade de tempos em tempos.</b> A versão atualizada será indicada por uma data 'Revisado' atualizada no topo deste Aviso de Privacidade. Se fizermos alterações significativas neste Aviso de Privacidade, poderemos notificá-lo, seja publicando de forma destacada um aviso dessas mudanças ou enviando-lhe uma notificação direta. Incentivamos você a revisar este Aviso de Privacidade com frequência para se manter informado sobre como estamos protegendo suas informações.
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="p12">12. COMO VOCÊ PODE NOS CONTATAR SOBRE ESTE AVISO?</h2>
                            <p>
                                Se você tiver dúvidas ou comentários sobre este aviso, pode nos enviar um e-mail para <a href="https://mail.google.com/mail/?view=cm&fs=1&to=sasbrazilian@gmail.com" className="underline">sasbrazilian@gmail.com.</a>
                            </p>
                        </div>
                        <div className="text-justify place-self-start">
                            <h2 id="p13">13. COMO VOCÊ PODE REVISAR, ATUALIZAR OU EXCLUIR OS DADOS QUE COLETAMOS SOBRE VOCÊ?</h2>
                            <p>
                                Com base nas leis aplicáveis em seu país, você pode ter o direito de solicitar acesso às informações pessoais que coletamos sobre você, detalhes sobre como as processamos, corrigir imprecisões ou excluir suas informações pessoais. Você também pode ter o direito de retirar seu consentimento ao nosso processamento de suas informações pessoais. Esses direitos podem ser limitados em algumas circunstâncias pela legislação aplicável. Para solicitar a revisão, atualização ou exclusão de suas informações pessoais, visite: <a href="https://pasgo.com.br/ajuda" className="underline">pasgo.com.br/ajuda.</a>
                            </p>
                        </div>
                    </div>
                </article>
            </section>
        </AnimatedLayout>
    )
}

export default TermsAndConditions