// import React from 'react';
// import { motion } from 'framer-motion';
// import { Leaf, ShieldCheck, CheckCircle2, FlaskConical, FolderHeart as HandHeart } from 'lucide-react';

// const TrustBar = () => {
//   const trustItems = [
//     { icon: Leaf, text: "100% Natural" },
//     { icon: ShieldCheck, text: "Chemical Free" },
//     { icon: CheckCircle2, text: "No Additives or Preservatives" },
//     { icon: FlaskConical, text: "Lab Tested for Purity" },
//     { icon: HandHeart, text: "Small Batch Production" }
//   ];

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-2 mt-0 mb-5">
//       <motion.div 
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, delay: 0.4 }}
//         className="bg-card rounded-2xl shadow-xl border border-border py-0 px-5 md:py-1 md:px-6"
//       >
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
//           {trustItems.map((item, index) => {
//             const Icon = item.icon;
//             return (
//               <div key={index} className="flex flex-col items-center text-center gap-2 group">
//                 <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors duration-300">
//                   <Icon className="h-5 w-5 text-secondary" />
//                 </div>
//                 <span className="text-xs md:text-sm font-semibold text-primary leading-tight max-w-[120px]">
//                   {item.text}
//                 </span>
//               </div>
//             );
//           })}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default TrustBar;