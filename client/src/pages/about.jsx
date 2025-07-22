import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import AnimatedLayout from '@/hooks/AnimatedLayout';
import React, { useEffect, useState } from 'react';
import nodejsIMG from '/nodejs.png';
import reactIMG from '/react.png';
import shadcn from '/shadcn.png';

function About() {
  const [width, setWidth] = useState(window.innerWidth);

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
      if (start){
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

      <div id="start"/>
      <section className="grid items-center mx-auto mt-16 sm:mt-24 md:mt-32 w-home-responsive gap-14">
        <header className='grid grid-cols-1 gap-6 py-8 mx-auto md:grid-cols-2'>
          <div className='grid gap-2 place-self-start'>
            <h1>Sobre</h1>
            <h3 className='text-primary'>Pasgo</h3>
            <p className='font-medium leading-6 text-justify'>Pasgo é uma abreviação de "Projeto Acessibilidade de Software de Gestão Online." O projeto se iniciou com o intuito de oferecer ferramentas básicas para donos de negócios, micro e pequenas empresas, com o intuito de facilitar o gerenciamento de forma rápida, fácil e prática. O principal motivador para o desenvolvimento desta aplicação foi pesquisar sobre este tipo de aplicação online e descobrir que maior parte destas aplicações eram pagas.</p>
          </div>
          <div className='grid gap-2 place-self-start'>
            <h1>Criador</h1>
            <h3 className='text-primary'>Diogo Carvalho Viegas</h3>
            <p className='font-medium leading-6 text-justify'>Desenvolvedor web full-stack, estudante de tecnologia, atualmente cursando Análise e Desenvolvimento de Sistemas em IFSUL Câmpus Camaquã. Especializado em React e NodeJS, conhecendo Python, PHP, C e JavaScript. Também possui conhecimento avançado em TI, sistemas operacionais, hardware e software.</p>
          </div>
        </header>
      </section>
      
      <div id="tecnica"/>
      <section className="grid items-center w-full mt-20 border-y-2 gap-14 bg-sidebar">
        <article className='grid py-8 mx-auto mt-8 w-home-responsive'>
          <div>
            <h1>Tecnologias usadas</h1>
          </div>
          <div className="grid grid-cols-1 mt-10 md:grid-cols-2">
            <div className="text-justify place-self-start">
              <h2>React (Front-end)</h2>
              <p>React faz com que a criação de UIs interativas seja uma tarefa fácil. Crie views simples para cada estado na sua aplicação, e o React irá atualizar e renderizar de forma eficiente apenas os componentes necessários na medida em que os dados mudam.</p>
            </div>
            {!isMobile && 
            <AspectRatio ratio={16 / 9} className="hidden pl-10 place-self-center md:block">
              <img src={reactIMG} alt="Image" className="transition-transform duration-200 hover:scale-110" />
            </AspectRatio>}
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="text-justify place-self-start">
              <h2>NodeJS (Back-end)</h2>
              <p>Ambiente de execução de JavaScript multiplataforma, de código-aberto e gratuita, que permite aos programadores criar servidores, aplicações da Web, ferramentas de linha de comando e programas de automação de tarefas.</p>
            </div>
            {!isMobile && 
            <AspectRatio ratio={16 / 9} className="hidden pl-10 place-self-center md:block">
              <img src={nodejsIMG} alt="Image" className="transition-transform duration-200 hover:scale-110" />
            </AspectRatio>}
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="text-justify place-self-start">
              <h2>Shadcn (Biblioteca)</h2>
              <p>Shadcn é uma biblioteca de CSS que permite a personalização do estilo das aplicações. Com ela, é possível criar temas dark e light para as aplicações, tornando-as mais agradáveis e fáceis de usar.</p>
            </div>
            {!isMobile && 
            <AspectRatio ratio={16 / 9} className="hidden pl-10 place-self-center md:block">
              <img src={shadcn} alt="Estoque" className="transition-transform duration-200 hover:scale-110" />
            </AspectRatio>}
          </div>
        </article>
      </section>

    </AnimatedLayout>
  )
}

export default About