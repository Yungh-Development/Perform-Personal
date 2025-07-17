import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import FooterTemplate from '../template/footer/page';


const HomePage = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="bg-blue-600">
          <div className="flex ion-padding my-2">    
            <div className="flex ml-4 justify-center items-center">
              <IonTitle className="text-white text-2xl">Homepage</IonTitle>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <HomeOutlinedIcon className="mr-4"/>
            <IonLabel>  
              <h3>Botão para a HomePage</h3>
            </IonLabel>
          </IonItem>
        </IonList>
        <IonList>
          <IonItem>
            <FitnessCenterOutlinedIcon className="mr-4"/>
            <IonLabel>  
              <h3>Botão para Relatório de Treinos</h3>
            </IonLabel>
          </IonItem>
        </IonList>
        <IonList>
          <IonItem>
            <AddOutlinedIcon className="mr-4"/>
            <IonLabel>  
              <h3 className='ml-4'>Botão para Adicionar Aluno e Treino</h3>
            </IonLabel>
          </IonItem>
        </IonList>
        <IonList>
          <IonItem>
            <ListAltOutlinedIcon className="mr-4"/>
            <IonLabel>  
              <h3>Botão para Lista de Alunos Cadastrados</h3>
            </IonLabel>
          </IonItem>
        </IonList>      
      </IonContent>
      <FooterTemplate/>
    </IonPage>
  );
};

export default HomePage;