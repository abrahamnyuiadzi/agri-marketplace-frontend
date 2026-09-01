import { useEffect, useState } from 'react';
import {
  getProducers,
  deleteProducer,
} from '../../../services/userService';

import type { User } from '../../../types';

import { Loader } from '../../../components/Loader';

import './styles.css';

export default function Producers() {
  const [producers, setProducers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Charger les producteurs
   */
  async function loadProducers() {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getProducers(1);

      setProducers(response.data);
    } catch (error) {
      console.error(
        'Erreur lors du chargement des producteurs :',
        error
      );

      setError(
        'Impossible de charger la liste des producteurs.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProducers();
  }, []);

  /**
   * Supprimer un producteur
   */
  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      'Voulez-vous vraiment supprimer ce producteur ?'
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProducer(id);

      setProducers((current) =>
        current.filter((producer) => producer.id !== id)
      );

      alert('Producteur supprimé avec succès.');
    } catch (error) {
      console.error(
        'Erreur lors de la suppression :',
        error
      );

      alert(
        'Impossible de supprimer ce producteur.'
      );
    }
  }

  /**
   * Recharger la liste
   */
  function handleRetry() {
    loadProducers();
  }

  return (
    <div className="admin-producers">

      {/* HEADER */}
      <div className="admin-producers__header">

        <div className="admin-producers__title">

          <span className="admin-producers__badge">
            👨‍🌾 Administration
          </span>

          <h1>Producteurs</h1>

          <p>
            Consultez et gérez les producteurs
            enregistrés sur Agri Marketplace.
          </p>

        </div>

        <div className="admin-producers__counter">
          <strong>{producers.length}</strong>
          <span>Producteurs</span>
        </div>

      </div>

      {/* LOADING */}
      {isLoading && (
        <div className="admin-producers__loader">
          <Loader />
        </div>
      )}

      {/* ERROR */}
      {!isLoading && error && (
        <div className="admin-producers__error">

          <div className="admin-producers__error-icon">
            ⚠️
          </div>

          <p>{error}</p>

          <button onClick={handleRetry}>
            Réessayer
          </button>

        </div>
      )}

      {/* EMPTY */}
      {!isLoading &&
        !error &&
        producers.length === 0 && (
          <div className="admin-producers__empty">

            <div className="admin-producers__empty-icon">
              👨‍🌾
            </div>

            <h2>
              Aucun producteur
            </h2>

            <p>
              Aucun producteur n'est actuellement
              enregistré sur la plateforme.
            </p>

          </div>
        )}

      {/* TABLE */}
      {!isLoading &&
        !error &&
        producers.length > 0 && (
          <div className="admin-producers__table-container">

            <table className="admin-producers__table">

              <thead>
                <tr>

                  <th>ID</th>

                  <th>Nom</th>

                  <th>Prénom</th>

                  <th>Numéro</th>

                  <th>Email</th>

                  <th>Rôle</th>

                  <th>Actions</th>

                </tr>
              </thead>

              <tbody>

                {producers.map((producer) => (
                  <tr key={producer.id}>

                    {/* ID */}
                    <td>
                      <span className="producer-id">
                        #{producer.id}
                      </span>
                    </td>

                    {/* NOM */}
                    <td>
                      <strong>
                        {producer.last_name}
                      </strong>
                    </td>

                    {/* PRÉNOM */}
                    <td>
                      {producer.first_name}
                    </td>

                    {/* TÉLÉPHONE */}
                    <td>
                      <a
                        href={`tel:${producer.phone}`}
                        className="producer-phone"
                      >
                        📞 {producer.phone}
                      </a>
                    </td>

                    {/* EMAIL */}
                    <td>
                      <a
                        href={`mailto:${producer.email}`}
                        className="producer-email"
                      >
                        {producer.email}
                      </a>
                    </td>

                    {/* ROLE */}
                    <td>
                      <span className="producer-role">
                        Producteur
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td>

                      <div className="producer-actions">

                        <button
                          type="button"
                          className="producer-action producer-action--view"
                          title="Voir le producteur"
                        >
                          👁
                        </button>

                        <button
                          type="button"
                          className="producer-action producer-action--edit"
                          title="Modifier le producteur"
                        >
                          ✏️
                        </button>

                        <button
                          type="button"
                          className="producer-action producer-action--delete"
                          title="Supprimer le producteur"
                          onClick={() =>
                            handleDelete(producer.id)
                          }
                        >
                          🗑
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

    </div>
  );
}