import { useEffect, useState, type FormEvent } from 'react';
import {
  getMyFarms,
  createFarm,
  updateFarm,
  deleteFarm,
} from '../../../services/farmService';
import { extractApiError } from '../../../services/api';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Modal } from '../../../components/common/Modal';

import type { Farm, FarmType } from '../../../types';
import './styles.css';
import { Loader } from '../../../components/Loader';

interface FarmFormState {
  name: string;
  description: string;
  location: string;
  city: string;
  country: string;
  surface: string;
  type: FarmType;
}

const EMPTY_FORM: FarmFormState = {
  name: '',
  description: '',
  location: '',
  city: '',
  country: 'Togo',
  surface: '',
  type: 'crop',
};

const FARM_TYPES: { value: FarmType; label: string }[] = [
  { value: 'crop', label: 'Culture' },
  { value: 'livestock', label: 'Élevage' },
  { value: 'mixed', label: 'Mixte' },
  { value: 'other', label: 'Autre' },
];

export default function ProducerFarms() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [form, setForm] = useState<FarmFormState>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  function loadFarms() {
    setIsLoading(true);
    getMyFarms()
      .then(setFarms)
      .catch((err) => console.error('Erreur de chargement des exploitations:', err))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    loadFarms();
  }, []);

  function openCreateModal() {
    setEditingFarm(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setFormError(null);
    setIsModalOpen(true);
  }

  function openEditModal(farm: Farm) {
    setEditingFarm(farm);
    setForm({
      name: farm.name,
      description: farm.description ?? '',
      location: farm.location,
      city: farm.city,
      country: farm.country,
      surface: String(farm.surface),
      type: farm.type,
    });
    setImageFile(null);
    setFormError(null);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function updateField<K extends keyof FarmFormState>(key: K, value: FarmFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setIsSaving(true);

    const payload = new FormData();
    payload.append('name', form.name);
    payload.append('description', form.description);
    payload.append('location', form.location);
    payload.append('city', form.city);
    payload.append('country', form.country);
    payload.append('surface', form.surface);
    payload.append('type', form.type);
    if (imageFile) {
      payload.append('image', imageFile);
    }

    try {
      if (editingFarm) {
        await updateFarm(editingFarm.id, payload);
      } else {
        await createFarm(payload);
      }
      closeModal();
      loadFarms();
    } catch (err) {
      setFormError(extractApiError(err).message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(farm: Farm) {
    const confirmed = window.confirm(
      `Supprimer l'exploitation "${farm.name}" ? Les produits associés pourraient aussi être affectés.`
    );
    if (!confirmed) return;

    setDeletingId(farm.id);
    try {
      await deleteFarm(farm.id);
      loadFarms();
    } catch (err) {
      alert(extractApiError(err).message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="producer-farms">
      <div className="producer-farms__header">
        <h1>Mes exploitations</h1>
        <Button onClick={openCreateModal}>+ Ajouter une exploitation</Button>
      </div>

      {isLoading ? (
        <Loader />
      ) : farms.length === 0 ? (
        <div className="producer-farms__empty">
          <p>Tu n'as pas encore d'exploitation.</p>
          <p className="producer-farms__empty-hint">
            Crée ta première exploitation pour pouvoir ensuite y ajouter des produits.
          </p>
        </div>
      ) : (
        <div className="farms-grid">
          {farms.map((farm) => (
            <div key={farm.id} className="farm-card">
              <div className="farm-card__image">
                {farm.image_url ? (
                  <img src={farm.image_url} alt={farm.name} />
                ) : (
                  <span>🚜</span>
                )}
                {farm.is_verified && <span className="farm-card__badge">✅ Vérifiée</span>}
              </div>
              <div className="farm-card__body">
                <h3>{farm.name}</h3>
                <p className="farm-card__location">
                  📍 {farm.location}, {farm.city} — {farm.country}
                </p>
                <p className="farm-card__meta">
                  {FARM_TYPES.find((t) => t.value === farm.type)?.label ?? farm.type} · {farm.surface} ha
                </p>
                {farm.description && <p className="farm-card__description">{farm.description}</p>}

                <div className="farm-card__actions">
                  <button className="admin-table__edit" onClick={() => openEditModal(farm)}>
                    Modifier
                  </button>
                  <button
                    className="admin-table__delete"
                    onClick={() => handleDelete(farm)}
                    disabled={deletingId === farm.id}
                  >
                    {deletingId === farm.id ? '…' : 'Supprimer'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingFarm ? "Modifier l'exploitation" : 'Nouvelle exploitation'}
      >
        <form onSubmit={handleSubmit} className="farm-form">
          {formError && <div className="farm-form__error">{formError}</div>}

          <Input
            type="text"
            name="name"
            label="Nom de l'exploitation"
            placeholder="ex: Ferme AgriGreen"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            required
          />

          <Input
            type="text"
            name="location"
            label="Localisation précise"
            placeholder="ex: Quartier Zongo"
            value={form.location}
            onChange={(e) => updateField('location', e.target.value)}
            required
          />

          <div className="farm-form__row">
            <Input
              type="text"
              name="city"
              label="Ville"
              placeholder="ex: Atakpamé"
              value={form.city}
              onChange={(e) => updateField('city', e.target.value)}
              required
            />
            <Input
              type="text"
              name="country"
              label="Pays"
              placeholder="ex: Togo"
              value={form.country}
              onChange={(e) => updateField('country', e.target.value)}
              required
            />
          </div>

          <div className="farm-form__row">
            <Input
              type="number"
              name="surface"
              label="Superficie (hectares)"
              placeholder="2.5"
              value={form.surface}
              onChange={(e) => updateField('surface', e.target.value)}
              min={0}
              step="0.1"
              required
            />
            <div className="input-group">
              <label className="input-label" htmlFor="type">
                Type d'exploitation
              </label>
              <select
                id="type"
                className="input"
                value={form.type}
                onChange={(e) => updateField('type', e.target.value as FarmType)}
              >
                {FARM_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="input farm-form__textarea"
              rows={3}
              placeholder="Décris ton exploitation, tes méthodes de culture…"
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="image">
              Photo de l'exploitation
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
            {editingFarm && (
              <span className="farm-form__hint">
                Laisse vide pour garder la photo actuelle.
              </span>
            )}
          </div>

          <div className="farm-form__actions">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Annuler
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {editingFarm ? 'Enregistrer' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}