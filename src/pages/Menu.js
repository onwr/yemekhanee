import { useState, useEffect } from "react";
import {
  query,
  collection,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import logo from "../images/siluet.png";
import anitkabir from "../images/anitkabir.png";
import { LogIn } from "lucide-react";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [fiyat, setFiyat] = useState({});
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    async function fetchMenu() {
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);

      const q = query(
        collection(db, "yemekler"),
        where("tarih", "==", formatDate(nextDay))
      );

      const querySnapshot = await getDocs(q);

      const items = [];
      querySnapshot.forEach((doc2) => {
        items.push(doc2.data());
      });

      setMenuItems(items);
      setIsLoadingMenu(false);
    }

    fetchMenu();
  }, [selectedDate]);

  useEffect(() => {
    const veriCek = async () => {
      try {
        const docRef = doc(db, "fiyatlar", "W8E5XtdTNTZ8c6HRA2XV");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFiyat(docSnap.data());
        } else {
          console.log("Belirtilen belge bulunamadı.");
        }
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      }
    };

    veriCek();
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen select-none flex flex-col items-center"
    >
      <img
        src={anitkabir}
        alt="Anıtkabir"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        style={{ zIndex: -1 }}
      />

      <div className="absolute w-full flex justify-between items-center gap-5 top-5 px-5 md:px-10">
        <LogIn className="cursor-pointer text-gray-500 ml-auto hover:text-black hover:scale-105 duration-500" />
      </div>
      <header className="font-extrabold mt-5 text-gray-900">
        <img src={logo} className="w-40 mx-auto md:w-48" />
        <h1 className="text-2xl mt-2 font-semibold">
          Bilişim Teknolojileri Alanı
        </h1>
        <h3 className="text-center text-sm font-medium">&copy; Onur KÜRKAYA</h3>
      </header>

      <div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="rounded-lg py-2 px-3 mt-2 md:mt-5 md:shadow-inner md:bg-neutral-50 md:border md:border-b-2 border-b-black w-full max-w-md md:max-w-lg"
      >
        <h2 className="text-xl md:text-2xl text-center text-gray-600 font-medium mb-1 md:mb-4">
          {menuItems.length > 0 && (
            <span>
              {menuItems[0].tarih} <br /> Yemekhane Menüsü
            </span>
          )}
        </h2>

        {isLoadingMenu ? (
          <p className="text-gray-500">Yükleniyor...</p>
        ) : menuItems.length === 0 ? (
          <p className="text-gray-500">MENÜ EKLENMEMİŞ.</p>
        ) : (
          <div className="p-4 border shadow-md rounded-lg bg-white">
            {menuItems[0]?.Yemek1 && (
              <div className="text-lg font-semibold  mb-2 border p-2 rounded-lg">
                {menuItems[0].Yemek1}
              </div>
            )}
            {menuItems[0]?.Yemek2 && (
              <div className="text-lg font-semibold  mb-2 border p-2 rounded-lg">
                {menuItems[0].Yemek2}
              </div>
            )}
            {menuItems[0]?.Yemek3 && (
              <div className="text-lg font-semibold  mb-2 border p-2 rounded-lg">
                {menuItems[0].Yemek3}
              </div>
            )}
            {menuItems[0]?.Yemek4 && (
              <div className="text-lg font-semibold  mb-2 border p-2 rounded-lg">
                {menuItems[0].Yemek4}
              </div>
            )}
          </div>
        )}
        <button className="w-full bg-green-400 text-black font-medium mt-2 py-2 rounded-full">
          Yemek Yiyeceğim
        </button>
      </div>

      <div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="rounded-lg mt-2 md:mt-4 md:border-b-2 md:bg-neutral-50 md:border-b-black py-2 px-3 mb-4 md:border w-full max-w-md md:max-w-lg md:shadow-inner"
      >
        <h2 className="text-lg text-center text-gray-900 font-bold mb-2">
          Yemekhane Ücretleri
        </h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="font-medium bg-white text-center p-4  text-gray-900 border-b-2 rounded-lg border md:shadow-inner"
        >
          {fiyat.ogrenci && (
            <div className="flex justify-between items-center">
              <span>Öğrenci</span>
              <span className="text-black font-bold">{fiyat.ogrenci} ₺</span>
            </div>
          )}
          {fiyat.ogretmen && (
            <div className="flex justify-between mt-2 items-center">
              <span>Öğretmen</span>
              <span className="text-black font-bold">{fiyat.ogretmen} ₺</span>
            </div>
          )}
          {fiyat.misafir && (
            <div className="flex justify-between mt-2 items-center">
              <span>Misafir</span>
              <span className="text-black font-bold">{fiyat.misafir} ₺</span>
            </div>
          )}
        </motion.div>
      </div>
      <br className="block md:hidden" />
      <br className="block md:hidden" />
      <br className="block md:hidden" />
      <br className="block md:hidden" />

      <Footer />
    </motion.div>
  );
};

export default Menu;
