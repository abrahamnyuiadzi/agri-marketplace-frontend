import { useEffect, useState, type FormEvent } from 'react';
import {
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../../services/productService';
import { getMyFarms } from '../../../services/farmService';
import { getCategories } from '../../../services/categoryService';
import { extractApiError } from '../../../services/api';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Modal } from '../../../components/common/Modal';
import { formatPrice } from '../../../utils/helpers';
import type { Category, Farm, Product } from '../../../types';
import './styles.css';
import { Loader } from '../../../components/Loader';

interface ProductFormState {
  name: string;
  description: string;
  price: string;
  quantity: string;
  unit: string;
  category_id: string;
  farm_id: string;
  is_available: boolean;
}

const EMPTY_FORM: ProductFormState = {
  name: '',
  description: '',
  price: '',
  quantity: '',
  unit: 'kg',
  category_id: '',
  farm_id: '',
  is_available: true,
};

export default function ProducerProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  function loadData() {
    setIsLoading(true);

    Promise.all([
      getMyProducts(),
      getMyFarms(),
      getCategories(),
    ])
      .then(([productsData, farmsData, categoriesData]) => {
        setProducts(productsData.data);
        setFarms(farmsData);
        setCategories(categoriesData);
      })
      .catch((err) => {
        console.error('Erreur de chargement:', err);
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    loadData();
  }, []);

  function openCreateModal() {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setFormError(null);
    setIsModalOpen(true);
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);

    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      quantity: String(product.quantity),
      unit: product.unit,
      category_id: String(product.category_id),
      farm_id: String(product.farm_id),
      is_available: product.is_available,
    });

    setImageFile(null);
    setFormError(null);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function updateField<K extends keyof ProductFormState>(
    key: K,
    value: ProductFormState[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!form.farm_id) {
      setFormError('Sélectionne une exploitation.');
      return;
    }

    if (!form.category_id) {
      setFormError('Sélectionne une catégorie.');
      return;
    }

    if (!form.name.trim()) {
      setFormError('Le nom du produit est obligatoire.');
      return;
    }

    if (!form.description.trim()) {
      setFormError('La description est obligatoire.');
      return;
    }

    if (!form.price || Number(form.price) < 0) {
      setFormError('Le prix doit être valide.');
      return;
    }

    if (!form.quantity || Number(form.quantity) < 0) {
      setFormError('La quantité doit être valide.');
      return;
    }

    // L'image est obligatoire uniquement à la création
    if (!editingProduct && !imageFile) {
      setFormError('Veuillez sélectionner une image du produit.');
      return;
    }

    setIsSaving(true);

    const payload = new FormData();

    payload.append('name', form.name);
    payload.append('description', form.description);
    payload.append('price', form.price);
    payload.append('quantity', form.quantity);
    payload.append('unit', form.unit);
    payload.append('category_id', form.category_id);
    payload.append('farm_id', form.farm_id);
    payload.append('is_available', form.is_available ? '1' : '0');

    // Le backend attend "image", pas "images[]"
    if (imageFile) {
      payload.append('image', imageFile);
    }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await createProduct(payload);
      }

      closeModal();
      loadData();
    } catch (err) {
      setFormError(extractApiError(err).message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(
      `Supprimer le produit "${product.name}" ?`
    );

    if (!confirmed) return;

    setDeletingId(product.id);

    try {
      await deleteProduct(product.id);
      loadData();
    } catch (err) {
      alert(extractApiError(err).message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="producer-products">

      <div className="producer-products__header">
        <h1>Mes produits</h1>

        <Button
          onClick={openCreateModal}
          disabled={farms.length === 0}
        >
          + Ajouter un produit
        </Button>
      </div>

      {farms.length === 0 && !isLoading && (
        <p className="producer-products__warning">
          Tu dois d'abord créer une exploitation avant de pouvoir ajouter un
          produit.
        </p>
      )}

      {isLoading ? (
        <Loader />
      ) : products.length === 0 ? (
        <p className="producer-products__empty">
          Aucun produit pour l'instant.
        </p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Nom</th>
              <th>Prix</th>
              <th>Quantité</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="admin-table__thumb">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                      />
                    ) : (
                      <span>🥬</span>
                    )}
                  </div>
                </td>

                <td>{product.name}</td>

                <td>
                  {formatPrice(product.price)}
                  <span className="admin-table__muted">
                    {' '}
                    / {product.unit}
                  </span>
                </td>

                <td>{product.quantity}</td>

                <td className="admin-table__actions">
                  <button
                    className="admin-table__edit"
                    onClick={() => openEditModal(product)}
                  >
                    Modifier
                  </button>

                  <button
                    className="admin-table__delete"
                    onClick={() => handleDelete(product)}
                    disabled={deletingId === product.id}
                  >
                    {deletingId === product.id
                      ? '…'
                      : 'Supprimer'}
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
        title={
          editingProduct
            ? 'Modifier le produit'
            : 'Ajouter un produit'
        }
      >
        <form
          onSubmit={handleSubmit}
          className="product-form"
        >
          {formError && (
            <div className="product-form__error">
              {formError}
            </div>
          )}

          {/* NOM */}
          <Input
            type="text"
            name="name"
            label="Nom du produit"
            placeholder="ex: Tomates fraîches"
            value={form.name}
            onChange={(e) =>
              updateField('name', e.target.value)
            }
            required
          />

          {/* DESCRIPTION */}
          <div className="input-group">
            <label
              className="input-label"
              htmlFor="description"
            >
              Description
            </label>

            <textarea
              id="description"
              className="input product-form__textarea"
              rows={3}
              value={form.description}
              onChange={(e) =>
                updateField(
                  'description',
                  e.target.value
                )
              }
              required
            />
          </div>

          {/* PRIX + UNITÉ */}
          <div className="product-form__row">

            <Input
              type="number"
              name="price"
              label="Prix"
              placeholder="500"
              value={form.price}
              onChange={(e) =>
                updateField('price', e.target.value)
              }
              min={0}
              required
            />

            <div className="input-group">
              <label
                className="input-label"
                htmlFor="unit"
              >
                Unité
              </label>

              <select
                id="unit"
                className="input"
                value={form.unit}
                onChange={(e) =>
                  updateField('unit', e.target.value)
                }
              >
                <option value="kg">kg</option>
                <option value="unité">unité</option>
                <option value="botte">botte</option>
                <option value="plateau">plateau</option>
                <option value="litre">litre</option>
              </select>
            </div>
          </div>

          {/* QUANTITÉ */}
          <Input
            type="number"
            name="quantity"
            label="Quantité disponible"
            placeholder="20"
            value={form.quantity}
            onChange={(e) =>
              updateField('quantity', e.target.value)
            }
            min={0}
            required
          />

          {/* EXPLOITATION + CATÉGORIE */}
          <div className="product-form__row">

            <div className="input-group">
              <label
                className="input-label"
                htmlFor="farm_id"
              >
                Exploitation
              </label>

              <select
                id="farm_id"
                className="input"
                value={form.farm_id}
                onChange={(e) =>
                  updateField(
                    'farm_id',
                    e.target.value
                  )
                }
                required
              >
                <option value="">
                  Choisir…
                </option>

                {farms.map((farm) => (
                  <option
                    key={farm.id}
                    value={farm.id}
                  >
                    {farm.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label
                className="input-label"
                htmlFor="category_id"
              >
                Catégorie
              </label>

              <select
                id="category_id"
                className="input"
                value={form.category_id}
                onChange={(e) =>
                  updateField(
                    'category_id',
                    e.target.value
                  )
                }
                required
              >
                <option value="">
                  Choisir…
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* IMAGE */}
          <div className="input-group">
            <label
              className="input-label"
              htmlFor="image"
            >
              Image du produit
            </label>

            <input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              onChange={(e) =>
                setImageFile(
                  e.target.files?.[0] ?? null
                )
              }
              required={!editingProduct}
            />

            {editingProduct && (
              <span className="product-form__hint">
                Laisse vide pour conserver l'image
                actuelle.
              </span>
            )}
          </div>

          {/* DISPONIBILITÉ */}
          <div className="input-group">
            <label
              className="input-label"
              htmlFor="is_available"
            >
              Disponibilité
            </label>

            <select
              id="is_available"
              className="input"
              value={form.is_available ? '1' : '0'}
              onChange={(e) =>
                updateField(
                  'is_available',
                  e.target.value === '1'
                )
              }
            >
              <option value="1">
                Disponible
              </option>

              <option value="0">
                Indisponible
              </option>
            </select>
          </div>

          {/* ACTIONS */}
          <div className="product-form__actions">

            <Button
              type="button"
              variant="secondary"
              onClick={closeModal}
            >
              Annuler
            </Button>

            <Button
              type="submit"
              isLoading={isSaving}
            >
              {editingProduct
                ? 'Enregistrer'
                : 'Créer'}
            </Button>

          </div>

        </form>
      </Modal>
    </div>
  );
}