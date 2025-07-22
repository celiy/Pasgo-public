import { Button } from "@/components/ui/button";
import AnimatedLayout from '@/hooks/AnimatedLayout';
import { ChevronUp } from "lucide-react";
import React, { useEffect, useRef, useState } from 'react';

function Credits() {
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
      if (start){
        start.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
    }

  }, [])

  const creditos = [
    {name: "Leon Guará", desc: "Ajuda com deploy da aplicação e parte técnica do backend"},
    {name: "Zuza", desc: "Ajuda e dicas de funcionaliades da aplicação"},
    {name: "Rafael Freire", desc: "Ajuda com otimizações e estruturação projeto"},
    {name: "Rafameou", desc: "Apoio moral e ajuda com certas partes técnicas"},
  ]

  return (
    <AnimatedLayout>
      
      <div id="item-down-top"
        className="fixed z-50 bottom-4 right-4"
      >
        <Button className="flex gap-2"
          onClick={() => scrollTo("start")}>
          <ChevronUp/>Voltar para o topo
        </Button>
      </div>

      <div id="start" ref={targetRef}/>
      <section className="grid items-center mx-auto mt-16 sm:mt-24 md:mt-32 w-home-responsive gap-14">
        <header className='grid grid-cols-1 gap-6 py-8 mx-auto'>
          <div className='grid gap-2 place-self-start'>
            <h1>
              Créditos
            </h1>
            <h3 className='text-primary'>
              Apoiadores e ajudantes do projeto
            </h3>
            <p className='font-medium leading-6 text-justify'>
              Obrigado a todos pelo o apoio e ajuda no projeto. Pasgo se iniciou como um pequeno sonho e acabou virando realidade por conta de vocês. E se você está aqui, obrigado.
            </p>
          </div>
        </header>
      </section>

      <section className="grid items-center w-full mt-6 border-y-2 gap-14 bg-sidebar/50">
        <article className='grid py-8 mx-auto w-home-responsive'>
          {creditos && creditos.map((item) => (
            <div className="grid grid-cols-[0.2fr_1fr] mb-1">
              <p key={item.name} className='text-lg font-medium leading-6 text-justify'>
                {item.name}
              </p>
              <p key={item.desc} className='text-lg font-medium leading-6 text-justify'>
                {item.desc}
              </p>
            </div>
          ))}
        </article>
      </section>
    </AnimatedLayout>
  )
}

export default Credits