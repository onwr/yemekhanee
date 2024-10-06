import React, { useState } from "react";
import logo from "../../images/siluet.png";
import MenuOlustur from "../../modals/panel/MenuOlustur";

const Panel = () => {
  const [menuOlustur, setMenuOlustur] = useState(false);

  const Kapat = () => {
    setMenuOlustur(false);
  };

  return (
    <div className="min-h-screen">
      {menuOlustur && <MenuOlustur kapat={Kapat} />}
      <img src={logo} className="mx-auto w-40 pt-10" />
      <h1 className="text-center text-xl font-medium">
        Bilişim Teknolojileri Alanı
      </h1>
      <h3 className="text-center text-lg ">Yemekhane Katılım Takip Sistemi</h3>
      <div className="flex items-center justify-center flex-col gap-3 mt-5">
        <button className="max-w-xs hover:ring-2 ring-emerald-300 ring-offset-2 duration-300 w-full mx-auto bg-emerald-500 py-3 text-white font-medium text-lg rounded-lg">
          Aktif Menüler
        </button>
        <button
          onClick={() => setMenuOlustur(!menuOlustur)}
          className="max-w-xs hover:ring-2 ring-emerald-300 ring-offset-2 duration-300 w-full mx-auto bg-emerald-500 py-3 text-white font-medium text-lg rounded-lg"
        >
          Menü Oluştur
        </button>
        <button
          onClick={() => setMenuOlustur(!menuOlustur)}
          className="max-w-xs hover:ring-2 ring-emerald-300 ring-offset-2 duration-300 w-full mx-auto bg-emerald-500 py-3 text-white font-medium text-lg rounded-lg"
        >
          Fiyat Güncelle
        </button>
        <button className="max-w-xs hover:ring-2 ring-red-300 ring-offset-2 duration-300 w-full mx-auto bg-red-500 py-3 text-white font-medium text-lg rounded-lg">
          Duyuru Oluştur
        </button>
      </div>
    </div>
  );
};

export default Panel;
