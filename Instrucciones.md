# 📘 Normas técnicas del proyecto

Para que no tengamos caos y el proyecto sea limpio, trabajaremos así:

---

## 1️⃣ Metodología

Usaremos una estructura tipo **BEM simplificada**:

- **Bloque** → `.card`  
- **Elemento** → `.card__title`  
- **Modificador** (solo si hace falta) → `.card--highlight`  

⚠️ **Importante:**  
No vamos a crear clases innecesarias.  
Solo las justas para estructurar bien.  

❌ No usar clases tipo:  
`.rojo`, `.grande`, `.caja1`

---

## 2️⃣ Variables CSS obligatorias

Todo irá con variables en `:root`.

❗ No se ponen colores directos.  
Siempre usar `var()`.

Luego solo cambiaremos las variables y listo.

---

## 3️⃣ Clases e ID

- **Clases** → para estilos  
- **ID** → solo para anclas o JavaScript  

❌ No usar ID para CSS.

---

## 4️⃣ Estructura limpia

- Evitar selectores largos tipo `header nav ul li a`  
- Preferir clases claras y simples  
- No crear demasiadas clases por sección  

Menos clases, pero bien pensadas.

---

## 5️⃣ Responsive

Trabajaremos **mobile first**:

- Primero móvil → luego tablet y desktop

---

## 6️⃣ Git

- Cada uno trabaja en su **rama**  
- Nada directo en `main`  
- Todo subido cada día

---

## 7️⃣ Objetivo

Código limpio, coherente y fácil de modificar.  
**Primero funcional. Luego bonito.**