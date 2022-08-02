import React from 'react';
import { createCSR } from '../helpers/helper';

export default function CSR() {
  const handleCSR = async (e) => {
    const res = await createCSR();
    console.log(res);
  };
  return (
    <div>
      <button onClick={handleCSR}>create CSR</button>
    </div>
  );
}
