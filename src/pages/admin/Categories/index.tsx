import { useEffect, useState, type FormEvent } from 'react';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../../services/categoryService';
import { extractApiError } from '../../../services/api';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Modal } from '../../../components/common/Modal';

import type { Category } from '../../../types';
import './styles.css';
import { Loader } from '../../../components/Loader';

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  function loadCategories() {
    setIsLoading(true);
    getCategories()
      .then(setCategories)
      .catch((err) => console.error('Erreur de chargement des catégories:', err))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function openCreateModal() {
    setEditingCategory(null);
    setName('');
    setFormError(null);
    setIsModalOpen(true);
  }

  function openEditModal(category: Category) {
    setEditingCategory(category);
    setName(category.name);
    setFormError(null);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setIsSaving(true);

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, { name });
      } else {
        await createCategory({ name });
      }
      closeModal();
      loadCategories();
    } catch (err) {
      setFormError(extractApiError(err).message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(category: Category) {
    const confirmed = window.confirm(`Supprimer la catégorie "${category.name}" ?`);
    if (!confirmed) return;

    setDeletingId(category.id);
    try {
      await deleteCategory(category.id);
      loadCategories();
    } catch (err) {
      alert(extractApiError(err).message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="admin-categories">
      <div className="admin-categories__header">
        <h1>Gestion des catégories</h1>
        <Button onClick={openCreateModal}>+ Nouvelle catégorie</Button>
      </div>

      {isLoading ? (
        <Loader />
      ) : categories.length === 0 ? (
        <p className="admin-categories__empty">Aucune catégorie pour l'instant.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Nom</th>
              <th>Slug</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>
                  <div className="admin-table__thumb">
                    {category.image_url ? (
                      <img src={category.image_url} alt={category.name} />
                    ) : (
                      <span>🗂️</span>
                    )}
                  </div>
                </td>
                <td>{category.name}</td>
                <td className="admin-table__muted">{category.slug}</td>
                <td className="admin-table__actions">
                  <button className="admin-table__edit" onClick={() => openEditModal(category)}>
                    Modifier
                  </button>
                  <button
                    className="admin-table__delete"
                    onClick={() => handleDelete(category)}
                    disabled={deletingId === category.id}
                  >
                    {deletingId === category.id ? '…' : 'Supprimer'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
      >
        <form onSubmit={handleSubmit} className="category-form">
          {formError && <div className="category-form__error">{formError}</div>}

          <Input
            type="text"
            name="name"
            label="Nom de la catégorie"
            placeholder="ex: Légumes"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="category-form__actions">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Annuler
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {editingCategory ? 'Enregistrer' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}