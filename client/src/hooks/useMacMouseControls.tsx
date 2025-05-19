import { useState, useEffect, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useCameraStore } from '../lib/stores/useCameraStore';

// Sensibilidad para diferentes controles
const SENSITIVITY = {
  ROTATE: 0.005,  // Sensibilidad para rotación de cámara
  ZOOM: 0.1       // Sensibilidad para zoom
};

// Valores para la inercia
const INERTIA = {
  FRICTION: 0.95,   // Factor de fricción (0-1)
  THRESHOLD: 0.001  // Umbral para detener la inercia
};

export function useMacMouseControls() {
  const { camera } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const [previous, setPrevious] = useState({ x: 0, y: 0 });
  const [inertia, setInertia] = useState({ x: 0, y: 0 });
  const [gestureStarted, setGestureStarted] = useState(false);
  
  // Obtener funciones del store de cámara
  const { requestOrbitDelta, requestZoom } = useCameraStore.getState();

  // Función para manejar inicio de arrastre
  const handleMouseDown = useCallback((e: MouseEvent) => {
    // Solo activar con botón izquierdo (principal en Mac)
    if (e.button === 0) {
      setIsDragging(true);
      setPrevious({ x: e.clientX, y: e.clientY });
      setInertia({ x: 0, y: 0 });
    }
  }, []);

  // Función para detectar si es un Magic Mouse o trackpad por sus características
  const isMacGesture = useCallback((e: WheelEvent) => {
    // Característica típica de Magic Mouse/Trackpad: deltaMode = 0 (píxeles) y valores fraccionarios
    return e.deltaMode === 0 && 
           Math.abs(e.deltaX) < 10 && 
           Math.abs(e.deltaY) < 10 && 
           !Number.isInteger(e.deltaY);
  }, []);

  // Manejar el movimiento del ratón
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - previous.x;
    const deltaY = e.clientY - previous.y;
    
    // Actualizar la rotación de la cámara usando el store
    requestOrbitDelta(-deltaX * SENSITIVITY.ROTATE, -deltaY * SENSITIVITY.ROTATE);
    
    // Guardar velocidad para inercia
    setInertia({ 
      x: deltaX * SENSITIVITY.ROTATE, 
      y: deltaY * SENSITIVITY.ROTATE 
    });
    
    // Actualizar posición previa
    setPrevious({ x: e.clientX, y: e.clientY });
  }, [isDragging, previous, requestOrbitDelta]);

  // Manejar fin de arrastre
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Manejar gestos del trackpad/Magic Mouse (scrolling con dos dedos y zoom)
  const handleWheel = useCallback((e: WheelEvent) => {
    // Detectar si el evento parece venir de un trackpad/Magic Mouse
    if (isMacGesture(e)) {
      e.preventDefault();
      
      // Inicio de gesto
      if (!gestureStarted) {
        setGestureStarted(true);
      }
      
      // Zoom (deltaY negativo = acercar, positivo = alejar)
      const zoomFactor = e.deltaY * SENSITIVITY.ZOOM;
      requestZoom(zoomFactor);
      
      // Rotación horizontal con gesto horizontal
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 0.5) {
        requestOrbitDelta(e.deltaX * SENSITIVITY.ROTATE * 2, 0);
      }
    }
  }, [gestureStarted, requestZoom, requestOrbitDelta, isMacGesture]);

  // Manejar fin de gesto
  const handleGestureEnd = useCallback(() => {
    setGestureStarted(false);
  }, []);

  // Aplicar inercia cada frame
  const applyInertia = useCallback(() => {
    if (!isDragging && (Math.abs(inertia.x) > INERTIA.THRESHOLD || Math.abs(inertia.y) > INERTIA.THRESHOLD)) {
      // Aplicar rotación con inercia
      requestOrbitDelta(-inertia.x, -inertia.y);
      
      // Reducir velocidad gradualmente (efecto de fricción)
      setInertia({
        x: inertia.x * INERTIA.FRICTION,
        y: inertia.y * INERTIA.FRICTION
      });
    }
  }, [isDragging, inertia, requestOrbitDelta]);

  // Configurar los event listeners
  useEffect(() => {
    // Agregar event listeners con opciones específicas para Mac
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('gestureend', handleGestureEnd);
    
    // Crear un interval para aplicar la inercia
    const inertiaInterval = setInterval(applyInertia, 16); // ~60fps
    
    // Cleanup
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('gestureend', handleGestureEnd);
      clearInterval(inertiaInterval);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleWheel, handleGestureEnd, applyInertia]);

  return {
    isDragging,
    inertia,
    gestureStarted
  };
}