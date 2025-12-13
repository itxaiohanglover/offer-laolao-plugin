<p align="center">
  <img src="../assets/laolao.gif" alt="Offer Laolao Logo" width="200">
</p>

<p align="center">
  <a href="../README.md"><img src="https://img.shields.io/badge/English-blue" alt="English"></a>
  <a href="./README.zh-CN.md"><img src="https://img.shields.io/badge/中文-red" alt="中文"></a>
  <a href="./README.zh-TW.md"><img src="https://img.shields.io/badge/中文繁体-orange" alt="中文繁体"></a>
  <a href="./README.fr.md"><img src="https://img.shields.io/badge/Français-green" alt="Français"></a>
  <a href="./README.ja.md"><img src="https://img.shields.io/badge/日本語-purple" alt="日本語"></a>
  <a href="./README.ko.md"><img src="https://img.shields.io/badge/한국어-pink" alt="한국어"></a>
  <a href="./README.ru.md"><img src="https://img.shields.io/badge/Русский-teal" alt="Русский"></a>
  <a href="./README.es.md"><img src="https://img.shields.io/badge/Español-yellow" alt="Español"></a>
  <a href="./README.ar.md"><img src="https://img.shields.io/badge/العربية-yellow" alt="العربية"></a>
  <a href="./README.id.md"><img src="https://img.shields.io/badge/Bahasa_Indonesia-yellow" alt="Bahasa Indonesia"></a>
</p>

# 🚀 Offer Laolao - Assistant intelligent de remplissage automatique de CV plugin navigateur

> Une extension puissante pour navigateur Chrome prenant en charge le double mode d'analyse intelligente de CV et de remplissage manuel, avec fonctionnalités de **correspondance intelligente de champs par IA** et **remplissage précis au niveau des champs**, aidant les candidats à compléter rapidement et avec précision leurs CV sur les grands sites de recrutement.

![Version](https://img.shields.io/badge/Version-1.0-blue)
![Chrome](https://img.shields.io/badge/Chrome-Extension-green)
![Manifest](https://img.shields.io/badge/Manifest-V3-orange)

🌐 **Accès en ligne** : [https://offer-laolao-plugin.vercel.app](https://offer-laolao-plugin.vercel.app)

## ✨ Fonctionnalités clés

### 📄 Analyse intelligente de CV

- **Prise en charge de multiples formats** : Prend en charge les formats de CV主流 tels que PDF, DOCX, DOC, TXT, JSON
- **Analyse API cloud** : Intègre l'API d'analyse de CV du marché Alibaba Cloud pour extraire précisément les informations du CV
- **Import direct JSON** : Prend en charge l'import direct des données de CV au format JSON pour la sauvegarde et la restauration des données
- **Téléchargement par glisser-déposer** : Prend en charge le glisser-déposer de fichiers pour une manipulation pratique
- **Mappage intelligent des champs** : Mappe automatiquement les résultats d'analyse aux champs correspondants du formulaire

### 📝 Gestion complète des informations de CV

Prend en charge le remplissage et la gestion des modules de CV suivants :

| Module              | Champs inclus                                                                 |
| ----------------- | ---------------------------------------------------------------------------- |
| **Informations de base**      | Nom, Sexe, Date de naissance, Numéro de téléphone, Email, Numéro de carte d'identité, Lieu de résidence, Statut politique         |
| **Attentes de travail**      | Poste souhaité, Secteur souhaité, Salaire souhaité, Lieu souhaité, Durée de stage, Horaires de travail possibles                 |
| **Expériences éducatives**      | Nom de l'école, Spécialité, Niveau d'études (DUT/Licence/Master/Doctorat), Classement, Dates de début/fin (prise en charge de plusieurs entrées) |
| **Expériences professionnelles/stages** | Nom de l'entreprise, Poste, Dates de début/fin, Description du travail (prise en charge de plusieurs entrées)                          |
| **Projets**      | Nom du projet, Rôle occupé, Durée du projet, Description du projet, Description des responsabilités (prise en charge de plusieurs entrées)                 |
| **Compétences**      | Nom de la compétence, Niveau (Débutant/Intermédiaire/Avancé/Expert) (prise en charge de plusieurs entrées)                        |
| **Compétences linguistiques**      | Nom de la langue, Niveau de maîtrise (Débutant/De base/Expérimenté/Parfait), Certificats linguistiques (prise en charge de plusieurs entrées)              |
| **Champs personnalisés**    | Nom et contenu des champs personnalisés (prise en charge de plusieurs entrées)                                             |
| **Auto-description**      | Présentation des atouts et caractéristiques personnels                                                           |

### 🎯 Remplissage intelligent de formulaires

#### Fonctionnalité de pré-remplissage en un clic

- Cliquez sur le bouton "📋 Pré-remplir" pour remplir automatiquement les données du CV dans le formulaire du site de recrutement actuel
- Reconnaissance intelligente des champs du formulaire, correspondance automatique avec les informations du CV
- Prend en charge divers éléments de formulaire comme input, textarea, select, contenteditable
- Déclenche automatiquement les événements de formulaire (input, change, blur) pour garantir la validation du site
- Fournit un retour visuel après remplissage, mettant en évidence les champs remplis

#### Remplissage précis au niveau des champs (↗ Remplissage par pointage)

- Chaque champ dispose d'un bouton "↗" pour le **remplissage précis d'un seul champ**
- Après avoir cliqué sur le bouton, entrez en "mode de remplissage par pointage" :
  - Un conseil d'utilisation s'affiche en haut de la page
  - Lorsque la souris survole un élément remplissable, il est mis en évidence (bordure bleue)
  - Cliquez sur la zone de saisie cible pour insérer la valeur du champ
  - Appuyez sur la touche `Esc` pour annuler l'opération
- Prend en charge le remplissage dans les éléments input, textarea, select, contenteditable
- Déclenche automatiquement les événements de formulaire (input, change, blur) pour garantir la validation du site
- Ferme automatiquement la fenêtre contextuelle après un remplissage réussi, facilitant les opérations consécutives

### 🤖 Intégration de grands modèles d'IA

Prend en charge plusieurs fournisseurs de grands modèles chinois pour l'optimisation intelligente du contenu du CV et la correspondance des champs :

| Fournisseur                | Modèles pris en charge                                               |
| --------------------- | ------------------------------------------------------ |
| **DeepSeek**          | DeepSeek Chat, DeepSeek Coder                          |
| **Kimi (Moonshot)**   | Moonshot 8K/32K/128K                                   |
| **Tongyi Qianwen (Alibaba Cloud)** | Qwen Turbo/Plus/Max/Max Long Text                         |
| **Volcano Engine (Doubao)**   | Doubao Seed 1.6, Doubao Seed 1.6 Lite, Doubao Seed 1.6 Flash |
| **Zhipu AI**           | GLM-4, GLM-4 Flash, GLM-3 Turbo                        |
| **Baichuan Intelligence**          | Baichuan 2 Turbo, Baichuan 2 Turbo 192K                        |
| **Personnalisé**            | Prend en charge toute API compatible avec OpenAI                         |

**Fonctionnalités AI** :

- Test de connexion API en un clic
- **✨ Optimisation du CV par IA en un clic** : Optimise intelligemment la présentation personnelle, la description des tâches, la description des projets, etc.
- **🤖 Génération d'introduction de CV par IA** : Génère intelligemment une présentation professionnelle basée sur les données du CV (200-300 caractères)
  - Prise en charge de la copie dans le presse-papiers, de l'insertion dans le champ d'auto-description, du téléchargement en fichier TXT
- Optimisation des descriptions de travail et de projet selon la méthode STAR
- Ajout automatique de données quantifiées et de descriptions de résultats

### 📤 Export en plusieurs formats

- **Export JSON** : Exportez les données complètes du CV pour la sauvegarde et la synchronisation entre appareils
- **Export LaTeX** : Générez un modèle de CV professionnel en LaTeX
  - Peut être compilé directement sur [Overleaf](https://www.overleaf.com/)
  - Prise en charge du chinois (utilisation du package ctex)
  - Mise en page professionnelle, adaptée aux postes universitaires et techniques
  - Inclut une définition complète des styles et des commentaires
- **🤖 Génération d'introduction de CV par IA** : Appelez un modèle IA pour générer une présentation professionnelle intelligente
  - Généré à partir des antécédents éducatifs, des expériences professionnelles, des projets et des compétences du CV
  - Prise en charge de la copie dans le presse-papiers
  - Prise en charge de l'insertion en un clic dans le champ d'auto-description
  - Prise en charge du téléchargement en fichier `.txt`
- **Export de prompts pour introduction de CV** : Exportez un modèle de prompts structuré pour l'interaction avec l'IA (prise en charge de `.md`/`.txt`)
  - Inclut des prompts pour les informations de base personnelles
  - Modèle de questions pour les expériences professionnelles
  - Cadre de questions pour les expériences de projet
  - Questions d'évaluation des compétences

### 💾 Persistance des données

- **Chrome Storage API** : Utilise le stockage natif du navigateur, données sécurisées et fiables
- **Sauvegarde automatique en temps réel** : Sauvegarde automatiquement lorsque le contenu du formulaire change, évite la perte de données
- **Sauvegarde manuelle** : Prise en charge de la sauvegarde manuelle en cliquant sur le bouton de sauvegarde
- **Réinitialisation des données** : Efface toutes les données du CV en un clic, recommencez
- **Sauvegarde automatique des paramètres** : Les configurations de la page de paramètres sont sauvegardées automatiquement

## 🏗️ Architecture du projet

```
super_resume/
├── docs                       # Page d'introduction
├── manifest.json              # Fichier de configuration de l'extension Chrome (Manifest V3)
├── icons/                     # Icônes de l'extension
├── src/
│   ├── background/            # Scripts de service en arrière-plan
│   ├── content/               # Scripts de contenu (injectés dans les pages web)
│   └── popup/                 # Page contextuelle
└── README.md
```

## 📦 Guide d'installation

### Méthode 1 : Installation en mode développeur

1. **Téléchargez le projet**

   ```bash
   git clone https://github.com/itxaiohanglover/offer-laolao-plugin.git
   ```

   Ou téléchargez directement le ZIP et extrayez-le

2. **Ouvrez la page de gestion des extensions Chrome**

   - Entrez dans la barre d'adresse : `chrome://extensions/`
   - Ou via le menu : Plus d'outils → Extensions

3. **Activez le mode développeur**

   - Cliquez sur le bouton "Mode développeur" en haut à droite

4. **Chargez l'extension**

   - Cliquez sur "Charger l'extension décompressée"
   - Sélectionnez le répertoire racine du projet (dossier contenant `manifest.json`)

5. **Installation terminée**
   - L'icône de l'extension apparaîtra dans la barre d'outils du navigateur
   - Cliquez sur l'icône pour ouvrir l'assistant de remplissage de CV

### Méthode 2 : Installation sur navigateur Edge

Le navigateur Edge prend également en charge les extensions Chrome :

1. Ouvrez `edge://extensions/`
2. Activez le "Mode développeur"
3. Cliquez sur "Charger l'extension décompressée"
4. Sélectionnez le répertoire du projet

## 🚀 Tutoriel d'utilisation

### Étape 1 : Configurer l'API (optionnel mais recommandé)

1. Cliquez sur l'icône de l'extension, basculez vers l'onglet "⚙️ Paramètres"
2. **Configurez le modèle AI** (pour l'optimisation du contenu, recommandé)
   - Sélectionnez le fournisseur de modèle (comme DeepSeek, Kimi, etc.)
   - Entrez la clé API correspondante
   - Cliquez sur le bouton "🔗 Tester la connexion" pour vérifier la configuration
3. **Configurez l'API d'analyse de CV** (pour analyser les CV au format PDF/DOCX)
   - Achetez le service d'analyse de CV sur [Marketplace Alibaba Cloud](https://market.aliyun.com/detail/cmapi034316)
   - Entrez l'URL de l'API et le APP Code

### Étape 2 : Remplir ou importer le CV

#### Méthode A : Téléchargement et analyse intelligente

1. Dans l'onglet "📝 Remplir CV", trouvez la zone de téléchargement en haut
2. Glissez-déposez le fichier de CV ou cliquez pour sélectionner un fichier
3. Attendez la fin de l'analyse, cliquez sur le bouton "Utiliser les données d'analyse"
4. Les informations du CV seront automatiquement remplies dans le formulaire

#### Méthode B : Remplissage manuel

1. Remplissez directement les informations dans le formulaire
2. Cliquez sur le bouton "+ Ajouter" pour ajouter plusieurs expériences
3. Les données seront sauvegardées automatiquement, ou vous pouvez cliquer sur le bouton "💾 Sauvegarder" pour sauvegarder manuellement

#### Méthode C : Importer un fichier JSON

1. Si vous avez un fichier JSON exporté précédemment
2. Glissez-le directement dans la zone de téléchargement pour l'importer

### Étape 3 : Optimiser le CV avec l'IA (optionnel)

1. Assurez-vous d'avoir configuré la clé API du modèle AI
2. Remplissez le contenu descriptif du CV (présentation personnelle, descriptions des tâches, descriptions des projets, etc.)
3. Cliquez sur le bouton "✨ Optimiser avec IA"
4. Le système optimisera un par un tous les contenus descriptifs
5. Une fois l'optimisation terminée, les contenus seront automatiquement remplis dans le formulaire

### Étape 4 : Remplir le CV sur le site de recrutement

#### Pré-remplissage en un clic (recommandé)

1. Ouvrez la page de remplissage de CV du site de recrutement cible
2. Cliquez sur l'icône de l'extension pour ouvrir la fenêtre contextuelle
3. Cliquez sur le bouton "📋 Pré-remplir"
4. L'extension reconnaîtra et remplira automatiquement les champs du formulaire
5. Après le remplissage, les détails du remplissage seront affichés

#### Remplissage précis au niveau des champs

1. Trouvez le champ à remplir, cliquez sur le bouton "↗" à côté
2. La fenêtre contextuelle se fermera automatiquement, et la page entrera en "mode de remplissage par pointage"
3. Cliquez sur la zone de saisie cible dans la page web
4. La valeur du champ sera insérée avec précision
5. Appuyez sur `Esc` pour annuler l'opération

### Étape 5 : Exporter et sauvegarder

1. Cliquez sur le bouton "📤 Exporter"
2. Sélectionnez le format d'exportation :
   - **JSON** : Pour la sauvegarde et l'importation des données
   - **LaTeX** : Génère un document de CV professionnel, pouvant être édité et imprimé sur Overleaf
   - **🤖 Génération d'introduction de CV par IA** : Appelle l'IA pour générer une présentation professionnelle intelligente
     - Une fois généré, vous pouvez le copier, l'insérer dans l'auto-description ou le télécharger en fichier TXT
   - **Prompts pour introduction de CV** : Exportez des prompts structurés pour interagir avec l'IA (prise en charge de `.md`/`.txt`), le nom du fichier est automatiquement nommé "Nom de l'utilisateur_Prompts_CV_Date"

## 🌐 Sites de recrutement pris en charge

Cette extension utilise une technologie de reconnaissance de formulaires générique et est théoriquement compatible avec tous les sites de recrutement, y compris mais sans s'y limiter :

- ✅ Zhilian (zhaopin.com)
- ✅ 51job (51job.com)
- ✅ Liepin (liepin.com)
- ✅ Boss Zhipin (zhipin.com)
- ✅ Lagou (lagou.com)
- ✅ Maimai (maimai.cn)
- ✅ Shixiseng (shixiseng.com)
- ✅ Nowcoder (nowcoder.com)
- ✅ Pages de recrutement officielles de grandes entreprises comme ByteDance

> 💡 Astuce : Si le formulaire d'un certain site ne peut pas être reconnu automatiquement, vous pouvez utiliser la fonctionnalité de "remplissage précis au niveau des champs" pour spécifier manuellement l'emplacement du remplissage.

## 🛠️ Stack technologique

- **Framework frontend** : JavaScript natif (ES6+)
- **Standard d'extension** : Chrome Extensions Manifest V3
- **Solution de stockage** : Chrome Storage API + localStorage
- **Solution de style** : CSS natif (variables CSS, Flexbox, Grid)
- **Format de document** : LaTeX (prise en charge du chinois avec ctex)
- **Intégration API** :
  - API d'analyse de CV Alibaba Cloud
  - API de grands modèles compatibles avec OpenAI (DeepSeek, Doubao (Volcano Engine), Tongyi Qianwen, etc.)

## ⚠️ Notes importantes

1. **Configuration API** : La fonctionnalité d'analyse de CV nécessite la configuration d'une API, sinon seule l'import JSON est disponible
2. **Optimisation AI** : Nécessite la configuration de la clé API du modèle AI pour utiliser la fonctionnalité d'optimisation
3. **Compatibilité des sites** : Certains sites peuvent utiliser des composants de formulaire spéciaux, il est recommandé d'utiliser le remplissage au niveau des champs
4. **Sécurité des données** : Toutes les données sont stockées uniquement localement dans le navigateur, elles ne sont pas téléchargées sur aucun serveur
5. **Autorisations du navigateur** : L'extension a besoin des autorisations `activeTab`, `scripting`, `storage` pour fonctionner correctement
6. **Pages spéciales** : Les pages système telles que `chrome://`, `edge://`, `about:` ne prennent pas en charge l'injection de scripts de contenu

## 📋 Journal des mises à jour

### v1.0 (version actuelle)

## 📄 Licence open source

Ce projet est sous licence [MIT License](LICENSE).

## 🤝 Contributions et retours

Les Issues et Pull Requests sont les bienvenues !

- 🐛 Avez-vous découvert un bug ? Veuillez soumettre une [Issue](https://github.com/itxaiohanglover/offer-laolao-plugin/issues)
- 💡 Une nouvelle idée ? N'hésitez pas à soumettre une [Feature Request](https://github.com/itxaiohanglover/offer-laolao-plugin/issues)
- 🔧 Vous souhaitez contribuer au code ? N'hésitez pas à soumettre une [Pull Request](https://github.com/itxaiohanglover/offer-laolao-plugin/pulls)

---

<p align="center">
  <strong>Rendez votre recherche d'emploi plus facile ✨</strong>
</p>