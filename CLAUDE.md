# Nexum Finanzas Personales — Frontend

Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui. Se comunica con el
API mediante Server Actions (`app/actions/*`, axios en `app/actions/baseAxios.ts`).

## Estructura

- `app/dashboard/<módulo>/` — páginas por módulo (accounts, categories,
  transactions, transfers, monthly-periods, admin…), con su `components/`.
- `app/actions/<módulo>/` — Server Actions hacia el API.
- `components/ui/` — componentes shadcn.
- `utils/env.ts` — variables de entorno.
- i18n: textos vía `t("…")`; no hardcodear strings en la UI.

## Convenciones

- Tablas paginadas: estado en query params (`page`, búsqueda, orden) y control
  `Anterior / Página X de Y / Siguiente` (`pagination.pageOf`), como en
  `transfers-table.tsx`.
- Ramas `feat/…` / `fix/…` desde `origin/main`; commits conventional commits.
- Props de componentes como `Readonly<{…}>` (SonarQube S6759).
- La versión de `package.json` es la que muestra el panel (`utils/app-version.ts`).
  Las PRs de funcionalidad no la tocan: se sube en una sola PR por tanda,
  mergeada al final.

## Validación

```bash
pre-commit run --from-ref origin/main --to-ref HEAD   # prettier, eslint, tsc
yarn test:coverage                                    # vitest
yarn lint
npx tsc --noEmit
yarn build
SONAR_PROJECT_VERSION=<versión>-<rama> scripts/sonar-scan.sh   # en un clon, no en el árbol de trabajo
```

El gate de SonarQube (`Strict New Code`) evalúa solo el código nuevo. Los
Server Components se testean con `render(await Page({ params }))` mockeando
`@/app/actions/auth/getSession`.

## graphify

If `graphify-out/graph.json` exists, answer architecture/codebase questions from
the graph before broad file reads:

```bash
graphify query "<question>"
```

After changing code in this repo:

```bash
graphify update .
```
