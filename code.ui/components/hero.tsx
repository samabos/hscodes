
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
  <div className="my-4 text-center">
    <div className="">
      <p className="AutumnHomeText text-2xl font-bold">
        Harmonized Commodity Codes Product Classification
      </p>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
  <div className="text-center">
    <Link href="/Import">
      <img 
        src="/images/classification.svg" 
        className="mx-auto w-40 sm:w-60 md:w-72 xl:w-80 2xl:w-[40vw] transition-transform duration-300 ease-in-out hover:scale-105" 
        alt="Classification" 
      />
    </Link>
  </div>

  <div className="text-center">
    <Link href="/">
      <img 
        src="/images/calculator.svg" 
        className="mx-auto w-40 sm:w-60 md:w-72 xl:w-80 2xl:w-[40vw]  transition-transform duration-300 ease-in-out hover:scale-105" 
        alt="Calculator" 
      />
    </Link>
  </div>
</div>


  </div>
  
  );
}
