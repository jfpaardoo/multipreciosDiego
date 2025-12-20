-- =====================================================
-- CONFIGURACIÓN DE STORAGE PARA AVATARES DE USUARIO
-- =====================================================
-- Este script configura el bucket de storage para las fotos de perfil
-- Ejecuta este script en el SQL Editor de Supabase después del schema principal

-- Crear el bucket 'avatars' si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Los usuarios pueden ver todos los avatares" ON storage.objects;
DROP POLICY IF EXISTS "Los usuarios pueden subir su propio avatar" ON storage.objects;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio avatar" ON storage.objects;
DROP POLICY IF EXISTS "Los usuarios pueden eliminar su propio avatar" ON storage.objects;

-- Política 1: Permitir a todos ver los avatares (son públicos)
CREATE POLICY "Los usuarios pueden ver todos los avatares"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Política 2: Permitir a los usuarios autenticados subir su propio avatar
CREATE POLICY "Los usuarios pueden subir su propio avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Política 3: Permitir a los usuarios actualizar su propio avatar
CREATE POLICY "Los usuarios pueden actualizar su propio avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Política 4: Permitir a los usuarios eliminar su propio avatar
CREATE POLICY "Los usuarios pueden eliminar su propio avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =====================================================
-- NOTAS IMPORTANTES:
-- =====================================================
-- 1. El bucket 'avatars' es público para que las imágenes sean accesibles
-- 2. Cada usuario solo puede subir/modificar/eliminar en su propia carpeta (identificada por su UUID)
-- 3. La estructura de carpetas será: avatars/{user_id}/{filename}
-- 4. Formatos aceptados: cualquier imagen (jpg, png, gif, webp, etc.)
-- 5. Límite de tamaño: configurado en el código (5MB)
-- 6. Las URLs generadas serán públicas y permanentes
-- =====================================================
