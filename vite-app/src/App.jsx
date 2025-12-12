import React, { useState } from 'react';

export default function App(){
  const [count, setCount] = useState(0);
  return (
    <div style={{direction:'rtl',fontFamily:'Segoe UI, Tahoma, Arial',maxWidth:900,margin:'40px auto',background:'#fff',padding:20,borderRadius:8}}>
      <h1>OUMI — تطبيق React (JSX)</h1>
      <p>استخدم هذا المشروع مع Vite: سريع وسهل للبناء والنشر على GitHub Pages.</p>
      <p>العدّاد: <strong>{count}</strong></p>
      <p>
        <button onClick={() => setCount(c => c + 1)} style={{background:'#2b6cb0',color:'#fff',padding:'8px 12px',borderRadius:6}}>زيادة</button>
      </p>
    </div>
  );
}
