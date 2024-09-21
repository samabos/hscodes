
import Link from 'next/link';

export default function Header() {
  return (
  <div className="my-8 text-center">
    <div className="mb-6">
      <img src="/images/large-logo.svg" className="mx-auto mb-4" alt="logo" />
      <p className="AutumnHomeText text-xl font-medium">
        Harmonized Commodity Codes and Tariff Classification
      </p>
    </div>
  
    <div className="grid grid-cols-2 gap-8 items-center">
      <div className="text-center">
        <Link href="/classification">
          <img src="/images/classification.svg" className="mx-auto" alt="Classification" />
        </Link>
        <button className="mt-4 py-2 px-6 bg-gray-200 text-gray-800 rounded-md shadow">
          Product Classification
        </button>
      </div>
      <div className="text-center">
        <Link href="/duty-calculator">
          <img src="/images/calculator.svg" className="mx-auto" alt="Calculator" />
        </Link>
        <button className="mt-4 py-2 px-6 bg-gray-200 text-gray-800 rounded-md shadow">
          Duty Calculator
        </button>
      </div>
    </div>
  </div>
  
  );
}
