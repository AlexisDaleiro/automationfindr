# AutomationFindr: próxima build

Documento para retomar el trabajo en una sesión nueva sin cargar el historial.

## Estado actual

Sitio estático multipágina, HTML/CSS/JS vanilla, sin build step. Solo depende de Google Fonts (Instrument Serif, Geist, Geist Mono).

| Archivo | Qué es |
|---|---|
| `index.html` | Home: hero con buscador real, category river, editor's picks, how it works, stats, fresh finds, use cases, newsletter |
| `tool.html` | Detalle de tool, `?id=n8n`. Tabs Overview, Features, Pricing, Reviews, Alternatives. Carrusel de similares. 404 si el id no existe |
| `compare.html` | `?tools=n8n,make,zapier`. Hasta 3 tools, reordenar filas, "differences only", copiar link |
| `category.html` | `?c=workflow` o todas. Filtros, búsqueda, orden, vista grid/list, Load more, FLIP |
| `shared.css` | Tokens, base, nav, footer, componentes comunes (`.tcard`, `.chip`, `.btn`, `.stars`, `.lg`) |
| `shared.js` | Datos mock (`CATS`, `T`, `FEAT`), helpers, `AF.rank()` (búsqueda), `AF.card()`, y el chrome (header, drawer, footer, toast, cursor). Expone `window.AF` |
| `.claude/launch.json` | Config del preview: `python -m http.server 5173` |

### Cómo correrlo

Hay que servirlo por HTTP. Abrir los archivos con `file://` o en una vista `data:` rompe los assets relativos.

```bash
python -m http.server 5173
```

Luego abrir `http://localhost:5173/index.html`.

### Decisiones de diseño a respetar

- Paleta: off-white `#FAFAF8`, sand `#F2F0EB`, ink `#1A1A1A`, teal `#0F766E` para texto y botones (pasa AA; el `#0D9488` solo para rellenos), ámbar `#D97706` para acentos.
- Tipografía: Instrument Serif para titulares, Geist para UI, Geist Mono para datos.
- Easing principal `cubic-bezier(0.16, 1, 0.3, 1)`. Animaciones entre 200 y 500 ms. `prefers-reduced-motion` respetado en todo.
- Sin eyebrows en mayúsculas, sin gradientes decorativos, sin "Unlock the power of...".
- Los links pendientes usan `href="#"`. `shared.js` los intercepta y muestra el toast "That page is part of the next build." Cuando exista la página real, solo hay que cambiar el href.

### Trampas conocidas

- Los keyframes que terminan con `forwards` sobre un elemento con `opacity:0` base necesitan un `to` explícito. Si no, la animación termina en opacity 0. Ya pasó una vez en los demos de how it works.
- Una grilla de una columna debe ser `minmax(0,1fr)`, no `1fr`. Con `1fr` un hijo con `overflow-x:auto` ensancha la página en mobile.
- El panel de preview oculto pausa las animaciones. Para verificar el estado final hay que forzarlas con `document.getAnimations()`.
- En este entorno, el hook GateGuard pide hechos antes de la primera escritura de cada archivo nuevo. Hay que explicar llamadores, datos e instrucción, y reintentar.

---

## 1. Datos reales (bloquea todo lo demás)

**Hecho (2026-10-31):** los 26 tools viven en `data/tools.json` y `shared.js` los carga (`AF.ready`). Cada tool tiene `url` y `pricing {tiers, verified, src, note}`. 20 de 26 verificados contra la página del vendor; sin verificar: make, relay, gumloop, woodpecker, argocd, dext (`verified: null`, la página los marca). Home sin números inventados.
**Falta:** features, ratings y reviews siguen mock (notas "Illustrative" en la pestaña Features); logos, screenshots, fecha de alta real (`a`), CMS.

Hoy los 26 tools son un array mock dentro de `shared.js`. Las features, precios, reviews y screenshots están generados y las páginas lo avisan.

- Reemplazar el array por datos reales, primero en un JSON y luego en un CMS (Sanity, según el brief).
- Definir el esquema por tool. Campos actuales: `id, n, l, c, cat, r, rv, p, tg, d, k, a` más los de detalle `f, fl, dm, ps, best, not, love, gripe, uniq, int`. Falta: URL oficial, URL de logo, URL de screenshots, fecha de alta real (hoy `a` es "días desde que se agregó"), tiers de precio reales.
- Logos reales en lugar de monogramas.
- Screenshots reales en lugar de las ilustraciones SVG.
- Precios, features y reviews verificados contra cada vendor.
- Quitar las notas "Illustrative" y "mock" de las páginas cuando los datos sean reales.
- Quitar los números inventados del home: "2,412 tools", "12,000+ searches a month", "184 people searching", "updated 3 hours ago", y el testimonio placeholder.

## 2. Acciones con efecto

**Hecho (2026-10-31), falta conectar el backend:**
- "Visit website" usa `t.url` real (venía del punto 1).
- Newsletter, "Submit a tool" (`submit.html`) y "Write a review" (pestaña Reviews) envían por `AF.submitForm(kind, form)` a un endpoint estilo Formspree (JSON POST). Los tres endpoints están vacíos en `ENDPOINTS` de `shared.js`. Mientras estén vacíos, el formulario muestra "This form isn't connected yet. Nothing was sent." en vez de simular éxito. Pegar las tres URLs y quedan activos. Honeypot `_gotcha` en los tres.
- Página `saved.html` con quitar y "Compare" (hasta 3). Helpers `AF.saved/isSaved/toggleSaved`. Link "Saved" en menú, drawer y footer.
- Reviews enviadas: se guardan en `localStorage` (`af:review:<id>`) y se muestran solo al autor con la etiqueta "Pending review". La moderación es manual: llegan al correo del endpoint y alguien las publica. La pestaña avisa que las reviews listadas son muestras ilustrativas.

**Falta:**
- Elegir y crear el servicio de formularios (o backend propio) y pegar las URLs.
- Badge "verified" real: exige verificar la cuenta o el correo del autor, no se puede sin backend. Las reviews nuevas nunca lo llevan.
- Publicar reviews aprobadas: hoy habría que agregarlas a mano a los datos. Con CMS (punto 1) o backend propio sale solo.
- Newsletter: el envío semanal en sí (proveedor de email, doble opt-in).
- Guardados sincronizados entre dispositivos: hoy son por navegador, requiere cuentas.

## 3. Páginas que faltan

**Hecho (2026-10-31):** todas las páginas existen y ya no quedan `href="#"` en el contenido (solo los íconos sociales del footer, que esperan cuentas reales).

| Página | Cómo funciona |
|---|---|
| `collections.html` | Lista, o `?c=slug` para una colección. Se definen en el script de la página: 6 por regla sobre los datos (free-to-start, self-hosted, open-source, sso, under-30, new-arrivals) y 2 con ids a mano (outbound-stack, data-team). Las de regla crecen solas |
| `articles.html` | `?k=guides` o `?k=blog`, y `&s=slug` para un artículo. El contenido vive en `data/articles.json` (bloques: string = párrafo, `{h}`, `{ul}`, `{ol}`; links `[texto](url-relativa)`). 4 guías y 2 posts |
| `switch.html` | `?from=zapier&to=n8n`. Se genera desde `tools.json` (precio, plataformas, integraciones, notas) más un checklist de migración. Sin parámetros válidos muestra un selector. Lo enlaza la pestaña Alternatives de `tool.html` |
| `about.html`, `contact.html`, `privacy.html`, `terms.html` | Contact envía por `AF.submitForm('contact', form)`; `ENDPOINTS.contact` está vacío, igual que los otros tres |
| `api.html` | Documenta `data/tools.json` como el único "endpoint": campos, ejemplo, botón para probarlo |
| `changelog.html` | A mano, tres entradas |
| `404.html` | Mini-juego: reparar el paso 3 del flujo. Usa `<base href="/">` (asume el sitio en la raíz del dominio) |

**Falta:**
- Pegar la URL del endpoint de Contact en `ENDPOINTS.contact` (junto a las otras tres).
- Privacy y Terms son borradores honestos sobre lo que hace el sitio hoy, no asesoría legal. Falta que alguien los revise, y completarlos con el nombre legal del responsable y un correo, que no sé cuáles son.
- Los textos de guías y blog son míos y generales. Conviene que alguien los lea antes de publicar.
- `python -m http.server` no sirve `404.html` en URLs desconocidas; solo se ve entrando a `/404.html`. GitHub Pages, Netlify y Vercel sí lo sirven solos.
- Las colecciones no usan ratings (son ilustrativos). Cuando haya ratings reales, se puede sumar "mejor valoradas".
- Las cuentas sociales del footer siguen en `href="#"`.

## 4. Búsqueda y navegación real

**Hecho (2026-10-31):**
- **48 categorías.** Son las 9 de siempre (grupos) más 39 subcategorías definidas en `shared.js` (`[clave, nombre, grupo, descripción]`). Cada tool conserva `cat` (su grupo) y suma `sub: [...]` en `data/tools.json` (documentado en `api.html`). `AF.inCat(t,k)` decide la pertenencia; `AF.GROUPS` son los 9 de primer nivel. `category.html?c=<clave>` sirve cualquiera de las 48: miga al grupo, segunda fila de chips con las subcategorías y un directorio agrupado en `category.html#categories` al que apuntan la card "All 48 categories" del home, el menú, el drawer y el footer. Las categorías sin tools (hoy 15 de 39) muestran "No tools in X yet" con botón a Submit. Las pills de la página de cada tool incluyen sus subcategorías, y el select de `submit.html` usa `optgroup`.
- **Búsqueda.** `AF.rank` ahora tolera typos (distancia de edición con transposiciones: 1 error hasta 6 letras, 2 desde 7), busca también en las subcategorías y suma un bonus si coinciden todas las palabras. `AF.rankCats` devuelve categorías por nombre; el buscador del home las muestra tras las tools ("Category, 3 tools"). Compare y category usan el mismo `rank`.
- **Transiciones entre páginas.** Fade out de 200 ms al salir (`shared.js` agrega `.leaving` y navega) y fade in de 300 ms al entrar (`pageIn` en `shared.css`). Solo mueven `main` y el footer; el header queda fijo. Se saltan con `prefers-reduced-motion`, Ctrl/Cmd/Shift-clic, `target`, `download` y los cambios de solo hash.
- **Drag and drop en compare.** Debajo de la tabla hay una bandeja con 6 tools sugeridas: se arrastran sobre la tabla (los slots vacíos se resaltan) o se agregan con clic o Enter. El texto del slot dice "Click + or drop a tool here". En pantallas táctiles no hay arrastre nativo; ahí sirve el clic.

**Falta:**
- Motor de búsqueda externo (Algolia, Meilisearch o Typesense). Necesita cuenta o servidor y una clave, así que no se pudo cablear. El índice en cliente alcanza para cientos de tools; si el catálogo pasa de unos pocos miles, reemplazar el cuerpo de `rank` y `rankCats` en `shared.js` (todos los buscadores del sitio pasan por ahí).
- Cargar tools en las 15 subcategorías vacías: forms, scheduling, llmops, docai, voice, newsletter, transactional, support, proposals, monitoring, spreadsheets, bi, seo, ads, payments. Cada una se llena sumando su clave al `sub` del tool en `tools.json`.
- Las subcategorías heredan color e ícono del grupo; si se quieren propios, agregarlos en la tabla de `shared.js`.
- El fade out solo corre al hacer clic en un link; el fade in corre en toda carga, incluida la recarga.

## 5. Producción

- Migrar a Next.js o Astro para SSR, SEO y metadatos por tool (hoy el título se pone en cliente).
- Analytics con Plausible o Fathom.
- Lighthouse real. Metas del brief: Performance mayor a 95, FCP menor a 1.2 s, LCP menor a 2.5 s, CLS menor a 0.1, JS menor a 100 KB gzip.
- Modo oscuro (opcional en el brief).
- Pruebas en dispositivos reales y revisión a 768 px de `tool.html`, `compare.html` y `category.html`. Solo se verificó overflow a 375 px y desktop.
- Revisar accesibilidad con lector de pantalla: tabs, combobox de búsqueda, picker de compare, hoja de filtros mobile.

## Orden sugerido

1. Esquema de datos y migración de los 26 tools a JSON.
2. Reemplazar `shared.js` para que cargue ese JSON.
3. Páginas faltantes y acciones con efecto (puntos 2 y 3).
4. Búsqueda real y las 48 categorías.
5. Migración a framework y optimización.
