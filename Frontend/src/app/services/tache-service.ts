/*
export class TacheService {

  private readonly API = 'http://localhost:3000/api/taches';

  constructor(private http: HttpClient) {}

  // GET /api/taches
  getAll(): Observable<Tache[]> {
    return this.http.get<Tache[]>(this.API);
  }

  // GET /api/taches/:id
  getById(id: string): Observable<Tache> {
    return this.http.get<Tache>(`${this.API}/${id}`);
  }

  // GET /api/taches/phase/:phaseId
  getByPhase(phaseId: string): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this.API}/phase/${phaseId}`);
  }

  // GET /api/taches/user/:userId
  getByUser(userId: string): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this.API}/user/${userId}`);
  }

  // GET /api/taches/project/:projectId
  getByProject(projectId: string): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this.API}/project/${projectId}`);
  }

  // POST /api/taches
  create(tache: Partial<Tache>): Observable<Tache> {
    return this.http.post<Tache>(this.API, tache);
  }

  // PATCH /api/taches/:id
  update(id: string, tache: Partial<Tache>): Observable<Tache> {
    return this.http.patch<Tache>(`${this.API}/${id}`, tache);
  }

  // DELETE /api/taches/:id
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}*/
// ── src/app/services/tache-service.ts ───────────────────────────────────────
import { Injectable, signal, computed } from '@angular/core';
import { Tache, StatutTache } from '../core/models/tache.model';

// ── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_TACHES: Tache[] = [
  // ── À FAIRE ────────────────────────────────────────────────────────────────
  {
    _id: 'tk-001', titre: 'Rédiger les spécifications fonctionnelles',
    description: 'Documenter toutes les user stories et critères d\'acceptation.',
    statut: 'A FAIRE', priorite: 'HAUTE', heureEstimees: 8,
    dateEcheance: '2025-06-15', idPhase: 'ph-1', idProject: 'proj-1',
    idUtilisateur: 'u1', assigneNom: 'Amine Sadda', assigneEmail: 'amine@mail.com',
    complexite: 'MOYENNE', createdAt: '2025-05-01'
  },
  {
    _id: 'tk-002', titre: 'Configurer l\'environnement CI/CD',
    description: 'Mettre en place GitHub Actions pour déploiement automatique.',
    statut: 'A FAIRE', priorite: 'CRITIQUE', heureEstimees: 12,
    dateEcheance: '2025-06-10', idPhase: 'ph-1', idProject: 'proj-1',
    idUtilisateur: 'u2', assigneNom: 'Sara Benmoussa', assigneEmail: 'sara@mail.com',
    complexite: 'ELEVEE', createdAt: '2025-05-02'
  },
  {
    _id: 'tk-003', titre: 'Conception base de données',
    description: 'Modéliser le schéma relationnel et créer les migrations.',
    statut: 'A FAIRE', priorite: 'HAUTE', heureEstimees: 16,
    dateEcheance: '2025-06-20', idPhase: 'ph-2', idProject: 'proj-1',
    idUtilisateur: 'u3', assigneNom: 'Karim Ouali', assigneEmail: 'karim@mail.com',
    complexite: 'ELEVEE', createdAt: '2025-05-03'
  },
  {
    _id: 'tk-004', titre: 'Audit de sécurité',
    description: 'Vérification des failles OWASP Top 10.',
    statut: 'A FAIRE', priorite: 'MOYENNE', heureEstimees: 10,
    dateEcheance: '2025-07-01', idPhase: 'ph-3', idProject: 'proj-1',
    complexite: 'ELEVEE', createdAt: '2025-05-04'
  },
  // ── EN COURS ───────────────────────────────────────────────────────────────
  {
    _id: 'tk-005', titre: 'Développement module authentification',
    description: 'JWT + refresh tokens + gestion des rôles.',
    statut: 'EN COURS', priorite: 'CRITIQUE', heureEstimees: 20,
    dateEcheance: '2025-06-05', idPhase: 'ph-2', idProject: 'proj-1',
    idUtilisateur: 'u4', assigneNom: 'Nadia Ferhat', assigneEmail: 'nadia@mail.com',
    complexite: 'ELEVEE', createdAt: '2025-05-05'
  },
  {
    _id: 'tk-006', titre: 'Intégration API REST',
    description: 'Connecter le front Angular aux endpoints backend NestJS.',
    statut: 'EN COURS', priorite: 'HAUTE', heureEstimees: 14,
    dateEcheance: '2025-06-08', idPhase: 'ph-2', idProject: 'proj-1',
    idUtilisateur: 'u1', assigneNom: 'Amine Sadda', assigneEmail: 'amine@mail.com',
    complexite: 'MOYENNE', createdAt: '2025-05-06'
  },
  {
    _id: 'tk-007', titre: 'Création des maquettes UI',
    description: 'Figma wireframes pour les écrans principaux.',
    statut: 'EN COURS', priorite: 'MOYENNE', heureEstimees: 8,
    dateEcheance: '2025-06-03', idPhase: 'ph-1', idProject: 'proj-1',
    idUtilisateur: 'u5', assigneNom: 'Youcef Amrani', assigneEmail: 'youcef@mail.com',
    complexite: 'BASSE', createdAt: '2025-05-07'
  },
  // ── TERMINÉE ───────────────────────────────────────────────────────────────
  {
    _id: 'tk-008', titre: 'Initialisation du projet Angular',
    description: 'Scaffold, configuration ESLint, Prettier, Husky.',
    statut: 'TERMINEE', priorite: 'HAUTE', heureEstimees: 4, heureRelles: 5,
    dateEcheance: '2025-05-20', dateFin: '2025-05-21',
    idPhase: 'ph-1', idProject: 'proj-1',
    idUtilisateur: 'u3', assigneNom: 'Karim Ouali', assigneEmail: 'karim@mail.com',
    complexite: 'BASSE', createdAt: '2025-04-28'
  },
  {
    _id: 'tk-009', titre: 'Analyse des besoins client',
    description: 'Réunions de cadrage, rédaction du cahier des charges v1.',
    statut: 'TERMINEE', priorite: 'HAUTE', heureEstimees: 6, heureRelles: 6,
    dateEcheance: '2025-05-15', dateFin: '2025-05-14',
    idPhase: 'ph-1', idProject: 'proj-1',
    idUtilisateur: 'u2', assigneNom: 'Sara Benmoussa', assigneEmail: 'sara@mail.com',
    complexite: 'MOYENNE', createdAt: '2025-04-25'
  },
  {
    _id: 'tk-010', titre: 'Mise en place du repository Git',
    description: 'Initialisation mono-repo, branches protection rules.',
    statut: 'TERMINEE', priorite: 'BASSE', heureEstimees: 2, heureRelles: 2,
    dateEcheance: '2025-05-10', dateFin: '2025-05-09',
    idPhase: 'ph-1', idProject: 'proj-1',
    idUtilisateur: 'u6', assigneNom: 'Lina Hadjadj', assigneEmail: 'lina@mail.com',
    complexite: 'BASSE', createdAt: '2025-04-22'
  },
];

// ── SERVICE ──────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class TacheService {

  // Reactive state using Angular signals
  private _taches = signal<Tache[]>(MOCK_TACHES);

  /** Public read-only signal */
  readonly taches = this._taches.asReadonly();

  /** Computed: tasks grouped by statut */
  readonly tachesParStatut = computed(() => ({
    'A FAIRE':  this._taches().filter(t => t.statut === 'A FAIRE'),
    'EN COURS': this._taches().filter(t => t.statut === 'EN COURS'),
    'TERMINEE': this._taches().filter(t => t.statut === 'TERMINEE'),
  }));

  // ── CRUD ──────────────────────────────────────────────────────────────────

  /** Get all tasks */
  getAll(): Tache[] {
    return this._taches();
  }

  /** Get task by id */
  getById(id: string): Tache | undefined {
    return this._taches().find(t => t._id === id);
  }

  /** Add a new task */
  add(tache: Omit<Tache, '_id' | 'createdAt'>): Tache {
    const newTache: Tache = {
      ...tache,
      _id: 'tk-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    this._taches.update(list => [...list, newTache]);
    return newTache;
  }

  /** Update an existing task */
  update(id: string, changes: Partial<Tache>): Tache | null {
    let updated: Tache | null = null;
    this._taches.update(list =>
      list.map(t => {
        if (t._id === id) {
          updated = { ...t, ...changes, updatedAt: new Date().toISOString().split('T')[0] };
          return updated;
        }
        return t;
      })
    );
    return updated;
  }

  /** Move task to a new status column */
  moveToStatut(id: string, statut: StatutTache): void {
    this.update(id, { statut });
  }

  /** Delete a task */
  delete(id: string): void {
    this._taches.update(list => list.filter(t => t._id !== id));
  }

  /** Filter tasks by technician and/or status */
  filter(params: { technicienId?: string; statut?: StatutTache; search?: string }): Tache[] {
    return this._taches().filter(t => {
      const matchTech   = !params.technicienId || t.idUtilisateur === params.technicienId;
      const matchStatut = !params.statut       || t.statut === params.statut;
      const matchSearch = !params.search       ||
        t.titre.toLowerCase().includes(params.search.toLowerCase()) ||
        (t.description?.toLowerCase().includes(params.search.toLowerCase()) ?? false);
      return matchTech && matchStatut && matchSearch;
    });
  }
}