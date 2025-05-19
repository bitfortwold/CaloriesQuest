import React from 'react';

const RecipesGuided: React.FC = () => {
  return (
    <div style={{padding: '20px', backgroundColor: 'white', margin: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
      <h2 style={{fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px', color: '#92400e'}}>
        Las Tres Recetas Básicas
      </h2>
      
      <div style={{marginBottom: '20px', padding: '15px', backgroundColor: '#FEF3C7', borderRadius: '8px', border: '1px solid #F59E0B'}}>
        <h3 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#92400e'}}>
          Desayuno Equilibrado
        </h3>
        <p style={{marginBottom: '10px'}}>Un desayuno nutritivo con huevos, pan y fruta fresca</p>
        <p><strong>Ingredientes:</strong> Huevos, Pan, Manzana</p>
        <p><strong>Calorías:</strong> 350 kcal</p>
        <p><strong>Beneficios:</strong> Alto en proteínas y carbohidratos complejos</p>
        <button style={{
          width: '100%', 
          backgroundColor: '#F59E0B', 
          color: 'white', 
          padding: '8px 15px', 
          border: 'none', 
          borderRadius: '5px', 
          marginTop: '10px'
        }}>
          Preparar Receta
        </button>
      </div>
      
      <div style={{marginBottom: '20px', padding: '15px', backgroundColor: '#DCFCE7', borderRadius: '8px', border: '1px solid #22C55E'}}>
        <h3 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#166534'}}>
          Almuerzo Vegetariano
        </h3>
        <p style={{marginBottom: '10px'}}>Un almuerzo a base de plantas con frijoles, arroz y verduras</p>
        <p><strong>Ingredientes:</strong> Frijoles, Arroz, Brócoli</p>
        <p><strong>Calorías:</strong> 420 kcal</p>
        <p><strong>Beneficios:</strong> Rico en fibra y vitaminas esenciales</p>
        <button style={{
          width: '100%', 
          backgroundColor: '#22C55E', 
          color: 'white', 
          padding: '8px 15px', 
          border: 'none', 
          borderRadius: '5px', 
          marginTop: '10px'
        }}>
          Preparar Receta
        </button>
      </div>
      
      <div style={{marginBottom: '20px', padding: '15px', backgroundColor: '#DBEAFE', borderRadius: '8px', border: '1px solid #3B82F6'}}>
        <h3 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#1E40AF'}}>
          Cena Proteica
        </h3>
        <p style={{marginBottom: '10px'}}>Una cena rica en proteínas con pollo, patatas y vegetales</p>
        <p><strong>Ingredientes:</strong> Pollo, Patata, Espinaca</p>
        <p><strong>Calorías:</strong> 480 kcal</p>
        <p><strong>Beneficios:</strong> Apoyo muscular y recuperación</p>
        <button style={{
          width: '100%', 
          backgroundColor: '#3B82F6', 
          color: 'white', 
          padding: '8px 15px', 
          border: 'none', 
          borderRadius: '5px', 
          marginTop: '10px'
        }}>
          Preparar Receta
        </button>
      </div>
      
      <div style={{backgroundColor: 'white', padding: '15px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #E5E7EB'}}>
        <h3 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '15px'}}>Instrucciones de Cocina</h3>
        <ol style={{listStyleType: 'decimal', paddingLeft: '25px'}}>
          <li style={{marginBottom: '8px'}}>Selecciona una receta según tus necesidades nutricionales</li>
          <li style={{marginBottom: '8px'}}>Asegúrate de tener todos los ingredientes en tu inventario</li>
          <li style={{marginBottom: '8px'}}>Sigue los pasos para preparar una comida nutritiva</li>
          <li style={{marginBottom: '8px'}}>¡Disfruta de tu comida y aprende sobre nutrición!</li>
        </ol>
      </div>
      
      <div style={{textAlign: 'center'}}>
        <button style={{
          backgroundColor: '#D97706', 
          color: 'white', 
          padding: '10px 20px', 
          border: 'none', 
          borderRadius: '8px', 
          fontWeight: 'bold'
        }}>
          Guía Nutricional Completa
        </button>
      </div>
    </div>
  );
};

export default RecipesGuided;