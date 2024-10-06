import { useState, useEffect } from "react";
import {
  query,
  collection,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import Cookies from "js-cookie";
import { db } from "../firebase";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";
import logo from "../images/siluet.png";
import anitkabir from "../images/anitkabir.png";
import { LogIn } from "lucide-react";
import LoginModal from "../modals/LoginModal";
import Eklendi from "../modals/Eklendi";
import { toast } from "sonner";

const BilgiModal = ({ onClose, tekrarCalis }) => {
  const [ad, setAd] = useState("");
  const [ogrNo, setOgrNo] = useState("");
  const [rol, setRol] = useState("ogrenci");

  const formatAdSoyad = (input) => {
    return input.toUpperCase();
  };

  const handleAdChange = (e) => {
    const input = e.target.value;
    const turkishCharactersRegex = /[ğüşöçİĞÜŞÖÇ]/;
    if (turkishCharactersRegex.test(input)) {
      toast.warning("Türkçe karakter girişi yapılamaz.");
      return;
    }
    setAd(input);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedAd = formatAdSoyad(ad);

    if (formattedAd) {
      Cookies.set("ad", encodeURIComponent(formattedAd), { expires: 365 });
      Cookies.set("rol", rol, { expires: 365 });
      if (rol === "ogrenci") {
        Cookies.set("ogrNo", ogrNo, { expires: 365 });
      }
      toast.success("Bilgiler kaydedildi.");
      onClose();
      tekrarCalis();
    } else {
      toast.warning("Lütfen adınızı giriniz.");
    }
  };

  return (
    <motion.div
      className="min-h-screen inset-0 fixed flex items-center justify-center bg-black z-50 bg-opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="max-w-xs md:max-w-lg w-full ring-2 ring-offset-4 ring-emerald-200 rounded-lg p-5 bg-white"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        <p className="text-center text-base md:text-lg font-semibold">
          Lütfen Eksik Bilgileri Doldurun
        </p>
        <p className="text-xs text-center text-gray-500 mb-4">
          Sizi listeye ekleyebilmemiz için gerekli bilgileri giriniz.
        </p>

        <div className="flex justify-center space-x-4 mb-4">
          <button
            type="button"
            className={`py-2 w-full outline-none rounded-lg font-semibold ${
              rol === "ogrenci"
                ? "bg-emerald-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
            onClick={() => setRol("ogrenci")}
          >
            Öğrenciyim
          </button>
          <button
            type="button"
            className={`py-2 w-full outline-none rounded-lg font-semibold ${
              rol === "ogretmen"
                ? "bg-emerald-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
            onClick={() => setRol("ogretmen")}
          >
            Öğretmenim
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-2">
          <input
            type="text"
            placeholder="Ad Soyad"
            value={ad}
            onChange={handleAdChange}
            className="w-full border text-sm md:text-base py-2 text-center outline-none focus:ring-1 rounded-lg duration-300 ring-emerald-300"
            autoFocus
            required
          />

          <AnimatePresence>
            {rol === "ogrenci" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
              >
                <input
                  type="text"
                  placeholder="Öğrenci Numaranız"
                  value={ogrNo}
                  onChange={(e) => setOgrNo(e.target.value)}
                  className="w-full mt-3 border text-sm md:text-base py-2 text-center outline-none focus:ring-1 rounded-lg duration-300 ring-emerald-300"
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            className="w-full border text-gray-800 hover:bg-emerald-300 duration-300 border-emerald-300 mt-4 py-2 rounded-xl bg-emerald-400 font-medium"
          >
            Kaydet
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [fiyat, setFiyat] = useState({});
  const [bilgiModal, setBilgiModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);
  const [isLoadingFiyat, setIsLoadingFiyat] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDisabled, setIsDisabled] = useState(false);

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
        items.push({ ...doc2.data(), id: doc2.id });
      });

      setMenuItems(items);
      setIsLoadingMenu(false);

      const storedMenuId = Cookies.get("menuId");
      const storedDate = Cookies.get("menuDate");

      if (storedMenuId && storedDate === formatDate(new Date())) {
        setIsDisabled(true);
      }
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
          setIsLoadingFiyat(false);
        } else {
          console.log("Belirtilen belge bulunamadı.");
        }
      } catch (error) {
        console.error("Veri çekme hatası:", error);
        setIsLoadingFiyat(false);
      }
    };

    veriCek();
  }, []);

  const handleButtonClick = async () => {
    if (!Cookies.get("ad")) {
      setBilgiModal(true);
      return;
    }

    const today = new Date();
    Cookies.set("menuId", menuItems[0].id, { expires: 1 });
    Cookies.set("menuDate", formatDate(today), { expires: 1 });

    try {
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);

      const q = query(
        collection(db, "yemekler"),
        where("tarih", "==", formatDate(nextDay))
      );
      const querySnap = await getDocs(q);

      if (!querySnap.empty) {
        const docRef = querySnap.docs[0].ref;

        await updateDoc(docRef, {
          katilacakSayi: querySnap.docs[0].data().katilacakSayi + 1,
        });

        setIsOpen2(true);
      } else {
        console.log("418, Menü bulunamadı");
        alert("Hata var. H.K 418. Lütfen 11/A Onur Kürkaya haber veriniz.");
      }
    } catch (error) {
      console.log(error);
      alert("Hata var. H.K 419. Lütfen 11/A Onur Kürkaya haber veriniz.");
    }
    setIsDisabled(true);
  };

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
        <LogIn
          className="cursor-pointer text-gray-500 ml-auto hover:text-black hover:scale-105 duration-500"
          onClick={() => setIsOpen(true)}
        />
      </div>
      <header className="font-extrabold mt-5 text-gray-900">
        <motion.img
          src={logo}
          className="w-32 mx-auto md:w-36"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.h1
          className="text-2xl mt-2 font-semibold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Bilişim Teknolojileri Alanı
        </motion.h1>
        <motion.h3
          className="text-center text-sm font-medium"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          &copy; Onur Kürkaya
        </motion.h3>
      </header>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="rounded-lg py-2 px-3 mt-2 md:mt-5 md:shadow-inner md:bg-neutral-50 md:border md:border-b-2 border-b-black w-full max-w-md md:max-w-lg"
      >
        <h2 className="text-lg md:text-xl text-center text-gray-600 font-medium mb-1">
          {menuItems.length > 0 && (
            <p>
              <span className="text-xl md:text-2xl">{menuItems[0].tarih}</span>{" "}
              <br />
              Yemekhane Menüsü
            </p>
          )}
        </h2>
        {menuItems.length > 0 && (
          <p className="text-center my-2 border py-2 bg-orange-300 bg-opacity-20 rounded-xl">
            <span className="font-bold">{menuItems[0].katilacakSayi}</span>{" "}
            <br /> kişi yemekhaneye katılacak
          </p>
        )}
        {isLoadingMenu ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-gray-500"
          >
            Yükleniyor...
          </motion.p>
        ) : menuItems.length === 0 ? (
          <p className="text-gray-500 text-center">MENÜ BULUNAMADI</p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-4 border shadow-md rounded-lg bg-white"
          >
            {menuItems[0]?.yemek1 && (
              <div className="text-lg font-semibold  mb-2 border p-2 rounded-lg">
                {menuItems[0].yemek1}
              </div>
            )}
            {menuItems[0]?.yemek2 && (
              <div className="text-lg font-semibold  mb-2 border p-2 rounded-lg">
                {menuItems[0].yemek2}
              </div>
            )}
            {menuItems[0]?.yemek3 && (
              <div className="text-lg font-semibold  mb-2 border p-2 rounded-lg">
                {menuItems[0].yemek3}
              </div>
            )}
            {menuItems[0]?.yemek4 && (
              <div className="text-lg font-semibold  mb-2 border p-2 rounded-lg">
                {menuItems[0].yemek4}
              </div>
            )}
            {menuItems[0]?.yemek5 && (
              <div className="text-lg font-semibold  mb-2 border p-2 rounded-lg">
                {menuItems[0].yemek5}
              </div>
            )}
          </motion.div>
        )}
        {menuItems.length > 0 && (
          <button
            onClick={handleButtonClick}
            disabled={isDisabled}
            className="w-full bg-red-500 disabled:bg-gray-200 disabled:text-gray-600 border shadow-inner text-white hover:ring-1 hover:bg-red-600 ring-gray-200 duration-300 font-medium mt-2 py-2 rounded-full"
          >
            {isDisabled ? "Listeye eklendiniz" : "Yemek Yiyeceğim"}
          </button>
        )}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="rounded-lg mt-2 md:mt-4 md:border-b-2 md:bg-neutral-50 md:border-b-black py-2 px-3 mb-4 md:border w-full max-w-md md:max-w-lg md:shadow-inner"
      >
        <h2 className="text-lg text-center text-gray-900 font-bold mb-2">
          Yemekhane Ücretleri
        </h2>
        {isLoadingFiyat ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-gray-500"
          >
            Yükleniyor...
          </motion.p>
        ) : (
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
          </motion.div>
        )}
      </motion.div>
      <LoginModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <Eklendi setIsOpen2={setIsOpen2} isOpen2={isOpen2} />
      <AnimatePresence>
        {bilgiModal && (
          <BilgiModal
            onClose={() => setBilgiModal(false)}
            tekrarCalis={handleButtonClick}
          />
        )}
      </AnimatePresence>{" "}
      <br className="block md:hidden" />
      <br className="block md:hidden" />
      <br className="block md:hidden" />
      <br className="block md:hidden" />
      <Footer />
    </motion.div>
  );
};

export default Menu;
