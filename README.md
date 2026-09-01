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
