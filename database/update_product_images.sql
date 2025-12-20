-- Script para actualizar las imágenes de productos usando imágenes locales generadas
-- Ejecutar este script en el SQL Editor de Supabase
-- IMPORTANTE: Asegúrate de que las imágenes estén en la carpeta public/products/ de tu proyecto

-- Actualizar Cafetera Express (REF014) con imagen generada correcta
UPDATE public.productos 
SET imagen_producto = '/products/cafetera.png'
WHERE referencia = 'REF014';

-- Actualizar Bombillas LED Pack 6 (REF017) con imagen generada correcta
UPDATE public.productos 
SET imagen_producto = '/products/bombillas.png'
WHERE referencia = 'REF017';

-- Actualizar Tira LED RGB 5m (REF015) con imagen generada correcta
UPDATE public.productos 
SET imagen_producto = '/products/tira_led.png'
WHERE referencia = 'REF015';

-- Actualizar Set de Bolígrafos Premium (REF020) con imagen generada correcta
UPDATE public.productos 
SET imagen_producto = '/products/boligrafos.png'
WHERE referencia = 'REF020';

-- Verificar los cambios
SELECT referencia, nombre, imagen_producto 
FROM public.productos 
WHERE referencia IN ('REF014', 'REF015', 'REF017', 'REF020');
