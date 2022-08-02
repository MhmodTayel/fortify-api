import React from 'react';
import { createSelfSignedCert } from '../helpers/helper';

export default function SelfSignedCert() {
  const handleSelfSigned = async (e) => {
    const res = await createSelfSignedCert();
    console.log(res);
  };

  return (
    <div>
      <button onClick={handleSelfSigned}>create cert</button>
    </div>
  );
}
