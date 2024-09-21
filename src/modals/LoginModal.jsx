import { X } from "lucide-react";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import Cookies from "js-cookie";
import { veriSifrele } from "../services/cryptoHash";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ isOpen, setIsOpen }) => {
  const [kulAd, setKulAd] = useState("");
  const [sifre, setSifre] = useState("");
  const navigate = useNavigate();

  if (!isOpen) return null;

  const girisHandler = async (e) => {
    e.preventDefault();
    try {
      const ref = collection(db, "kullanicilar");
      const q = query(
        ref,
        where("kullaniciKod", "==", kulAd),
        where("sifre", "==", sifre)
      );

      const querySnap = await getDocs(q);

      if (!querySnap.empty) {
        const data = querySnap.docs[0].data();
        const adK = data.kullaniciKod;
        const adS = data.sifre;
        const sData = { ad421KKod: adK, s416Sir: adS };
        const sifrelenmisData = veriSifrele(sData);
        Cookies.set("token", sifrelenmisData, { expires: 30 });
        toast.success("Giriş başarılı. Yönlendiriliyorsunuz");
        navigate("/yetkili/panel");
      } else {
        toast.error("Girilen bilgiler geçersiz");
      }
    } catch (error) {
      alert("Sistem de bir hata var. H.K 356");
    }
  };

  return (
    <div className="fixed min-h-screen px-2 md:px-0 flex items-center justify-center bg-opacity-80 bg-black w-full z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="max-w-lg bg-white w-full rounded-md p-3"
      >
        <div className="flex items-center justify-between">
          <p className="font-semibold">Yetkili Girişi</p>
          <X
            size={20}
            className="text-gray-500 hover:text-black cursor-pointer"
            onClick={() => setIsOpen(false)}
          />
        </div>
        <form onSubmit={girisHandler} className="mt-2">
          <input
            type="text"
            placeholder="Kullanıcı Kodu"
            autoFocus
            value={kulAd}
            onChange={(e) => setKulAd(e.target.value)}
            className="p-2 border rounded-xl w-full text-center focus:ring-1 ring-black outline-none duration-300"
          />
          <input
            type="password"
            value={sifre}
            onChange={(e) => setSifre(e.target.value)}
            placeholder="Şifre"
            className="p-2 border mt-2 rounded-xl w-full text-center focus:ring-1 ring-black outline-none duration-300"
          />
          <button
            type="submit"
            className="py-2 w-full bg-emerald-400 hover:bg-emerald-300 duration-300 mt-3 text-white rounded-full"
          >
            Giriş Yap
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginModal;
