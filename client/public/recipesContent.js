// Script para inyectar las recetas guiadas directamente en el DOM
function loadRecipesContent() {
  // Buscar el contenedor de recetas guiadas
  const interval = setInterval(() => {
    const recipesContainer = document.querySelector('[data-value="guided-recipes"] > div');
    
    if (recipesContainer) {
      clearInterval(interval);
      
      // Limpiar contenido existente
      recipesContainer.innerHTML = '';
      
      // Crear nuevo contenido de recetas
      const content = document.createElement('div');
      content.style.padding = '20px';
      content.style.backgroundColor = 'white';
      content.style.borderRadius = '10px';
      content.style.margin = '10px';
      
      // Título principal
      const title = document.createElement('h2');
      title.textContent = 'Las Tres Recetas Básicas';
      title.style.fontSize = '24px';
      title.style.fontWeight = 'bold';
      title.style.textAlign = 'center';
      title.style.marginBottom = '20px';
      title.style.color = '#92400e';
      content.appendChild(title);
      
      // Receta 1 - Desayuno
      const recipe1 = document.createElement('div');
      recipe1.style.padding = '15px';
      recipe1.style.backgroundColor = '#FEF3C7';
      recipe1.style.borderRadius = '8px';
      recipe1.style.border = '1px solid #F59E0B';
      recipe1.style.marginBottom = '20px';
      
      const recipe1Title = document.createElement('h3');
      recipe1Title.textContent = 'Desayuno Equilibrado';
      recipe1Title.style.fontSize = '20px';
      recipe1Title.style.fontWeight = 'bold';
      recipe1Title.style.marginBottom = '10px';
      recipe1Title.style.color = '#92400E';
      recipe1.appendChild(recipe1Title);
      
      const recipe1Desc = document.createElement('p');
      recipe1Desc.textContent = 'Un desayuno nutritivo con huevos, pan y fruta fresca';
      recipe1Desc.style.marginBottom = '10px';
      recipe1.appendChild(recipe1Desc);
      
      const recipe1Ingredients = document.createElement('p');
      recipe1Ingredients.innerHTML = '<strong>Ingredientes:</strong> Huevos, Pan, Manzana';
      recipe1.appendChild(recipe1Ingredients);
      
      const recipe1Calories = document.createElement('p');
      recipe1Calories.innerHTML = '<strong>Calorías:</strong> 350 kcal';
      recipe1.appendChild(recipe1Calories);
      
      const recipe1Button = document.createElement('button');
      recipe1Button.textContent = 'Preparar Receta';
      recipe1Button.style.width = '100%';
      recipe1Button.style.backgroundColor = '#F59E0B';
      recipe1Button.style.color = 'white';
      recipe1Button.style.padding = '8px 15px';
      recipe1Button.style.border = 'none';
      recipe1Button.style.borderRadius = '5px';
      recipe1Button.style.marginTop = '10px';
      recipe1Button.style.cursor = 'pointer';
      recipe1.appendChild(recipe1Button);
      
      content.appendChild(recipe1);
      
      // Receta 2 - Almuerzo
      const recipe2 = document.createElement('div');
      recipe2.style.padding = '15px';
      recipe2.style.backgroundColor = '#DCFCE7';
      recipe2.style.borderRadius = '8px';
      recipe2.style.border = '1px solid #22C55E';
      recipe2.style.marginBottom = '20px';
      
      const recipe2Title = document.createElement('h3');
      recipe2Title.textContent = 'Almuerzo Vegetariano';
      recipe2Title.style.fontSize = '20px';
      recipe2Title.style.fontWeight = 'bold';
      recipe2Title.style.marginBottom = '10px';
      recipe2Title.style.color = '#166534';
      recipe2.appendChild(recipe2Title);
      
      const recipe2Desc = document.createElement('p');
      recipe2Desc.textContent = 'Un almuerzo a base de plantas con frijoles, arroz y verduras';
      recipe2Desc.style.marginBottom = '10px';
      recipe2.appendChild(recipe2Desc);
      
      const recipe2Ingredients = document.createElement('p');
      recipe2Ingredients.innerHTML = '<strong>Ingredientes:</strong> Frijoles, Arroz, Brócoli';
      recipe2.appendChild(recipe2Ingredients);
      
      const recipe2Calories = document.createElement('p');
      recipe2Calories.innerHTML = '<strong>Calorías:</strong> 420 kcal';
      recipe2.appendChild(recipe2Calories);
      
      const recipe2Button = document.createElement('button');
      recipe2Button.textContent = 'Preparar Receta';
      recipe2Button.style.width = '100%';
      recipe2Button.style.backgroundColor = '#22C55E';
      recipe2Button.style.color = 'white';
      recipe2Button.style.padding = '8px 15px';
      recipe2Button.style.border = 'none';
      recipe2Button.style.borderRadius = '5px';
      recipe2Button.style.marginTop = '10px';
      recipe2Button.style.cursor = 'pointer';
      recipe2.appendChild(recipe2Button);
      
      content.appendChild(recipe2);
      
      // Receta 3 - Cena
      const recipe3 = document.createElement('div');
      recipe3.style.padding = '15px';
      recipe3.style.backgroundColor = '#DBEAFE';
      recipe3.style.borderRadius = '8px';
      recipe3.style.border = '1px solid #3B82F6';
      recipe3.style.marginBottom = '20px';
      
      const recipe3Title = document.createElement('h3');
      recipe3Title.textContent = 'Cena Proteica';
      recipe3Title.style.fontSize = '20px';
      recipe3Title.style.fontWeight = 'bold';
      recipe3Title.style.marginBottom = '10px';
      recipe3Title.style.color = '#1E40AF';
      recipe3.appendChild(recipe3Title);
      
      const recipe3Desc = document.createElement('p');
      recipe3Desc.textContent = 'Una cena rica en proteínas con pollo, patatas y verduras';
      recipe3Desc.style.marginBottom = '10px';
      recipe3.appendChild(recipe3Desc);
      
      const recipe3Ingredients = document.createElement('p');
      recipe3Ingredients.innerHTML = '<strong>Ingredientes:</strong> Pollo, Patata, Espinaca';
      recipe3.appendChild(recipe3Ingredients);
      
      const recipe3Calories = document.createElement('p');
      recipe3Calories.innerHTML = '<strong>Calorías:</strong> 480 kcal';
      recipe3.appendChild(recipe3Calories);
      
      const recipe3Button = document.createElement('button');
      recipe3Button.textContent = 'Preparar Receta';
      recipe3Button.style.width = '100%';
      recipe3Button.style.backgroundColor = '#3B82F6';
      recipe3Button.style.color = 'white';
      recipe3Button.style.padding = '8px 15px';
      recipe3Button.style.border = 'none';
      recipe3Button.style.borderRadius = '5px';
      recipe3Button.style.marginTop = '10px';
      recipe3Button.style.cursor = 'pointer';
      recipe3.appendChild(recipe3Button);
      
      content.appendChild(recipe3);
      
      // Instrucciones Generales
      const instructions = document.createElement('div');
      instructions.style.backgroundColor = 'white';
      instructions.style.padding = '15px';
      instructions.style.margin = '20px 0';
      instructions.style.borderRadius = '8px';
      instructions.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
      instructions.style.border = '1px solid #E5E7EB';
      
      const instructionsTitle = document.createElement('h3');
      instructionsTitle.textContent = 'Instrucciones Generales:';
      instructionsTitle.style.fontSize = '20px';
      instructionsTitle.style.fontWeight = 'bold';
      instructionsTitle.style.marginBottom = '10px';
      instructions.appendChild(instructionsTitle);
      
      const instructionsList = document.createElement('ol');
      instructionsList.style.paddingLeft = '25px';
      
      const instructionsItems = [
        'Selecciona una receta según tus necesidades nutricionales',
        'Asegúrate de tener todos los ingredientes en tu inventario',
        'Sigue cada paso para preparar una comida nutritiva',
        '¡Disfruta de tu comida y aprende sobre nutrición!'
      ];
      
      instructionsItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        li.style.margin = '5px 0';
        instructionsList.appendChild(li);
      });
      
      instructions.appendChild(instructionsList);
      content.appendChild(instructions);
      
      // Botón de guía nutricional
      const guideButtonContainer = document.createElement('div');
      guideButtonContainer.style.textAlign = 'center';
      
      const guideButton = document.createElement('button');
      guideButton.textContent = 'Guía Nutricional Completa';
      guideButton.style.backgroundColor = '#D97706';
      guideButton.style.color = 'white';
      guideButton.style.padding = '10px 20px';
      guideButton.style.border = 'none';
      guideButton.style.borderRadius = '8px';
      guideButton.style.fontWeight = 'bold';
      guideButton.style.cursor = 'pointer';
      
      guideButtonContainer.appendChild(guideButton);
      content.appendChild(guideButtonContainer);
      
      // Añadir todo al contenedor principal
      recipesContainer.appendChild(content);
      
      console.log('Recetas cargadas correctamente');
    }
  }, 500); // Comprobar cada 500ms
}

// Ejecutar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM cargado, preparando para cargar recetas');
  loadRecipesContent();
});

// También ejecutar cuando cambie la URL (para detectar cambios de pestaña)
let lastUrl = location.href; 
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    console.log('URL cambiada, recargando recetas');
    loadRecipesContent();
  }
}).observe(document, {subtree: true, childList: true});

// Ejecutar periódicamente para asegurar que las recetas están cargadas
setInterval(loadRecipesContent, 3000);