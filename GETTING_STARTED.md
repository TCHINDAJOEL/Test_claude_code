# 🚀 Guide de Démarrage Rapide - SaveIt.now

## ✅ Prérequis Vérifiés
- ✓ Node.js v22.21.1
- ✓ pnpm 10.4.1
- ✓ Dépendances installées (2314 packages)

## 📝 Étapes de Configuration

### 1. Configuration de la Base de Données

Vous avez 3 options :

#### Option A: Neon (Recommandé - Gratuit)
1. Créez un compte sur [neon.tech](https://neon.tech)
2. Créez une nouvelle base de données PostgreSQL
3. Copiez l'URL de connexion dans `.env.local`

#### Option B: Supabase (Gratuit)
1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Copiez l'URL de connexion PostgreSQL

#### Option C: PostgreSQL Local
```bash
# Installer PostgreSQL
brew install postgresql  # macOS
sudo apt-get install postgresql  # Ubuntu

# Créer une base de données
createdb saveit_dev
```

### 2. Modifier le fichier .env.local

Éditez `apps/web/.env.local` et configurez au minimum :

```bash
# Changez cette URL avec votre base de données
DATABASE_URL="postgresql://user:password@host:5432/database"
DATABASE_URL_UNPOOLED="postgresql://user:password@host:5432/database"

# Générez une clé secrète (min 32 caractères)
BETTER_AUTH_SECRET="$(openssl rand -base64 32)"
```

### 3. Générer le Client Prisma et Migrer la DB

```bash
# Générer le client Prisma
pnpm db:generate

# Appliquer les migrations
pnpm db:migrate
```

### 4. Lancer le Serveur de Développement

```bash
# Démarre tous les services avec Turbo
pnpm dev

# OU uniquement l'app web
cd apps/web && pnpm dev
```

Le site sera accessible sur : **http://localhost:3000**

## 🧪 Tests et Validation

### Tests Unitaires
```bash
cd apps/web
pnpm test:ci
```

### Tests E2E (Playwright)
```bash
cd apps/web
pnpm test:e2e:ci
```

### Vérification TypeScript
```bash
cd apps/web
pnpm ts
```

### Linting
```bash
cd apps/web
pnpm lint
```

## 🔧 Configuration Optionnelle

### OAuth GitHub (Pour l'authentification)
1. Allez sur https://github.com/settings/developers
2. Créez une nouvelle OAuth App
3. Callback URL: `http://localhost:3000/api/auth/callback/github`
4. Ajoutez les clés dans `.env.local`

### OAuth Google
1. Allez sur https://console.cloud.google.com
2. Créez un nouveau projet
3. Activez Google+ API
4. Créez des identifiants OAuth
5. Callback URL: `http://localhost:3000/api/auth/callback/google`

### Stripe (Pour les paiements)
1. Créez un compte sur https://stripe.com
2. Récupérez vos clés API de test
3. Ajoutez dans `.env.local`

### Autres Services (Optionnels pour démarrer)
- **Resend** : Emails transactionnels
- **OpenAI** : Fonctionnalités IA
- **Cloudflare** : Screenshots
- **Upstash Redis** : Caching
- **Inngest** : Jobs en arrière-plan

## 📁 Structure du Projet

```
saveit.now/
├── apps/
│   ├── web/              # Application Next.js principale
│   ├── mobile/           # App React Native (iOS/Android)
│   ├── chrome-extension/ # Extension Chrome
│   └── firefox-extension/# Extension Firefox
├── packages/
│   ├── database/         # Prisma schema et client
│   ├── ui/              # Composants UI partagés (shadcn)
│   ├── eslint-config/   # Config ESLint partagée
│   └── typescript-config/# Config TypeScript partagée
└── claude-code-config/   # Configuration Claude Code
```

## 🐛 Dépannage

### Erreur: "Cannot find module '@workspace/database'"
```bash
pnpm db:generate
```

### Erreur de connexion à la base de données
- Vérifiez que `DATABASE_URL` est correct
- Testez la connexion : `psql $DATABASE_URL`

### Port 3000 déjà utilisé
```bash
# Changez le port
PORT=3001 pnpm dev
```

### Build scripts bloqués
```bash
pnpm approve-builds
```

## 📚 Commandes Utiles

```bash
# Monorepo
pnpm dev                 # Démarre tous les services
pnpm build              # Build tout le projet
pnpm lint               # Lint tout le projet
pnpm format             # Formatte le code

# Base de données
pnpm db:generate        # Génère le client Prisma
pnpm db:migrate         # Applique les migrations (dev)
pnpm db:deploy          # Applique les migrations (prod)

# Web App
cd apps/web
pnpm dev                # Dev server Next.js
pnpm build              # Build production
pnpm ts                 # Vérif TypeScript
pnpm lint               # ESLint
pnpm test:ci            # Tests unitaires
pnpm test:e2e:ci        # Tests E2E
```

## 🎯 Prochaines Étapes

1. ✅ Configuration minimale faite
2. 🔄 Configurez OAuth (GitHub/Google) pour l'auth
3. 🎨 Explorez l'interface sur http://localhost:3000
4. 📖 Consultez `CLAUDE.md` pour les guidelines de dev
5. 🧪 Lancez les tests pour vérifier que tout fonctionne

## 🆘 Besoin d'aide ?

- Documentation complète : `README.md`
- Guide API : `QUICKSTART_APIs.md`
- Architecture : `CLAUDE.md`
- Agents Claude : `AGENTS.md`

---

**Projet prêt à être lancé ! 🎉**
