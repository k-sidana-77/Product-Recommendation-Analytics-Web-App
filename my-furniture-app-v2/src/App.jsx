// import React, { useState, useEffect, useRef } from 'react';
// import { Bot, User, Send, LoaderCircle, BarChart2, MessageSquare, Package, DollarSign, Building } from 'lucide-react';

// // --- Main Application Component ---
// export default function App() {
//   const [page, setPage] = useState('chat'); // 'chat' or 'analytics'

//   return (
//     <div className="flex flex-col h-screen bg-gray-100 font-sans">
//       <Header page={page} setPage={setPage} />
//       <main className="flex-1 overflow-y-auto p-4 md:p-6">
//         <div className="max-w-4xl mx-auto">
//           {page === 'chat' ? <ChatInterface /> : <AnalyticsDashboard />}
//         </div>
//       </main>
//     </div>
//   );
// }

// // --- Header Component with Navigation ---
// const Header = ({ page, setPage }) => (
//   <header className="bg-white shadow-md p-4 sticky top-0 z-10">
//     <div className="max-w-4xl mx-auto flex justify-between items-center">
//       <h1 className="text-2xl font-bold text-gray-800">Furniture AI</h1>
//       <nav className="flex items-center gap-2">
//         <NavButton icon={<MessageSquare size={20} />} text="Chat" isActive={page === 'chat'} onClick={() => setPage('chat')} />
//         <NavButton icon={<BarChart2 size={20} />} text="Analytics" isActive={page === 'analytics'} onClick={() => setPage('analytics')} />
//       </nav>
//     </div>
//   </header>
// );

// const NavButton = ({ icon, text, isActive, onClick }) => (
//   <button 
//     onClick={onClick}
//     className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
//       isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'
//     }`}
//   >
//     {icon}
//     <span className="hidden sm:inline">{text}</span>
//   </button>
// );


// // --- Chat Interface Component ---
// const ChatInterface = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

//   useEffect(scrollToBottom, [messages]);
  
//   useEffect(() => {
//     setMessages([{ 
//       text: "Hello! I am your Furniture AI Assistant. How can I help you find the perfect piece today?", 
//       isUser: false 
//     }]);
//   }, []);

//   const sendMessage = async () => {
//     if (input.trim() === '') return;
//     const userMessage = { text: input, isUser: true };
//     setMessages(prev => [...prev, userMessage]);
//     setInput('');
//     setIsLoading(true);
//     try {
//       const response = await fetch('http://127.0.0.1:8000/recommend', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text: input, top_k: 5 })
//       });
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//       const data = await response.json();
//       const botMessage = { text: "Here are some recommendations I found for you:", isUser: false, products: data.recommendations };
//       setMessages(prev => [...prev, botMessage]);
//     } catch (error) {
//       console.error("Failed to fetch recommendations:", error);
//       const errorMessage = { text: "I'm sorry, I encountered an error. Please try again.", isUser: false };
//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="max-w-3xl mx-auto pb-24"> {/* Added padding-bottom */}
//         {messages.map((msg, index) => <ChatMessage key={index} message={msg} />)}
//         {isLoading && <LoadingIndicator />}
//         <div ref={messagesEndRef} />
//       </div>
//       <footer className="bg-white p-4 border-t fixed bottom-0 left-0 right-0">
//         <div className="max-w-3xl mx-auto">
//           <div className="flex items-center rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
//             <input
//               type="text" className="flex-1 p-3 bg-transparent border-none rounded-lg focus:outline-none"
//               placeholder="Describe the furniture you're looking for..." value={input}
//               onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
//               disabled={isLoading} />
//             <button
//               className="p-3 text-white bg-blue-600 rounded-r-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
//               onClick={sendMessage} disabled={isLoading} >
//               <Send size={20} />
//             </button>
//           </div>
//         </div>
//       </footer>
//     </>
//   );
// };


// // --- Analytics Dashboard Component ---
// const AnalyticsDashboard = () => {
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetch('http://127.0.0.1:8000/analytics');
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
//                 const result = await response.json();
//                 setData(result);
//             } catch (e) {
//                 setError(e.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, []);

//     if (loading) return <div className="text-center p-10"><LoaderCircle className="mx-auto animate-spin" size={48} /></div>;
//     if (error) return <div className="text-center p-10 text-red-500">Error loading analytics: {error}</div>;
//     if (!data) return <div className="text-center p-10">No analytics data available.</div>;
    
//     return (
//         <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <MetricCard icon={<Package size={24} />} title="Total Products" value={data.keyMetrics.totalProducts} />
//                 <MetricCard icon={<DollarSign size={24} />} title="Average Price" value={`$${data.keyMetrics.averagePrice}`} />
//                 <MetricCard icon={<Building size={24} />} title="Unique Brands" value={data.keyMetrics.uniqueBrands} />
//             </div>
//             <ChartCard title="Top 10 Brands">
//                 <BarChart data={data.topBrands} />
//             </ChartCard>
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                  <ChartCard title="Products by Price Range">
//                     <BarChart data={data.priceDistribution} dataKey="range" />
//                 </ChartCard>
//                 <ChartCard title="Top 10 Categories">
//                     <BarChart data={data.topCategories} />
//                 </ChartCard>
//             </div>
//         </div>
//     );
// };

// // --- Analytics Sub-components ---
// const MetricCard = ({ icon, title, value }) => (
//     <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4">
//         <div className="bg-blue-100 text-blue-600 p-3 rounded-full">{icon}</div>
//         <div>
//             <p className="text-sm text-gray-500">{title}</p>
//             <p className="text-2xl font-bold text-gray-900">{value}</p>
//         </div>
//     </div>
// );

// const ChartCard = ({ title, children }) => (
//     <div className="bg-white p-6 rounded-lg shadow-sm">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
//         {children}
//     </div>
// );

// const BarChart = ({ data, dataKey = "name" }) => {
//     const maxValue = Math.max(...data.map(item => item.count));
    
//     return (
//         <div className="space-y-2">
//             {data.map((item, index) => (
//                 <div key={index} className="flex items-center gap-4">
//                     <p className="text-sm text-gray-600 w-1/3 truncate" title={item[dataKey]}>{item[dataKey]}</p>
//                     <div className="w-2/3 bg-gray-200 rounded-full h-6">
//                          <div 
//                             className="bg-blue-500 h-6 rounded-full flex items-center justify-end px-2 text-white text-xs font-medium"
//                             style={{ width: `${(item.count / maxValue) * 100}%` }}
//                          >
//                             {item.count}
//                         </div>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// };

// // --- Shared Components (from Chat) ---
// // These are the same components as before, kept here for completeness.
// const ChatMessage = ({ message }) => {
//   const { text, isUser, products } = message;
//   return (
//     <div className={`flex items-start gap-4 my-4 ${isUser ? 'justify-end' : ''}`}>
//       {!isUser && <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white"><Bot size={24} /></div>}
//       <div className={`p-4 rounded-lg max-w-lg ${isUser ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}>
//         <p className="mb-2">{text}</p>
//         {products && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
//             {products.map((product, index) => <ProductCard key={product.uniq_id || index} product={product} />)}
//           </div>
//         )}
//       </div>
//        {isUser && <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white"><User size={24} /></div>}
//     </div>
//   );
// };

// const ProductCard = ({ product }) => {
//   let firstImage = 'https://placehold.co/400x400/EEE/31343C?text=No+Image';
//   if (product.images && typeof product.images === 'string') {
//     const urlRegex = /(https?:\/\/[^\s,']+)/;
//     const match = product.images.match(urlRegex);
//     if (match && match[0]) firstImage = match[0];
//   }
//   return (
//     <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
//       <img src={firstImage} alt={product.title} className="w-full h-32 object-cover" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x400/EEE/31343C?text=Image+Error'; }}/>
//       <div className="p-3">
//         <h3 className="font-bold text-sm truncate text-gray-900">{product.title || 'No Title'}</h3>
//         <p className="text-xs text-gray-500">{product.brand || 'No Brand'}</p>
//         <p className="text-sm font-semibold text-gray-700 mt-1">{product.price ? `$${product.price}`: 'N/A'}</p>
//       </div>
//     </div>
//   );
// };

// const LoadingIndicator = () => (
//   <div className="flex items-start gap-4 my-4">
//     <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white"><Bot size={24} /></div>
//     <div className="p-4 rounded-lg bg-white shadow-sm flex items-center justify-center"><LoaderCircle size={24} className="animate-spin text-gray-500" /></div>
//   </div>
// );

import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, LoaderCircle, BarChart2, MessageSquare, Package, DollarSign, Building, Sparkles } from 'lucide-react';

// --- Main Application Component ---
export default function App() {
  const [page, setPage] = useState('chat'); // 'chat', 'analytics', or 'generator'

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      <Header page={page} setPage={setPage} />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {page === 'chat' && <ChatInterface />}
          {page === 'analytics' && <AnalyticsDashboard />}
          {page === 'generator' && <DescriptionGenerator />}
        </div>
      </main>
    </div>
  );
}

// --- Header Component with Navigation ---
const Header = ({ page, setPage }) => (
  <header className="bg-white shadow-md p-4 sticky top-0 z-10">
    <div className="max-w-4xl mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">Furniture AI</h1>
      <nav className="flex items-center gap-2">
        <NavButton icon={<MessageSquare size={20} />} text="Chat" isActive={page === 'chat'} onClick={() => setPage('chat')} />
        <NavButton icon={<BarChart2 size={20} />} text="Analytics" isActive={page === 'analytics'} onClick={() => setPage('analytics')} />
        <NavButton icon={<Sparkles size={20} />} text="Generator" isActive={page === 'generator'} onClick={() => setPage('generator')} />
      </nav>
    </div>
  </header>
);

// --- Description Generator Component ---
const DescriptionGenerator = () => {
    const [title, setTitle] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerate = async () => {
        if (!title.trim() || !brand.trim()) {
            setError("Please enter both a title and a brand.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setDescription('');
        try {
            const response = await fetch('http://127.0.0.1:8000/generate_description', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, brand })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setDescription(data.description);
        } catch (e) {
            setError("Failed to generate description. The AI service may be unavailable. Please check your API key and try again.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Creative Description Generator</h2>
            <div className="space-y-4">
                <InputField label="Product Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., 'Modern Velvet Armchair'" />
                <InputField label="Product Brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g., 'Modway'" />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors">
                    {isLoading ? <LoaderCircle className="animate-spin" /> : <Sparkles size={20} />}
                    <span>{isLoading ? 'Generating...' : 'Generate Description'}</span>
                </button>
            </div>
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            {description && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                    <h3 className="font-semibold text-gray-700 mb-2">Generated Description:</h3>
                    <p className="text-gray-600 leading-relaxed">{description}</p>
                </div>
            )}
        </div>
    );
};

const InputField = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <input type="text" {...props} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
    </div>
);


// --- (Other components like ChatInterface, AnalyticsDashboard, etc., remain the same) ---
// Note: For brevity, the existing components are included below without modification.

const NavButton = ({ icon, text, isActive, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}>
    {icon} <span className="hidden sm:inline">{text}</span>
  </button>
);

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);
  useEffect(() => { setMessages([{ text: "Hello! I am your Furniture AI Assistant. How can I help you find the perfect piece today?", isUser: false }]); }, []);
  const sendMessage = async () => {
    if (input.trim() === '') return;
    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/recommend', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: input, top_k: 5 }) });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const botMessage = { text: "Here are some recommendations I found for you:", isUser: false, products: data.recommendations };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
      const errorMessage = { text: "I'm sorry, I encountered an error. Please try again.", isUser: false };
      setMessages(prev => [...prev, errorMessage]);
    } finally { setIsLoading(false); }
  };
  return (
    <>
      <div className="max-w-3xl mx-auto pb-24">
        {messages.map((msg, index) => <ChatMessage key={index} message={msg} />)}
        {isLoading && <LoadingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      <footer className="bg-white p-4 border-t fixed bottom-0 left-0 right-0">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
            <input type="text" className="flex-1 p-3 bg-transparent border-none rounded-lg focus:outline-none" placeholder="Describe the furniture you're looking for..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !isLoading && sendMessage()} disabled={isLoading} />
            <button className="p-3 text-white bg-blue-600 rounded-r-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors" onClick={sendMessage} disabled={isLoading}> <Send size={20} /> </button>
          </div>
        </div>
      </footer>
    </>
  );
};

const AnalyticsDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/analytics');
                if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
                const result = await response.json();
                setData(result);
            } catch (e) { setError(e.message); } finally { setLoading(false); }
        };
        fetchData();
    }, []);
    if (loading) return <div className="text-center p-10"><LoaderCircle className="mx-auto animate-spin" size={48} /></div>;
    if (error) return <div className="text-center p-10 text-red-500">Error loading analytics: {error}</div>;
    if (!data) return <div className="text-center p-10">No analytics data available.</div>;
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard icon={<Package size={24} />} title="Total Products" value={data.keyMetrics.totalProducts} />
                <MetricCard icon={<DollarSign size={24} />} title="Average Price" value={`$${data.keyMetrics.averagePrice}`} />
                <MetricCard icon={<Building size={24} />} title="Unique Brands" value={data.keyMetrics.uniqueBrands} />
            </div>
            <ChartCard title="Top 10 Brands"><BarChart data={data.topBrands} /></ChartCard>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <ChartCard title="Products by Price Range"><BarChart data={data.priceDistribution} dataKey="range" /></ChartCard>
                <ChartCard title="Top 10 Categories"><BarChart data={data.topCategories} /></ChartCard>
            </div>
        </div>
    );
};
const MetricCard = ({ icon, title, value }) => ( <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4"> <div className="bg-blue-100 text-blue-600 p-3 rounded-full">{icon}</div> <div> <p className="text-sm text-gray-500">{title}</p> <p className="text-2xl font-bold text-gray-900">{value}</p> </div> </div> );
const ChartCard = ({ title, children }) => ( <div className="bg-white p-6 rounded-lg shadow-sm"> <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3> {children} </div> );
const BarChart = ({ data, dataKey = "name" }) => {
    const maxValue = Math.max(...data.map(item => item.count));
    return ( <div className="space-y-2"> {data.map((item, index) => ( <div key={index} className="flex items-center gap-4"> <p className="text-sm text-gray-600 w-1/3 truncate" title={item[dataKey]}>{item[dataKey]}</p> <div className="w-2/3 bg-gray-200 rounded-full h-6"> <div className="bg-blue-500 h-6 rounded-full flex items-center justify-end px-2 text-white text-xs font-medium" style={{ width: `${(item.count / maxValue) * 100}%` }}> {item.count} </div> </div> </div> ))} </div> );
};
const ChatMessage = ({ message }) => {
  const { text, isUser, products } = message;
  return (
    <div className={`flex items-start gap-4 my-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white"><Bot size={24} /></div>}
      <div className={`p-4 rounded-lg max-w-lg ${isUser ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}>
        <p className="mb-2">{text}</p>
        {products && ( <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4"> {products.map((product, index) => <ProductCard key={product.uniq_id || index} product={product} />)} </div> )}
      </div>
       {isUser && <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white"><User size={24} /></div>}
    </div>
  );
};
const ProductCard = ({ product }) => {
  let firstImage = 'https://placehold.co/400x400/EEE/31343C?text=No+Image';
  if (product.images && typeof product.images === 'string' && product.images !== 'nan') {
    const urlRegex = /(https?:\/\/[^\s,']+)/;
    const match = product.images.match(urlRegex);
    if (match && match[0]) firstImage = match[0];
  }
  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <img src={firstImage} alt={product.title} className="w-full h-32 object-cover" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x400/EEE/31343C?text=Image+Error'; }}/>
      <div className="p-3">
        <h3 className="font-bold text-sm truncate text-gray-900">{product.title || 'No Title'}</h3>
        <p className="text-xs text-gray-500">{product.brand || 'No Brand'}</p>
        <p className="text-sm font-semibold text-gray-700 mt-1">{product.price ? `$${product.price}`: 'N/A'}</p>
      </div>
    </div>
  );
};
const LoadingIndicator = () => ( <div className="flex items-start gap-4 my-4"> <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white"><Bot size={24} /></div> <div className="p-4 rounded-lg bg-white shadow-sm flex items-center justify-center"><LoaderCircle size={24} className="animate-spin text-gray-500" /></div> </div> );

