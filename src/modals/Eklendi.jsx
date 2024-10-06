import { Check } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

const Eklendi = ({ isOpen2, setIsOpen2, ad }) => {
  if (!isOpen2) return null;

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="fixed min-h-screen bg-green-50 w-full z-50 flex items-center justify-center">
      <motion.div
        className="max-w-lg w-full bg-white border shadow-inner rounded-xl p-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Check
          size={80}
          className="mx-auto bg-green-400 p-3 rounded-full text-white"
        />
        <p className="text-center mt-5 font-medium text-xl">
          Listeye eklendiniz
        </p>
        <button
          className="w-full mt-4 py-2 bg-red-500 rounded-full text-white"
          onClick={() => setIsOpen2(false)}
        >
          Kapat
        </button>
      </motion.div>
    </div>
  );
};

export default Eklendi;
