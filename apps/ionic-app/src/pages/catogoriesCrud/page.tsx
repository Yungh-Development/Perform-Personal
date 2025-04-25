import React, { useState } from 'react';
import { IonCardHeader, IonPage, IonText, IonButton, IonLabel, IonList, IonCard, IonCardContent } from '@ionic/react';
import './style.css'


interface Category {
  id: number;
  name: string;
  description: string;
}

const CategoriesCrud: React.FC = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [nextId, setNextId] = useState(1);

  const addCategoryHandler = () => {
    if (categoryName.trim() === '') return;

    const newCategory: Category = {
      id: nextId,
      name: categoryName,
      description: categoryDescription,
    };

    setCategories([...categories, newCategory]);
    setCategoryName('');
    setCategoryDescription('');
    setNextId(nextId + 1);
  };

  const removeCardHandler = (id: number) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  return (
    <IonPage>
      <IonCardHeader>         
        <div className="flex relative w-full h-20 justify-center items-center">
         <div className="absolute inset-0 -z-10 h-full w-full bg-white"></div>
          <img src="./nippon-sorocaba.png" alt="teste" className="w-30 absolute left-5 ion-padding cursor-pointer" />
            <div className="text-main-background-color text-2xl lg:text-3xl flex justify-center items-center mr-4">
              {/* <ion-icon name="snow" aria-hidden="true"></ion-icon> */}
            </div>
          <h1 className="text-subtitle text-2xl lg:text-3xl">FridgeStockManager</h1>   
        </div>
      </IonCardHeader>
      <IonCard className="h-full ion-padding bg-main-background-color">
        <IonCardContent>
          <div>
            <div>
              <IonLabel className="text-base text-white">Nome da Categoria: </IonLabel>
              <div className="relative flex py-2">
                <input 
                type="text"
                placeholder="Digite o nome da categoria"
                maxLength={20}
                value={categoryName} 
                onChange={(e) => setCategoryName(e.target.value!)}
                className="my-2 rounded-full text-sm placeholder-lightgray-placeholder placeholder-default-placeholder w-full h-11 pl-4 bg-white"
                ></input>
              </div>    
              <IonLabel className="text-base text-white">Descrição: </IonLabel>
              <div className="relative flex py-2">
                <input 
                type="text"
                placeholder="Digite uma breve descrição" 
                maxLength={15}
                value={categoryDescription} 
                onChange={(e) => setCategoryDescription(e.target.value!)}
                className="my-2 rounded-full text-sm placeholder-lightgray-placeholder placeholder-default-placeholder w-full h-11 pl-4 bg-white"
                ></input>
              </div>                   
              <div className="flex justify-center items-center mt-10 mb-5">
                <IonButton color="text-submit-text" fill="clear" aria-hidden="true" type="submit" onClick={addCategoryHandler} className="text-submit-text w-full hover:opacity-85">
                   <IonText>Register</IonText>
                </IonButton>
              </div>
            </div>
            <div className="space-y-3 flex relative">
              <div className='h-[1px] bg-white w-full absolute'></div>
              {categories.length === 0 ? (
                <p className="text-white text-center py-4">Nenhuma categoria adicionada ainda</p>
              ) : (
                <div className="space-y-3 mt-4 flex flex-wrap">
                  {categories.map((option) => (
                    <div 
                      key={option.id}
                      className="bg-categories-card w-auto p-4 m-3 flex justify-center items-center rounded-full shadow hover:shadow-lg transition-all duration-300 relative group"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-white">{option.name}</span>
                        <button 
                          type='button'
                          onClick={() => removeCardHandler(option.id)}
                          className="text-red-500 hover:text-red-700 transition-colors ml-5"
                        >
                          <span className='text-red-500 hover:text-red-600'>X</span>
                        </button>
                      </div>                    
                      <div className="absolute w-auto min-w-30 items-center justify-center flex top-10 p-4 m-3 bg-sub-categories-card rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 cursor-help">
                        <p className="text-sm text-white ">{option.description || 'Sem descrição'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </IonCardContent>
      </IonCard>
    </IonPage>
  );
};

export default CategoriesCrud;