

// import React, { useState } from 'react';
// import { ChevronRight, ChevronDown } from 'lucide-react';

// const FAQItem = ({ question, answer }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className={`faq-item ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
//       <div className="faq-main">
//         <div className="faq-q">
//           <span className="faq-plus">{isOpen ? '-' : '+'}</span> 
//           {question}
//         </div>
//         {isOpen ? <ChevronDown size={18} color="#2563eb" /> : <ChevronRight size={18} color="#94a3b8" />}
//       </div>
      
//       {isOpen && (
//         <div className="faq-a">
//           <p>{answer}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FAQItem;


import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`faq-item ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
      <div className="faq-main">
        <div className="faq-q">
          <span className="faq-plus">{isOpen ? '-' : '+'}</span> 
          {question}
        </div>
        {isOpen ? <ChevronDown size={18} color="#2563eb" /> : <ChevronRight size={18} color="#94a3b8" />}
      </div>
      
      {isOpen && (
        <div className="faq-a">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default FAQItem;