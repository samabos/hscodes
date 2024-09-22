
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
  <div className="my-4 text-center">
    <div className="">
      <p className="AutumnHomeText text-xl font-medium">
        Harmonized Commodity Codes Product Classification
      </p>
    </div>
  
    <div className="grid grid-cols-2 gap-8 items-center">
  <div className="text-center">
    <Link href="/classification">
      <img 
        src="/images/classification.svg" 
        className="mx-auto w-80 transition-transform duration-300 ease-in-out hover:scale-105" 
        alt="Classification" 
      />
    </Link>
    
   {/*  <Button
      size="lg"
      variant={"outline"}
      className="py-2 px-6">
      <Link href="/classification">Product Classification</Link>
    </Button> */}
  </div>

  <div className="text-center">
    <Link href="/">
      <img 
        src="/images/calculator.svg" 
        className="mx-auto w-80 transition-transform duration-300 ease-in-out hover:scale-105" 
        alt="Calculator" 
      />
    </Link>
    
    {/* <Button
      size="lg"
      variant={"outline"}
      className="py-2 px-6">
      <Link href="/duty-calculator">Duty Calculator</Link>
    </Button> */}
  </div>
</div>
  </div>
  
  );
}
