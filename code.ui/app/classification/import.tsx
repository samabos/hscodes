// pages/import.tsx
"use client"; // This line marks the file as a client component
import React, { useEffect, useState } from 'react';
import { HSCode, Prediction } from '@/models';
import { Button } from "@/components/ui/button";

const ImportComponent: React.FC = () => {
  const [rows, setRows] = useState<HSCode[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [currentRow, setCurrentRow] = useState<HSCode | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  useEffect(() => {
    retrieveHSCodes({ id: null, pid: null ,level: 1 });
  }, []);

  const onChangeSearchKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const retrieveHSCodes = async (req: { id: string | null; pid: string | null; level: number }) => {
    try {
      console.log(req.level);
      const response = await fetch(`/api/hscodes?pid=${req.pid}&level=${req.level}`);
      const data = await response.json();
      console.log(data);
      setRows(data);
      setPredictions([]);
    } catch (error) {
      console.error(error);
    }
  };

  const searchKeywordHandler = async () => {
    try {
      const response = await fetch('/api/hscodes/search?keyword=' + encodeURIComponent(searchKeyword));
      const data = await response.json();
      setRows(data.hscode);
      setPredictions(data.prediction);
    } catch (error) {
      console.error(error);
    }
  };

  const setActiveRow = (row: HSCode, index: number) => {
    setCurrentRow(row);
    setCurrentIndex(index);
  };

  const navNext = async (row: HSCode) => {
    if (row.code.length < 7) {
      await retrieveHSCodes({ id:null, pid: row.hs_id, level: row.level + 1 });
    }
  };

  const navBack = async (row: HSCode) => {
    if (row.level > 1) {
      await retrieveHSCodes({ id: row.hs_parent_id!, pid: null, level: row.level - 1 });
    }
  };

  return (
  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg min-w-full">
    <h3 className="text-center text-2xl font-bold mt-4 text-gray-800 dark:text-gray-200">
      PRODUCT CLASSIFICATION
    </h3>
    <p className="text-center text-sm mt-1 text-gray-600 dark:text-gray-300">
      Classify commodity to get information about duty, levy, and VAT. Also find out about regulatory requirements for import and export.
    </p>
    <h3 className="text-center font-semibold text-lg mt-4 text-gray-800 dark:text-gray-200">
      Search for Commodity Codes
    </h3>
  
    <div className="mt-4">
      <div className="relative">
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          placeholder="Search..."
          value={searchKeyword}
          onChange={onChangeSearchKeyword}
        />
        
      <Button
              size="sm"
              variant={"outline"}
              className="absolute right-0 top-0 mt-2 mr-2 py-1 px-3 rounded-lg transition duration-200"
              onClick={searchKeywordHandler}
            >
               <span>Search</span> 
        </Button>
      </div>
      
    </div>
  
    <div className="mt-4">
      <h3 className="text-lg font-semibold pb-2 text-gray-800 dark:text-gray-200">
        Harmonised Commodity Code
      </h3>
      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <ul className="space-y-2">
          {rows.map((row, index) => (
            <li
              key={index}
              className={`flex justify-between items-center p-2 rounded-lg transition duration-200 ${
                index === currentIndex
                  ? 'bg-blue-100 dark:bg-blue-600'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setActiveRow(row, index)}
            >
            <div className="flex items-center">
              <button 
              className="p-1 rounded-lg text-gray-600 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600" 
              onClick={() => navBack(row)}>
                &#9664;
              </button>
                <span className="ml-2 text-gray-800 dark:text-gray-200">
                    {row.code ? (row.code.length >= 7 ? row.code : <strong>{row.code}</strong>) : 'N/A'}
                </span>
            </div>
  
              <div>
                <p className="text-gray-600 dark:text-gray-300 p-2 px-4">{row.description}</p>
                {predictions.length > 0 && (
                  <span className="inline-block bg-green-200 text-green-800 dark:bg-green-600 dark:text-white px-2 py-1 rounded">
                    Confidence Score: {Math.round(predictions.find((e) => e.hscode === row.code)?.accuracy || 0)}
                  </span>
                )}
              </div>
  
              <div className="flex items-center">
                <button className="p-1 rounded-lg text-gray-600 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600" onClick={() => navNext(row)}>
                  &#9654;
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
  
  );
};

export default ImportComponent;
