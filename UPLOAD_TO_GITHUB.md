# 🚀 Instrucciones para Subir GameLibrary a GitHub

## 1️⃣ Crear Repositorio en GitHub

1. Entra a [GitHub](https://github.com) y loguéate
2. Haz clic en **"New"** (esquina superior izquierda)
3. Nombre: `GameLibrary`
4. Descripción: `Aplicación Web Full-Stack de Gestión de Biblioteca de Videojuegos`
5. Selecciona **Public** (para que sea visible)
6. **NO** hagas `Initialize with README` (ya lo tienes)
7. Haz clic en **"Create repository"**

---

## 2️⃣ Conectar tu Repositorio Local con GitHub

GitHub te mostrará comandos. Ejecuta estos en tu terminal (en la carpeta GameLibrary):

```bash
git remote add origin https://github.com/TU_USUARIO/GameLibrary.git
git branch -M main
git push -u origin main
```

**Reemplaza `TU_USUARIO` con tu nombre de usuario en GitHub**

---

## 3️⃣ Verificar que se Subió Correctamente

```bash
git remote -v
```

Deberías ver:
```
origin  https://github.com/TU_USUARIO/GameLibrary.git (fetch)
origin  https://github.com/TU_USUARIO/GameLibrary.git (push)
```

---

## ✅ ¡Listo!

Tu proyecto está en GitHub. Ahora puedes:
- Compartir el enlace: `https://github.com/TU_USUARIO/GameLibrary`
- Colaborar con otros
- Hacer seguimiento de cambios

---

## 📝 Otros Comandos Útiles

**Hacer cambios y subirlos:**
```bash
git add .
git commit -m "Descripción del cambio"
git push
```

**Ver el historial de commits:**
```bash
git log --oneline
```

**Ver cambios no commitidos:**
```bash
git status
```

---

## ℹ️ Nota Importante

- **No subas `.env`** (está en .gitignore ✅)
- **No subas `node_modules`** (está en .gitignore ✅)
- El README.md incluye instrucciones de instalación
- La BD se crea con `database.sql`

¡Tu proyecto está 100% listo para compartir! 🎉
