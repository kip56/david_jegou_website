# Etiomedecine en Bretagne

Site vitrine Jekyll pour le cabinet d'etiomedecine.

## Lancer le projet en local

Installer les dependances Ruby si necessaire :

```bash
bundle install
```

Lancer le serveur local :

```bash
bundle exec jekyll serve
```

Le site est ensuite disponible par defaut sur :

```text
http://127.0.0.1:4000
```

Si le port 4000 est deja utilise :

```bash
bundle exec jekyll serve --port 4001
```

## Build

Generer le site statique :

```bash
bundle exec jekyll build
```

Le dossier `_site/` est genere automatiquement et ne doit pas etre committe.

## Optimiser les images

Les WebP dans `assets/images/optimized/` sont conservés dans Git pour que toute
l'équipe dispose des images du site. La plus grande version de chaque image
sert de référence au script :

- `pouls-2200.webp`
- `david-1122.webp`
- `sarah-756.webp`
- `nantes-1448.webp`
- `crach-1448.webp`
- `ploemel-1870.webp`
- `moebius-288.webp`

Le script n'utilise plus les PNG HD et ne réécrit jamais ces références, même
avec `--force`. Il génère les petites tailles directement depuis les références,
ce qui évite d'accumuler les recompressions d'un lancement à l'autre.

Installer [cwebp](https://developers.google.com/speed/webp/docs/precompiled), puis
lancer cette commande pour générer uniquement les variantes manquantes :

```bash
bash scripts/optimize-images.sh
```

Après avoir remplacé une image de référence, régénérer les petites tailles :

```bash
bash scripts/optimize-images.sh --force
```

Si cwebp n'est pas dans le PATH, préfixer la commande avec
`CWEBP_BIN=/chemin/vers/cwebp`.

Les proportions et la transparence du logo sont conservées. Une petite variante
issue d'une photo WebP subit une nouvelle compression avec perte ; pour une
future retouche importante, garder si possible une archive HD à part. Les
variantes déjà présentes ne sont pas recompressées par la commande par défaut.

Si les dimensions d'une référence changent, adapter son nom, les largeurs du
script, les descripteurs `srcset` et les attributs `width`/`height` du HTML.
Versionner les références et leurs variantes ensemble. La compilation Jekyll
utilise les fichiers existants et ne nécessite pas cwebp.

Les attributs `sizes` tiennent compte de l'affichage et du recadrage CSS :
le hero et la photo panoramique de Ploemel ont besoin d'une source plus large
que leur cadre pour rester nets avec `object-fit: cover`. Le hero est prioritaire ;
les photos hors écran et celles des modales sont chargées à la demande.
