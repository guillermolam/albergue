import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  LogOut,
  Settings,
  Calendar,
  Shield,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LoginModal } from "./LoginModal";
import { useI18n } from "../contexts/I18nContext";
import { toast } from "sonner@2.0.3";

export function UserProfileMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const { language } = useI18n();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    toast.success(language === "es" ? "¡Hasta pronto!" : "See you soon!");
    navigate("/");
  };

  const menuItems = [
    {
      icon: Calendar,
      label: language === "es" ? "Mis Reservas" : "My Bookings",
      onClick: () => {
        navigate("/dashboard");
        setIsOpen(false);
      },
      show: user?.role === "guest",
    },
    {
      icon: Shield,
      label: language === "es" ? "Panel Admin" : "Admin Panel",
      onClick: () => {
        navigate("/admin");
        setIsOpen(false);
      },
      show: user?.role === "admin",
    },
    {
      icon: Settings,
      label: language === "es" ? "Configuración" : "Settings",
      onClick: () => {
        toast.info(language === "es" ? "Próximamente" : "Coming soon");
        setIsOpen(false);
      },
      show: true,
    },
    {
      icon: LogOut,
      label: language === "es" ? "Cerrar Sesión" : "Sign Out",
      onClick: handleLogout,
      show: true,
      danger: true,
    },
  ];

  if (!isAuthenticated) {
    return (
      <>
        <motion.button
          onClick={() => setShowLoginModal(true)}
          className="relative flex items-center gap-2 px-4 py-2.5 cursor-pointer group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Doodle background */}
          <svg className="absolute inset-0 w-full h-full">
            <rect
              x="2"
              y="2"
              width="calc(100% - 4px)"
              height="calc(100% - 4px)"
              fill="white"
              stroke="#00AB39"
              strokeWidth="2.5"
              rx="20"
              className="transition-all group-hover:fill-[#00AB39]"
            />
            <rect
              x="4"
              y="4"
              width="calc(100% - 8px)"
              height="calc(100% - 8px)"
              fill="none"
              stroke="#1A1A1A"
              strokeWidth="1"
              rx="18"
              opacity="0.3"
            />
          </svg>

          {/* Content */}
          <User
            className="relative w-5 h-5 text-[#00AB39] group-hover:text-white transition-colors"
            strokeWidth={2.5}
          />
          <span
            className="relative text-lg text-[#1A1A1A] group-hover:text-white transition-colors"
            style={{ fontFamily: "Patrick Hand, cursive" }}
          >
            {language === "es" ? "Entrar" : "Sign In"}
          </span>

          {/* Pulsing dot */}
          <motion.div
            className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#00AB39] rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>

        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      </>
    );
  }

  return (
    <div className="relative">
      {/* User button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2.5 px-3 py-2 cursor-pointer group"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        {/* Shadow */}
        <div className="absolute inset-0 bg-black/10 blur-md transform translate-y-1 rounded-full" />

        {/* Background */}
        <svg className="absolute inset-0 w-full h-full">
          <rect
            x="2"
            y="2"
            width="calc(100% - 4px)"
            height="calc(100% - 4px)"
            fill="white"
            stroke="#00AB39"
            strokeWidth="2.5"
            rx="25"
            className="transition-all group-hover:stroke-[#006b24]"
          />
        </svg>

        {/* Avatar */}
        <div className="relative">
          <motion.img
            src={
              user?.avatar ||
              `https://ui-avatars.com/api/?name=${user?.name}&background=00AB39&color=fff`
            }
            alt={user?.name}
            className="w-8 h-8 rounded-full border-2 border-[#00AB39]"
            whileHover={{ scale: 1.1, rotate: 5 }}
          />
          {/* Online indicator */}
          <motion.div
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#00AB39] rounded-full border-2 border-white"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* Name */}
        <span
          className="relative text-[#1A1A1A] group-hover:text-[#00AB39] transition-colors max-w-[100px] truncate hidden sm:block"
          style={{ fontFamily: "Patrick Hand, cursive" }}
        >
          {user?.name}
        </span>

        {/* Arrow */}
        <motion.div
          className="relative"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-4 h-4 text-[#00AB39]" strokeWidth={2.5} />
        </motion.div>

        {/* Role badge */}
        {user?.role === "admin" && (
          <motion.div
            className="absolute -top-2 -left-2"
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Shield
              className="w-4 h-4 text-[#00AB39] fill-[#00AB39]"
              strokeWidth={2}
            />
          </motion.div>
        )}
      </motion.button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              className="absolute top-full right-0 mt-2 z-50 min-w-[220px]"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {/* Shadow */}
              <div className="absolute inset-0 bg-black/20 blur-xl transform translate-y-2" />

              {/* Menu background */}
              <svg className="absolute inset-0 w-full h-full">
                <rect
                  x="3"
                  y="3"
                  width="calc(100% - 6px)"
                  height="calc(100% - 6px)"
                  fill="white"
                  stroke="#1A1A1A"
                  strokeWidth="3"
                  rx="16"
                />
                <rect
                  x="6"
                  y="6"
                  width="calc(100% - 12px)"
                  height="calc(100% - 12px)"
                  fill="none"
                  stroke="#00AB39"
                  strokeWidth="2"
                  rx="14"
                  opacity="0.6"
                />
              </svg>

              {/* User info header */}
              <div className="relative p-4 border-b-2 border-dashed border-gray-200">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      user?.avatar ||
                      `https://ui-avatars.com/api/?name=${user?.name}&background=00AB39&color=fff`
                    }
                    alt={user?.name}
                    className="w-12 h-12 rounded-full border-2 border-[#00AB39]"
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[#1A1A1A] truncate"
                      style={{ fontFamily: "Cabin Sketch, cursive" }}
                    >
                      {user?.name}
                    </p>
                    <p
                      className="text-sm text-gray-500 truncate"
                      style={{ fontFamily: "Patrick Hand, cursive" }}
                    >
                      {user?.email}
                    </p>
                  </div>
                </div>
                {user?.role === "admin" && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#00AB39]/10 rounded-full">
                    <Shield
                      className="w-3.5 h-3.5 text-[#00AB39]"
                      strokeWidth={2.5}
                    />
                    <span
                      className="text-xs text-[#00AB39]"
                      style={{ fontFamily: "Patrick Hand, cursive" }}
                    >
                      Admin
                    </span>
                  </div>
                )}
              </div>

              {/* Menu items */}
              <div className="relative p-2">
                {menuItems
                  .filter((item) => item.show)
                  .map((item, index) => (
                    <motion.button
                      key={index}
                      onClick={item.onClick}
                      className="relative w-full flex items-center gap-3 px-4 py-3 cursor-pointer group"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 3 }}
                    >
                      {/* Hover background */}
                      <motion.div
                        className="absolute inset-1 rounded-xl"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        style={{
                          background: item.danger
                            ? "linear-gradient(135deg, rgba(237, 28, 36, 0.1) 0%, rgba(237, 28, 36, 0.05) 100%)"
                            : "linear-gradient(135deg, rgba(0, 171, 57, 0.1) 0%, rgba(0, 171, 57, 0.05) 100%)",
                        }}
                      />

                      {/* Icon */}
                      <item.icon
                        className={`relative w-5 h-5 transition-colors ${
                          item.danger
                            ? "text-gray-500 group-hover:text-[#ED1C24]"
                            : "text-[#00AB39] group-hover:text-[#006b24]"
                        }`}
                        strokeWidth={2.5}
                      />

                      {/* Label */}
                      <span
                        className={`relative transition-colors ${
                          item.danger
                            ? "text-gray-700 group-hover:text-[#ED1C24]"
                            : "text-[#1A1A1A] group-hover:text-[#00AB39]"
                        }`}
                        style={{ fontFamily: "Patrick Hand, cursive" }}
                      >
                        {item.label}
                      </span>
                    </motion.button>
                  ))}
              </div>

              {/* Decorative corner dot */}
              <motion.div
                className="absolute top-2 left-2 w-2 h-2 bg-[#00AB39] rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
