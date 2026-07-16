import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Encabezado/>
      <Galeria/>
      <BotonSaludo/>
      <Mensaje/>
      <Divisor/>
      <ListaProductos/>
    </>
  );
}

function BotonSaludo({ onSaludar }) {
  return (
    <button
      onClick={onSaludar}
      className="px-4 py-2 rounded-lg bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-700 transition"
    >
      Saludar a la clase
    </button>
  );
}

function Mensaje() {
  const [mensaje, setMensaje] = useState('');

  function manejarSaludo() {
    setMensaje('¡Hola, futuros desarrolladores!');
  }

  return (
    <div className="space-y-3">
      <h1 className="text-lg font-semibold text-slate-800">Mi primera app en React</h1>
      <BotonSaludo onSaludar={manejarSaludo} />
      {mensaje && <p className="text-sm text-slate-600">{mensaje}</p>}
    </div>
  );
}

function Encabezado(){
  return(
    <>
      <h1 className='.estilo-encabezado'>Hola a todos</h1>
      <p>saludos a todos</p>
    </>
  )
}

function Galeria(){
  return(
    <a>Mi Galeria</a>
  )
}

function Divisor(){
  return(<hr className="border-slate-300"/>)
}

const productosIniciales = [
  { id: 'a1', titulo: 'Arduino Uno' },
  { id: 'a2', titulo: 'Protoboard' },
  { id: 'a3', titulo: 'Sensor ultrasónico' },
];

function ListaProductos() {
  const [productos, setProductos] = useState(productosIniciales);
  const [seleccionado, setSeleccionado] = useState(null);
  const [usarIndice, setUsarIndice] = useState(false);

  window.__barajarListaDemo = function () {
    setProductos(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-xs text-slate-500">
        <input
          type="checkbox"
          checked={usarIndice}
          onChange={(e) => setUsarIndice(e.target.checked)}
        />
        Usar el índice del arreglo como key (práctica no recomendada)
      </label>

      <ul className="space-y-1.5">
        {productos.map((producto, indice) => (
          <li
            key={usarIndice ? indice : producto.id}
            onClick={() => setSeleccionado(producto.id)}
            className={
              'px-3 py-2 rounded-md text-sm cursor-pointer border ' +
              (seleccionado === producto.id
                ? 'bg-cyan-50 border-cyan-400 text-cyan-800'
                : 'border-slate-200 text-slate-600')
            }
          >
            {producto.titulo}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
