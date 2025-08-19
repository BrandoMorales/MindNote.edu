import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between p-4 text-white bg-indigo-600 shadow-md">
      {/* Logo */}
      <div className="text-2xl font-bold tracking-wide">Mi App</div>

      <div className="flex items-center gap-4">
        {/* Menú horizontal (solo en pantallas grandes) */}
        <ul className="hidden text-lg md:flex gap-x-6">
          <li>
            <a href="#inicio" className="hover:underline hover:text-gray-200">
              Inicio
            </a>
          </li>
          <li>
            <a href="#servicios" className="hover:underline hover:text-gray-200">
              Servicios
            </a>
          </li>
          <li>
            <a href="#contacto" className="hover:underline hover:text-gray-200">
              Contacto
            </a>
          </li>
        </ul>

        {/* Botón hamburguesa (siempre visible) */}
        <button
          className="text-3xl focus:outline-none"
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Menú móvil (solo se muestra al dar clic en ☰ en pantallas pequeñas) */}
      {open && (
        <ul className="absolute left-0 flex flex-col items-center w-full py-6 bg-indigo-600 shadow-lg top-16 gap-y-4 md:hidden">
          <li>
            <a
              href="#inicio"
              className="hover:underline hover:text-gray-200"
              onClick={() => setOpen(false)}
            >
              Inicio
            </a>
          </li>
          <li>
            <a
              href="#servicios"
              className="hover:underline hover:text-gray-200"
              onClick={() => setOpen(false)}
            >
              Servicios
            </a>
          </li>
          <li>
            <a
              href="#contacto"
              className="hover:underline hover:text-gray-200"
              onClick={() => setOpen(false)}
            >
              Contacto
            </a>
          </li>
        </ul>
      )}
    </nav>
  );
}
