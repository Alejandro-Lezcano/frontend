import React, { useState, useEffect } from 'react';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

export default function AdminPanel() {
  // --- ESTADOS PRINCIPALES ---
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- ESTADOS DEL FORMULARIO (CREATE / UPDATE) ---
  const [formData, setFormData] = useState({ title: '', body: '' });
  const [editingId, setEditingId] = useState(null); // null = Modo Crear, id = Modo Editar

  // --- 1. READ (LEER DATOS) ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}?_limit=5`); // Limitado a 5 para pruebas
      if (!response.ok) throw new Error('Error al conectar con el servidor.');
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError(err.message || 'Algo salió mal al cargar los datos.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- MANEJO DE INPUTS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- 2. CREATE & 3. UPDATE (SUBMIT DEL FORMULARIO) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.body) return alert('Todos los campos son obligatorios');

    setIsLoading(true);
    setError(null);

    try {
      if (editingId) {
        // --- MODO UPDATE (PUT) ---
        const response = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify({ id: editingId, ...formData }),
          headers: { 'Content-type': 'application/json; charset=UTF-8' },
        });
        if (!response.ok) throw new Error('No se pudo actualizar el registro.');
        const updatedItem = await response.json();

        // Actualización optimista del estado local
        setItems((prev) => prev.map((item) => (item.id === editingId ? updatedItem : item)));
        setEditingId(null);
      } else {
        // --- MODO CREATE (POST) ---
        const response = await fetch(API_URL, {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: { 'Content-type': 'application/json; charset=UTF-8' },
        });
        if (!response.ok) throw new Error('No se pudo crear el registro.');
        const newItem = await response.json();

        // JSONPlaceholder siempre devuelve ID 101, usamos Date.now() local para evitar colisiones de keys
        setItems((prev) => [{ ...newItem, id: Date.now() }, ...prev]);
      }

      // Resetear formulario tras éxito
      setFormData({ title: '', body: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- PREPARAR INTERFAZ PARA EDICIÓN ---
  const handleEditClick = (item) => {
    setEditingId(item.id);
    setFormData({ title: item.title, body: item.body });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', body: '' });
  };

  // --- 4. DELETE (ELIMINAR CON CONFIRMACIÓN) ---
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este registro?');
    if (!confirmDelete) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('No se pudo eliminar el registro.');

      // Filtrar el estado local para remover el elemento eliminado
      setItems((prev) => prev.filter((item) => item.id !== id));
      
      // Si se estaba editando el elemento borrado, limpiar el formulario
      if (editingId === id) handleCancelEdit();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Panel Administrativo CRUD</h2>

      {/* --- NOTIFICACIÓN DE ERROR --- */}
      {error && (
        <div style={{ padding: '10px', backgroundColor: '#ffcccc', color: '#990000', borderRadius: '5px', marginBottom: '20px' }}>
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      {/* --- INDICADOR DE CARGA --- */}
      {isLoading && (
        <div style={{ padding: '10px', backgroundColor: '#e6f7ff', color: '#0050b3', borderRadius: '5px', marginBottom: '20px', fontWeight: 'bold' }}>
          🔄 Procesando petición externa...
        </div>
      )}

      {/* --- FORMULARIO (CREATE / UPDATE) --- */}
      <section style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '30px', backgroundColor: '#f9f9f9' }}>
        <h3>{editingId ? '📝 Editar Registro' : '➕ Agregar Nuevo Registro'}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Título:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              disabled={isLoading}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Contenido:</label>
            <textarea
              name="body"
              value={formData.body}
              onChange={handleInputChange}
              disabled={isLoading}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', height: '80px' }}
            />
          </div>
          <button type="submit" disabled={isLoading} style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
            {editingId ? 'Actualizar' : 'Guardar'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} style={{ padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Cancelar Edición
            </button>
          )}
        </form>
      </section>

      {/* --- LISTADO DE DATOS (READ) --- */}
      <section>
        <h3>📋 Registros Existentes</h3>
        {items.length === 0 && !isLoading ? (
          <p>No hay datos disponibles en este momento.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'col', gap: '15px' }}>
            {items.map((item) => (
              <div key={item.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '6px', backgroundColor: '#fff', position: 'relative' }}>
                <h4>{item.title}</h4>
                <p style={{ color: '#555' }}>{item.body}</p>
                <div style={{ marginTop: '10px' }}>
                  <button
                    onClick={() => handleEditClick(item)}
                    disabled={isLoading}
                    style={{ padding: '5px 10px', marginRight: '5px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={isLoading}
                    style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
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