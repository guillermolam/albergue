import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, User as UserIcon, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner@2.0.3";
import { useI18n } from "../contexts/I18nContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const { language } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success(language === "es" ? "¡Bienvenido!" : "Welcome back!");
      onClose();
      setFormData({ email: "", password: "" });
    } catch (error) {
      toast.error(
        language === "es" ? "Credenciales inválidas" : "Invalid credentials",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    {
      email: "pilgrim@camino.com",
      password: "password",
      label: language === "es" ? "Peregrino" : "Pilgrim",
    },
    { email: "admin@camino.com", password: "admin123", label: "Admin" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
            <motion.div
              className="relative w-full max-w-md"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Shadow */}
              <div className="absolute inset-0 bg-black/20 blur-2xl transform translate-y-4" />

              {/* Modal background */}
              <svg className="absolute inset-0 w-full h-full">
                <rect
                  x="4"
                  y="4"
                  width="calc(100% - 8px)"
                  height="calc(100% - 8px)"
                  fill="white"
                  stroke="#1A1A1A"
                  strokeWidth="3"
                  rx="20"
                />
                <rect
                  x="8"
                  y="8"
                  width="calc(100% - 16px)"
                  height="calc(100% - 16px)"
                  fill="none"
                  stroke="#00AB39"
                  strokeWidth="2"
                  rx="18"
                  opacity="0.6"
                />
              </svg>

              {/* Content */}
              <div className="relative p-8">
                {/* Close button */}
                <motion.button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center cursor-pointer group"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="absolute inset-0 w-full h-full">
                    <circle
                      cx="20"
                      cy="20"
                      r="18"
                      fill="#f5f5f5"
                      stroke="#1A1A1A"
                      strokeWidth="2"
                    />
                  </svg>
                  <X
                    className="relative w-5 h-5 text-[#1A1A1A] group-hover:text-[#ED1C24] transition-colors"
                    strokeWidth={2.5}
                  />
                </motion.button>

                {/* Title */}
                <div className="text-center mb-8">
                  <motion.div
                    className="inline-block mb-3"
                    animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <UserIcon
                      className="w-16 h-16 text-[#00AB39]"
                      strokeWidth={2}
                    />
                  </motion.div>
                  <h2
                    className="text-3xl text-[#1A1A1A] mb-2"
                    style={{ fontFamily: "Cabin Sketch, cursive" }}
                  >
                    {language === "es" ? "Iniciar Sesión" : "Sign In"}
                  </h2>
                  <p
                    className="text-gray-600"
                    style={{ fontFamily: "Patrick Hand, cursive" }}
                  >
                    {language === "es"
                      ? "Accede a tu cuenta"
                      : "Access your account"}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email */}
                  <div>
                    <label
                      className="block text-sm mb-2 text-[#1A1A1A]"
                      style={{ fontFamily: "Cabin Sketch, cursive" }}
                    >
                      {language === "es" ? "Correo Electrónico" : "Email"}
                    </label>
                    <div className="relative">
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <rect
                          x="2"
                          y="2"
                          width="calc(100% - 4px)"
                          height="calc(100% - 4px)"
                          fill="white"
                          stroke="#1A1A1A"
                          strokeWidth="2"
                          rx="12"
                        />
                      </svg>
                      <div className="relative flex items-center">
                        <Mail
                          className="absolute left-3 w-5 h-5 text-gray-400"
                          strokeWidth={2}
                        />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="relative w-full pl-11 pr-4 py-3 bg-transparent border-none outline-none text-[#1A1A1A]"
                          style={{ fontFamily: "Patrick Hand, cursive" }}
                          placeholder="pilgrim@camino.com"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      className="block text-sm mb-2 text-[#1A1A1A]"
                      style={{ fontFamily: "Cabin Sketch, cursive" }}
                    >
                      {language === "es" ? "Contraseña" : "Password"}
                    </label>
                    <div className="relative">
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <rect
                          x="2"
                          y="2"
                          width="calc(100% - 4px)"
                          height="calc(100% - 4px)"
                          fill="white"
                          stroke="#1A1A1A"
                          strokeWidth="2"
                          rx="12"
                        />
                      </svg>
                      <div className="relative flex items-center">
                        <Lock
                          className="absolute left-3 w-5 h-5 text-gray-400"
                          strokeWidth={2}
                        />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                          className="relative w-full pl-11 pr-12 py-3 bg-transparent border-none outline-none text-[#1A1A1A]"
                          style={{ fontFamily: "Patrick Hand, cursive" }}
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 p-1 cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeOff
                              className="w-5 h-5 text-gray-400 hover:text-[#00AB39] transition-colors"
                              strokeWidth={2}
                            />
                          ) : (
                            <Eye
                              className="w-5 h-5 text-gray-400 hover:text-[#00AB39] transition-colors"
                              strokeWidth={2}
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="relative w-full py-3 cursor-pointer overflow-visible"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <motion.rect
                        x="2"
                        y="2"
                        width="calc(100% - 4px)"
                        height="calc(100% - 4px)"
                        fill={isLoading ? "#66BB6A" : "#00AB39"}
                        stroke="#1A1A1A"
                        strokeWidth="2.5"
                        rx="12"
                        animate={isLoading ? { opacity: [1, 0.7, 1] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    </svg>
                    <span
                      className="relative text-white text-lg"
                      style={{ fontFamily: "Cabin Sketch, cursive" }}
                    >
                      {isLoading
                        ? language === "es"
                          ? "Cargando..."
                          : "Loading..."
                        : language === "es"
                          ? "Entrar"
                          : "Sign In"}
                    </span>
                  </motion.button>
                </form>

                {/* Demo Accounts */}
                <div className="mt-6 pt-6 border-t-2 border-dashed border-gray-300">
                  <p
                    className="text-sm text-center text-gray-600 mb-3"
                    style={{ fontFamily: "Patrick Hand, cursive" }}
                  >
                    {language === "es"
                      ? "Cuentas de prueba:"
                      : "Demo accounts:"}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {demoAccounts.map((account) => (
                      <motion.button
                        key={account.email}
                        type="button"
                        onClick={() =>
                          setFormData({
                            email: account.email,
                            password: account.password,
                          })
                        }
                        className="relative px-4 py-2 cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                          <rect
                            x="1.5"
                            y="1.5"
                            width="calc(100% - 3px)"
                            height="calc(100% - 3px)"
                            fill="white"
                            stroke="#00AB39"
                            strokeWidth="1.5"
                            rx="8"
                          />
                        </svg>
                        <span
                          className="relative text-sm text-[#00AB39]"
                          style={{ fontFamily: "Patrick Hand, cursive" }}
                        >
                          {account.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Decorative stars */}
                {[
                  { top: "20px", left: "20px" },
                  { bottom: "20px", right: "20px" },
                ].map((pos, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-6 h-6 pointer-events-none"
                    style={pos}
                    animate={{
                      rotate: [0, 180, 360],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path
                        d="M12,2 L13.5,10.5 L22,12 L13.5,13.5 L12,22 L10.5,13.5 L2,12 L10.5,10.5 Z"
                        fill="#00AB39"
                        opacity="0.4"
                      />
                    </svg>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
