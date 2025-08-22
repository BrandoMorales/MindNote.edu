import Navbar from "./components/Navbar";

function App() {
  return (
    <div>
      <Navbar />

      <section id="inicio" className="flex items-center justify-center h-screen bg-gray-100">
        <h1 className="text-4xl font-bold">Bienvenido a nuestra app</h1>
      </section>
    </div>
  );
}

export default App;
