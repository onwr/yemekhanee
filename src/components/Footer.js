import React from "react";
import yil from "../images/100.png";

const Footer = () => {
  return (
    <div className="fixed select-none  transform translate-x-1/2 right-1/2 flex items-center justify-between shadow-inner font-yeni border w-full container md:rounded-t-2xl bottom-0 bg-white py-0.5 px-2 md:px-5">
      <img src={yil} className="w-28 mx-auto" />
    </div>
  );
};

export default Footer;
