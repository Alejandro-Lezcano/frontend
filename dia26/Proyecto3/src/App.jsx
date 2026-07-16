import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

function App() {
  // --- ESTADOS PRINCIPALES ---
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- ESTADOS DEL FORMULARIO ---
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [editandoId, setEditandoId] = useState(null); // null = Modo Crear, id = Modo Editar

  // --- READ: Leer usuarios de la API al montar ---
  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const respuesta = await fetch(API_URL);
      if (!respuesta.ok) throw new Error('No se pudo conectar con el servidor.');
      const datos = await respuesta.json();
      setUsuarios(datos);
    } catch (err) {
      setError(err.message || 'Error al cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  // Manejador para inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- CREATE & UPDATE: Enviar formulario ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return alert('Todos los campos son obligatorios.');

    setLoading(true);
    setError(null);

    try {
      if (editandoId) {
        // --- MODO UPDATE (PUT) ---
        const respuesta = await fetch(`${API_URL}/${editandoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editandoId, ...formData })
        });
        if (!respuesta.ok) throw new Error('No se pudo actualizar el usuario.');
        const usuarioActualizado = await respuesta.json();

        // Actualización optimista del estado
        setUsuarios((prev) => prev.map((u) => (u.id === editandoId ? usuarioActualizado : u)));
        setEditandoId(null);
      } else {
        // --- MODO CREATE (POST) ---
        const respuesta = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!respuesta.ok) throw new Error('No se pudo crear el usuario.');
        const nuevoUsuario = await respuesta.json();

        // JSONPlaceholder retorna ID 11 siempre, usamos Date.now() local para evitar IDs duplicados
        setUsuarios((prev) => [{ ...nuevoUsuario, id: Date.now() }, ...prev]);
      }

      // Resetear el formulario
      setFormData({ name: '', email: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Preparar formulario para edición
  const prepararEdicion = (usuario) => {
    setEditandoId(usuario.id);
    setFormData({ name: usuario.name, email: usuario.email });
  };

  // Cancelar modo edición
  const cancelarEdicion = () => {
    setEditandoId(null);
    setFormData({ name: '', email: '' });
  };

  // --- DELETE: Eliminar con confirmación ---
  const eliminarUsuario = async (id) => {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este usuario?');
    if (!confirmar) return;

    setLoading(true);
    setError(null);

    try {
      const respuesta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!respuesta.ok) throw new Error('Error al eliminar el usuario.');

      // Filtrar el estado local para remover al usuario
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      
      // Si se estaba editando el usuario borrado, limpiamos el formulario
      if (editandoId === id) cancelarEdicion();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Panel de Administración CRUD</h1>

      {/* --- MENSAJES DE ESTADO (Carga y Error) --- */}
      {error && <div className="banner-error">⚠️ Error: {error}</div>}
      {loading && <div className="banner-loading">🔄 Procesando petición externa...</div>}

      {/* --- FORMULARIO (Crear / Editar) --- */}
      <section className="seccion-formulario">
        <h2>{editandoId ? '📝 Editar Usuario' : '➕ Agregar Nuevo Usuario'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="campo-form">
            <label>Nombre Completo:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="Ej. Jane Doe"
            />
          </div>
          <div className="campo-form">
            <label>Correo Electrónico:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="Ej. jane.doe@correo.com"
            />
          </div>
          <button type="submit" className="btn-guardar" disabled={loading}>
            {editandoId ? 'Actualizar' : 'Guardar'}
          </button>
          {editandoId && (
            <button type="button" className="btn-cancelar" onClick={cancelarEdicion} disabled={loading}>
              Cancelar
            </button>
          )}
        </form>
      </section>

      {/* --- LISTADO (Leer y Borrar) --- */}
      <section className="seccion-listado">
        <h2>📋 Usuarios Registrados</h2>
        {usuarios.length === 0 && !loading ? (
          <p>No hay usuarios en la base de datos.</p>
        ) : (
          <div className="grid-usuarios">
            {usuarios.map((usuario) => (
              <div key={usuario.id} className="tarjeta-usuario">
                <h3>{usuario.name}</h3>
                <p>✉️ {usuario.email}</p>
                <div className="acciones-tarjeta">
                  <button
                    onClick={() => prepararEdicion(usuario)}
                    className="btn-editar"
                    disabled={loading}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarUsuario(usuario.id)}
                    className="btn-eliminar"
                    disabled={loading}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;