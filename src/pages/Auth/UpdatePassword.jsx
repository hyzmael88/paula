// pages/auth/reset-password.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";

const UpdatePassword = () => {
  const router = useRouter();
  const { token, email } = router.query;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") {
      // Esperar a que la sesión termine de cargar
      return;
    }
    if (!session) {
      // Redirigir al login si no hay sesión
      router.push("/Auth/Login");
    }
  }, [session, status, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await axios.post("/api/auth/update-password", {
        session,
        email,
        newPassword,
      });
      setMessage("Contraseña actualizada exitosamente");
      setError(null);
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        router.push("/Configuracion");
      }, 200);
    } catch (error) {
      setError(
        "Error al actualizar la contraseña. Por favor, inténtelo de nuevo."
      );
      setMessage(null);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-[30px] shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">
          Cambiar Contraseña
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {message && (
          <p className="text-green-500 text-center mb-4">{message}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-gray-700 text-[14px] font-bold"
            >
              Nueva Contraseña
            </label>
            <input
              name="newPassword"
              type="password"
              placeholder="Nueva Contraseña"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-[20px] mt-1 text-[14px]"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 text-[14px] font-bold"
            >
              Confirmar Contraseña
            </label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirmar Contraseña"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-[20px] mt-1 text-[14px]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-[20px] text-[16px] font-bold shadowButton hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
          >
            Restablecer Contraseña
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/Auth/Login">
            <p className="text-[14px] text-purple-600 hover:underline">
              Volver al inicio de sesión
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
