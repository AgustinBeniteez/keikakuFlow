# Sistema de Traducciones (i18n) - Frontend

Documentación básica sobre cómo están implementadas las traducciones en el cliente Angular de KeikakuFlow usando `@ngx-translate/core`.

---

## 1. Dependencias instaladas

En `frontend/package.json`:

- `@ngx-translate/core`: núcleo del sistema de traducciones y pipe `translate`.
- `@ngx-translate/http-loader`: carga los archivos JSON de idioma bajo demanda mediante `HttpClient`.

---

## 2. Estructura de archivos

```text
frontend/
├── public/assets/i18n/
│   ├── es.json                               # Español (idioma por defecto y fallback)
│   ├── en.json                               # Inglés
│   └── ja.json                               # Japonés
└── src/app/
    ├── app.config.ts                         # Configuración global del proveedor
    ├── app.ts                                # Inicialización de LanguageService
    └── core/services/language.service.ts     # Gestión del idioma activo y persistencia
```

---

## 3. Configuración global

En `frontend/src/app/app.config.ts` se registra `provideHttpClient()` junto a `provideTranslateService`:

```ts
provideHttpClient(),
provideTranslateService({
  lang: 'es',
  fallbackLang: 'es',
  langs: ['es', 'en', 'ja'],
  loader: provideTranslateHttpLoader({
    prefix: 'assets/i18n/',
    suffix: '.json',
  }),
}),
```

- `lang`: idioma inicial por defecto.
- `fallbackLang`: si una clave no existe en el idioma seleccionado, se muestra su valor en español.
- `prefix` y `suffix`: ruta desde donde se cargan los archivos (`assets/i18n/{código}.json`).

`LanguageService` (inyectado en `App`) se encarga al arrancar de:

1. Leer el idioma guardado en `localStorage` bajo la clave `keikakuflow_lang`.
2. Si no hay ninguno guardado, comprobar el idioma del navegador (`navigator.language`).
3. Si tampoco coincide con los soportados, usar `es`.
4. Actualizar el atributo `lang` de la etiqueta `<html>`.

---

## 4. Cómo añadir nuevos textos

Las claves se organizan por secciones dentro de los archivos JSON (`es.json`, `en.json`, `ja.json`), manteniendo siempre la misma estructura en todos los idiomas.

Ejemplo en `es.json`:

```json
{
  "nav": {
    "home": "Inicio",
    "newProject": "Nuevo proyecto"
  },
  "workspace": {
    "welcome": "Hola, {{ name }}"
  }
}
```

Ejemplo en `en.json`:

```json
{
  "nav": {
    "home": "Home",
    "newProject": "New project"
  },
  "workspace": {
    "welcome": "Hello, {{ name }}"
  }
}
```

---

## 5. Cómo usar traducciones en un componente

### En la plantilla HTML

1. Importa `TranslatePipe` en el componente standalone:

```ts
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'kf-ejemplo',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './ejemplo.component.html',
})
export class EjemploComponent {}
```

2. Usa el pipe `translate` en el HTML:

```html
<!-- Texto normal -->
<span>{{ 'nav.home' | translate }}</span>

<!-- Atributos y placeholders -->
<input
  [placeholder]="'nav.searchPlaceholder' | translate"
  [attr.aria-label]="'nav.searchAria' | translate"
/>

<!-- Con variables dinámicas -->
<p>{{ 'workspace.welcome' | translate:{ name: userName() } }}</p>
```

### Desde código TypeScript

Si necesitas una traducción en una clase o servicio:

```ts
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

private readonly translate = inject(TranslateService);

// Lectura reactiva como Signal (recomendado)
readonly titulo = this.translate.translate('nav.home');

// Lectura puntual
const texto = this.translate.instant('nav.newProject');
```

---

## 6. Cómo cambiar de idioma

Inyecta `LanguageService` y llama a `setLanguage(...)`:

```ts
private readonly languageService = inject(LanguageService);

cambiarIdioma(): void {
  this.languageService.setLanguage('en');
}
```

El cambio se aplica al instante en toda la aplicación sin recargar la página y queda guardado en `localStorage`.

---

## 7. Cómo añadir o sustituir un idioma

Para agregar un idioma nuevo (por ejemplo francés, `fr`):

1. Crear el archivo `frontend/public/assets/i18n/fr.json` copiando la estructura de `es.json`.
2. Añadir `'fr'` al array `langs` en `frontend/src/app/app.config.ts`.
3. En `frontend/src/app/core/services/language.service.ts`:
   - Añadir `'fr'` al tipo `AppLanguage`.
   - Añadir `{ code: 'fr', label: 'Français', short: 'FR' }` a `SUPPORTED_LANGUAGES`.
   - Incluir `'fr'` en el método `isSupported(...)`.
