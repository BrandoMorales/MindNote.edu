import Navbar from "./components/Navbar";

function App() {
  return (
    <div>
      <Navbar />

      <section id="inicio" className="flex items-center justify-center h-screen bg-gray-100">
        <h1 className="text-4xl font-bold">Bienvenido a nuestra app</h1>
      </section>

      <section id="servicios" className="flex items-center justify-center h-screen bg-gray-200">
        <h2 className="text-3xl font-semibold">aca encontraras nuestros servicios</h2>
      </section>

      <section id="contacto" className="flex items-center justify-center h-screen bg-gray-300">
        <h2 className="text-3xl font-semibold">Contáctanos</h2>
      </section>
    </div>
  );
}

export default App;
