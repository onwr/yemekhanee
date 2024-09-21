import { Navigate, Outlet } from "react-router-dom";
import { sifreCoz } from "../services/cryptoHash";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import gif from "../images/cumhuriyet.gif";
import { toast } from "sonner";

const MainLayout = () => {
  const token = Cookies.get("token");
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setYukleniyor(false);
    }, 1500);
  }, []);

  if (yukleniyor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <img src={gif} />;
      </div>
    );
  }

  if (token) {
    try {
      const cozulen = sifreCoz(token);
      if (cozulen.ad421KKod && cozulen.s416Sir) {
        return <Outlet />;
      } else {
        alert("Geçersiz token");
        Cookies.remove("token");
      }
    } catch (error) {
      toast.error("Geçersiz token");
      Cookies.remove("token");
    }
  }

  toast.error("Yetkisiz işlem");
  return <Navigate to="/" replace />;
};
export default MainLayout;
