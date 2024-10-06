import { Info, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";

const MenuOlustur = ({ kapat }) => {
  const [tarih, setTarih] = useState("");
  const [yemekler, setYemekler] = useState(["Yemek 1"]);

  const handleAddYemek = () => {
    if (yemekler.length >= 5) {
      toast.error("En fazla 5 yemek ekleyebilirsiniz.");
      return;
    }
    setYemekler((prevYemekler) => [
      ...prevYemekler,
      `Yemek ${prevYemekler.length + 1}`,
    ]);
  };

  const handleRemoveYemek = (index) => {
    setYemekler((prevYemekler) => prevYemekler.filter((_, i) => i !== index));
  };

  const handleYemekChange = (index, value) => {
    setYemekler((prevYemekler) =>
      prevYemekler.map((yemek, i) => (i === index ? value : yemek))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tarih || yemekler.length === 0) {
      toast.error("Lütfen tüm alanları doldurunuz.");
      return;
    }

    try {
      const yemekList = yemekler.reduce((acc, yemek, index) => {
        acc[`yemek${index + 1}`] = yemek;
        return acc;
      }, {});

      await addDoc(collection(db, "yemekler"), {
        tarih,
        ...yemekList,
        katilacakSayi: 0,
      });

      toast.success("Menü başarıyla oluşturuldu!");
      setTarih("");
      setYemekler(["Yemek 1"]);
    } catch (error) {
      console.error("Hata oluştu 427", error);
      toast.error("Menü oluştururken bir hata oluştu. 427");
    }
  };

  return (
    <div className="fixed min-h-screen px-2 md:px-0 flex items-center justify-center bg-opacity-80 bg-black w-full z-50">
      <div className="bg-white max-w-lg w-full p-3 rounded">
        <div className="flex items-center justify-between">
          <p className="font-medium text-lg">Menü Oluştur</p>
          <X
            size={24}
            onClick={kapat}
            className="text-white p-1 rounded-full bg-black hover:bg-white duration-300 hover:text-black cursor-pointer"
          />
        </div>
        <form className="mt-5" onSubmit={handleSubmit}>
          <div>
            <div className="flex font-medium items-center justify-between">
              <label htmlFor="tarih">Tarih</label>
              <Info
                size={24}
                onClick={() => {
                  toast.message("Lütfen Menü Gösterim Tarihini Girin", {
                    description:
                      "Örneğin, 21 Eylül 2024 girerseniz, Menü 20 Eylül 2024'te gösterilecektir.",
                  });
                }}
                className="rounded-full bg-orange-300 p-1 text-white cursor-pointer hover:text-black duration-300 hover:bg-white"
              />
            </div>
            <input
              type="text"
              autoFocus
              required
              placeholder="Tarihi giriniz"
              className="p-2 rounded-lg border outline-none focus:ring-1 ring-emerald-300 duration-300 w-full mt-2"
              value={tarih}
              onChange={(e) => setTarih(e.target.value)}
            />
          </div>
          <p className="text-center text-lg my-2">Menü</p>
          <div className="bg-emerald-300 px-1 py-2 border">
            <AnimatePresence>
              {yemekler.map((yemek, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center mt-0.5"
                >
                  <input
                    type="text"
                    value={yemek}
                    onChange={(e) => handleYemekChange(index, e.target.value)}
                    required
                    className="p-2 duration-300 outline-none focus:ring-1 ring-black border w-full rounded-lg"
                  />
                  {index !== 0 && (
                    <X
                      size={24}
                      className="text-red-500 ml-2 cursor-pointer"
                      onClick={() => handleRemoveYemek(index)}
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={handleAddYemek}
            className="w-full py-2 bg-blue-500 text-white rounded-xl hover:ring-1 duration-300 ring-blue-500 ring-offset-1 mt-3"
          >
            + Yemek Ekle
          </button>

          <button className="w-full py-2 bg-red-400 text-white rounded-xl hover:ring-1 duration-300 ring-red-500 ring-offset-1 mt-3">
            Oluştur
          </button>
        </form>
      </div>
    </div>
  );
};

export default MenuOlustur;
