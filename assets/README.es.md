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

# 🚀 Offer Laolao - Asistente inteligente de llenado automático de currículums para navegador

> Una potente extensión para navegador Chrome que admite el doble modo de análisis inteligente de currículums y llenado manual, con funciones de **coincidencia inteligente de campos con IA** y **llenado preciso a nivel de campo**, ayudando a los solicitantes de empleo a completar sus currículums rápidamente y con precisión en los principales sitios web de reclutamiento.

![Version](https://img.shields.io/badge/Version-1.0-blue)
![Chrome](https://img.shields.io/badge/Chrome-Extension-green)
![Manifest](https://img.shields.io/badge/Manifest-V3-orange)

🌐 **Acceso en línea**：[https://offer-laolao-plugin.vercel.app](https://offer-laolao-plugin.vercel.app)

## ✨ Características funcionales principales

### 📄 Análisis inteligente de currículums

- **Soporte para múltiples formatos**：Admite los formatos de currículum más comunes como PDF, DOCX, DOC, TXT, JSON
- **Análisis API en la nube**：Integra la API de análisis de currículums del mercado Alibaba Cloud para extraer información del currículum con precisión
- **Importación directa de JSON**：Admite la importación directa de datos de currículum en formato JSON para realizar copias de seguridad y restauración de datos
- **Carga por arrastrar y soltar**：Admite la carga de archivos por arrastrar y soltar para una operación conveniente
- **Asignación inteligente de campos**：Asigna automáticamente los resultados del análisis a los campos de formulario correspondientes

### 📝 Gestión completa de la información del currículum

Admite el llenado y gestión de los siguientes módulos de currículum：

| Módulo              | Campos incluidos                                                                     |
| ----------------- | ---------------------------------------------------------------------------- |
| **Información básica**      | Nombre, Género, Fecha de nacimiento, Número de teléfono móvil, Email, Número de identificación, Ubicación, Orientación política         |
| **Expectativas laborales**      | Puesto deseado, Industria deseada, Salario deseado, Ubicación deseada, Duración de la pasantía, Horario de trabajo posible                 |
| **Experiencia educativa**      | Nombre de la escuela, Especialidad, Nivel educativo (Técnico/Licenciatura/Maestría/Doctorado), Clasificación, Fechas de ingreso/egreso (soporte para múltiples entradas) |
| **Experiencia laboral/pasantía** | Nombre de la empresa, Cargo, Fechas de inicio/fin, Descripción del trabajo (soporte para múltiples entradas)                          |
| **Experiencia en proyectos**      | Nombre del proyecto, Rol, Duración del proyecto, Descripción del proyecto, Descripción de responsabilidades (soporte para múltiples entradas)                 |
| **Información de habilidades**      | Nombre de la habilidad, Nivel de habilidad (Principiante/Intermedio/Avanzado/Experto) (soporte para múltiples entradas)                        |
| **Habilidades lingüísticas**      | Nombre del idioma, Nivel de dominio (Principiante/Básico/Competente/Fluido), Certificados lingüísticos (soporte para múltiples entradas)              |
| **Campos personalizados**    | Nombres y contenido de campos personalizados (soporte para múltiples entradas)                                             |
| **Autodescripción**      | Demostración de fortalezas y características personales                                                           |

### 🎯 Llenado inteligente de formularios

#### Función de prellenado con un solo clic

- Haga clic en el botón "📋 Prellenar" para llenar automáticamente los datos del currículum en el formulario del sitio web de reclutamiento actual
- Reconocimiento inteligente de campos de formulario, coincidencia automática con la información del currículum correspondiente
- Admite diversos elementos de formulario como input, textarea, select, contenteditable
- Dispara automáticamente eventos de formulario (input, change, blur) para garantizar que la validación del sitio web pase
- Proporciona retroalimentación visual después del llenado, resaltando los campos llenados

#### Llenado preciso a nivel de campo（↗ Llenado por puntero）

- Cada campo tiene un botón "↗" para el **llenado preciso de un solo campo**
- Al hacer clic en el botón, ingresa al "modo de llenado por puntero"：
  - Se muestra una guía de operación en la parte superior de la página
  - Cuando el mouse se coloca sobre un elemento que se puede llenar, se resalta con un borde azul
  - Haga clic en el cuadro de entrada objetivo para ingresar el valor del campo
  - Presione la tecla `Esc` para cancelar la operación
- Admite llenado en elementos input, textarea, select, contenteditable
- Dispara automáticamente eventos de formulario (input, change, blur) para garantizar que la validación del sitio web pase
- Cierra automáticamente la ventana emergente después de un llenado exitoso, facilitando operaciones consecutivas

### 🤖 Integración con grandes modelos de IA

Admite varios proveedores de servicios de grandes modelos chinos para la optimización inteligente del contenido del currículum y la coincidencia de campos：

| Proveedor de servicios                | Modelos admitidos                                               |
| --------------------- | ------------------------------------------------------ |
| **DeepSeek**          | DeepSeek Chat、DeepSeek Coder                          |
| **Kimi (Moonshot)**   | Moonshot 8K/32K/128K                                   |
| **Tongyi Qianwen (Alibaba Cloud)** | Qwen Turbo/Plus/Max/Max Texto largo                         |
| **Volcano Engine (Doubao)**   | Doubao Seed 1.6、Doubao Seed 1.6 Lite、Doubao Seed 1.6 Flash |
| **Zhipu AI**           | GLM-4、GLM-4 Flash、GLM-3 Turbo                        |
| **Baichuan Intelligence**          | Baichuan 2 Turbo、Baichuan 2 Turbo 192K                        |
| **Personalizado**            | Admite cualquier API compatible con OpenAI                         |

**Características funcionales de IA**：

- Prueba de conexión API con un solo clic
- **✨ Optimización de currículum con IA en un solo clic**：Optimiza inteligente la presentación personal, la descripción del trabajo, la descripción del proyecto, etc.
- **🤖 Generación de introducción de currículum por IA**：Genera inteligente una presentación profesional basada en los datos del currículum (200-300 caracteres)
  - Admite copiar al portapapeles, llenar el campo de autodescripción, descargar como archivo TXT
- Optimiza las descripciones de trabajo y proyecto según el método STAR
- Agrega automáticamente datos cuantitativos y descripciones de resultados

### 📤 Exportación en múltiples formatos

- **Exportación JSON**：Exporta los datos completos del currículum para copias de seguridad y sincronización entre dispositivos
- **Exportación LaTeX**：Genera plantillas profesionales de currículum en LaTeX
  - Se puede compilar directamente en [Overleaf](https://www.overleaf.com/)
  - Soporte para chino (utilizando el paquete ctex)
  - Tipografía profesional, adecuada para solicitudes académicas y técnicas
  - Incluye definiciones completas de estilos y comentarios
- **🤖 Generación de introducción de currículum por IA**：Llama a modelos de IA para generar inteligente una presentación profesional
  - Generado en base al historial educativo, experiencia laboral, experiencia en proyectos y habilidades del currículum
  - Admite copiar al portapapeles
  - Admite llenado en un solo clic del campo de autodescripción
  - Admite descarga como archivo `.txt`
- **Exportación de prompts para introducción de currículum**：Exporta plantillas de prompts estructuradas, admitiendo `.md`/`.txt`
  - Incluye prompts para información básica personal
  - Plantillas de preguntas sobre experiencia laboral
  - Marco de preguntas sobre experiencia en proyectos
  - Palabras guía para evaluación de habilidades

### 💾 Persistencia de datos

- **Chrome Storage API**：Utiliza el almacenamiento nativo del navegador, los datos son seguros y confiables
- **Guardado automático en tiempo real**：Guarda automáticamente cuando el contenido del formulario cambia, evitando la pérdida de datos
- **Guardado manual**：Admite hacer clic manualmente en el botón de guardar para confirmar el guardado
- **Restablecimiento de datos**：Borra con un solo clic todos los datos del currículum para comenzar de nuevo
- **Guardado automático de configuración**：Las configuraciones de la página de configuración se guardan automáticamente

## 🏗️ Arquitectura del proyecto

```
super_resume/
├── docs                       # Páginas de introducción
├── manifest.json              # Archivo de configuración de extensión Chrome (Manifest V3)
├── icons/                     # Iconos de extensión
├── src/
│   ├── background/            # Scripts de servicio en segundo plano
│   ├── content/               # Scripts de contenido (inyectados en páginas web)
│   └── popup/                 # Páginas emergentes
└── README.md
```

## 📦 Guía de instalación

### Método 1：Instalación en modo desarrollador

1. **Descarga el proyecto**

   ```bash
   git clone https://github.com/itxaiohanglover/offer-laolao-plugin.git
   ```

   O descarga directamente el ZIP y descomprímelo

2. **Abre la página de gestión de extensiones Chrome**

   - Ingresa en la barra de direcciones：`chrome://extensions/`
   - O a través del menú：Más herramientas → Extensiones

3. **Activa el modo desarrollador**

   - Haz clic en el interruptor "Modo desarrollador" en la esquina superior derecha

4. **Carga la extensión**

   - Haz clic en "Cargar extensión descomprimida"
   - Selecciona el directorio raíz del proyecto (carpeta que contiene `manifest.json`)

5. **Instalación completada**
   - El icono de la extensión aparecerá en la barra de herramientas del navegador
   - Haz clic en el icono para abrir el asistente de llenado de currículums

### Método 2：Instalación en navegador Edge

El navegador Edge también admite extensiones Chrome：

1. Abre `edge://extensions/`
2. Activa el "Modo desarrollador"
3. Haz clic en "Cargar extensión descomprimida"
4. Selecciona el directorio del proyecto

## 🚀 Tutorial de uso

### Paso 1：Configura la API (opcional pero recomendado)

1. Haz clic en el icono de la extensión, cambia a la pestaña "⚙️ Configuración"
2. **Configuración del modelo de IA** (para optimización de contenido, recomendado)
   - Selecciona el proveedor del modelo (como DeepSeek, Kimi, etc.)
   - Ingresa la API Key correspondiente
   - Haz clic en el botón "🔗 Probar conexión" para verificar la configuración
3. **Configuración de la API de análisis de currículums** (para analizar currículums en formato PDF/DOCX)
   - Compra el servicio de análisis de currículums en [Marketplace Alibaba Cloud](https://market.aliyun.com/detail/cmapi034316)
   - Ingresa la URL de la API y el Código APP

### Paso 2：Llena o importa el currículum

#### Método A：Carga inteligente y análisis

1. Encuentra el área de carga en la parte superior de la pestaña "📝 Llenado de currículum"
2. Arrastra y suelta el archivo de currículum o haz clic para seleccionar el archivo
3. Espera a que termine el análisis, haz clic en el botón "Usar datos de análisis"
4. La información del currículum se llenará automáticamente en el formulario

#### Método B：Llenado manual

1. Llena directamente toda la información en el formulario
2. Haz clic en el botón "+ Agregar" para agregar múltiples experiencias
3. Los datos se guardarán automáticamente, o puedes hacer clic en el botón "💾 Guardar" para guardar manualmente

#### Método C：Importar JSON

1. Si tienes un archivo JSON exportado previamente
2. Simplemente arrástralo y suéltalo en el área de carga para importarlo

### Paso 3：Optimiza el currículum con IA (opcional)

1. Asegúrate de que la API Key del modelo de IA esté configurada
2. Llena el contenido descriptivo del currículum (presentación personal, descripción del trabajo, descripción del proyecto, etc.)
3. Haz clic en el botón "✨ Optimizar con IA"
4. El sistema optimizará todo el contenido descriptivo uno por uno
5. El contenido optimizado se llenará automáticamente en el formulario

### Paso 4：Llena el currículum en el sitio web de reclutamiento

#### Prellenado en un solo clic (recomendado)

1. Abre la página de llenado de currículum del sitio web de reclutamiento objetivo
2. Haz clic en el icono de la extensión para abrir la ventana emergente
3. Haz clic en el botón "📋 Prellenar"
4. La extensión reconocerá y llenará automáticamente los campos del formulario
5. Después del llenado, se mostrarán los detalles del llenado

#### Llenado preciso a nivel de campo

1. Encuentra el campo que deseas llenar, haz clic en el botón "↗" al lado
2. La ventana emergente se cerrará automáticamente y la página entrará en "modo de llenado por puntero"
3. Haz clic en el cuadro de entrada objetivo en la página web
4. El valor del campo se llenará con precisión
5. Presiona `Esc` para cancelar la operación

### Paso 5：Exportar y hacer copia de seguridad

1. Haz clic en el botón "📤 Exportar"
2. Selecciona el formato de exportación：
   - **JSON**：Para copias de seguridad e importación de datos
   - **LaTeX**：Genera documentos profesionales de currículum que se pueden editar e imprimir en Overleaf
   - **🤖 Generación de introducción de currículum por IA**：Llama a la IA para generar inteligente una presentación profesional
     - Después de generar, puedes copiarla, llenarla en la autodescripción o descargarla como archivo TXT
   - **Prompts para introducción de currículum**：Exporta prompts estructurados para interactuar con IA (admite `.md`/`.txt`), el nombre del archivo se nombra automáticamente como "Nombre de usuario_Prompts_Currículum_Fecha"

## 🌐 Sitios web de reclutamiento admitidos

Esta extensión utiliza tecnología de reconocimiento de formularios universal y teóricamente admite todos los sitios web de reclutamiento, incluyendo pero no limitado a：

- ✅ Zhilian (zhaopin.com)
- ✅ 51job (51job.com)
- ✅ Liepin (liepin.com)
- ✅ Boss Zhipin (zhipin.com)
- ✅ Lagou (lagou.com)
- ✅ Maimai (maimai.cn)
- ✅ Shixiseng (shixiseng.com)
- ✅ Nowcoder (nowcoder.com)
- ✅ Páginas oficiales de reclutamiento de grandes empresas como ByteDance Campus Recruitment

> 💡 Consejo：Si el formulario de un sitio web no se puede reconocer automáticamente, puedes usar la función de "llenado preciso a nivel de campo" para especificar manualmente la ubicación de llenado.

## 🛠️ Pila tecnológica

- **Framework frontend**：JavaScript nativo (ES6+)
- **Estándar de extensión**：Chrome Extensions Manifest V3
- **Solución de almacenamiento**：Chrome Storage API + localStorage
- **Solución de estilo**：CSS nativo (variables CSS, Flexbox, Grid)
- **Formato de documento**：LaTeX (soporte para chino ctex)
- **Integración API**：
  - API de análisis de currículums Alibaba Cloud
  - API de grandes modelos compatibles con OpenAI (DeepSeek, Doubao (Volcano Engine), Tongyi Qianwen, etc.)

## ⚠️ Notas importantes

1. **Configuración de API**：La función de análisis de currículums requiere configuración de API, de lo contrario solo se puede usar la importación JSON
2. **Optimización de IA**：Se requiere configurar la API Key del modelo de IA para usar la función de optimización
3. **Compatibilidad con sitios web**：Algunos sitios web pueden usar componentes de formulario especiales, por lo que se recomienda usar el llenado a nivel de campo
4. **Seguridad de datos**：Todos los datos solo se almacenan localmente en el navegador y no se suben a ningún servidor
5. **Permisos del navegador**：La extensión requiere permisos `activeTab`, `scripting` y `storage` para funcionar correctamente
6. **Páginas especiales**：Las páginas del sistema como `chrome://`, `edge://`, `about:` no admiten la inyección de scripts de contenido

## 📋 Registro de actualizaciones

### v1.0 (versión actual)

## 📄 Licencia de código abierto

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE).

## 🤝 Contribuciones y retroalimentación

¡Se aceptan Issues y Pull Requests！

- 🐛 ¿Encontraste un error？Por favor envía un [Issue](https://github.com/itxaiohanglover/offer-laolao-plugin/issues)
- 💡 ¿Tienes una nueva idea？¡Bienvenido a enviar una [Feature Request](https://github.com/itxaiohanglover/offer-laolao-plugin/issues)
- 🔧 ¿Quieres contribuir con código？¡Bienvenido a enviar un [Pull Request](https://github.com/itxaiohanglover/offer-laolao-plugin/pulls)

---

<p align="center">
  <strong>Haz que la búsqueda de empleo sea más fácil ✨</strong>
</p>