import { IonContent, IonPage } from '@ionic/react';
import FooterTemplate from '../template/footer/page';


const HomePage = () => {
  return (
    <IonPage>     
      <IonContent color="page-background" className="ion-padding">
        <h1>HOMEPAGE</h1>
      </IonContent>
      <FooterTemplate/>
    </IonPage>
  );
};

export default HomePage;