import { IonButton, IonFooter } from '@ionic/react';
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import { useLocation } from 'react-router-dom';

const FooterTemplate = () => {
  const location = useLocation();

  return (
    <IonFooter className="relative bg-[#1F1F1F]" >
      <div className="absolute bg-amber-500 rounded-full w-12 h-12 flex items-center justify-center left-1/2 -ml-6 -top-1/2">
        <div className="flex">
          <a href="/formulario-performance" className="mt-2">
            <ion-icon name="add" color="black" size="large"></ion-icon>
          </a>
        </div>
      </div>
      <div className="flex items-center py-4">
        <div className="flex justify-around w-full">
          <IonButton
            fill="clear"
            className={location.pathname === '/home' ? 'bg-amber-500 rounded-md h-4 w-10' : ''}
          >
            <a href="/home">
              <HomeOutlinedIcon
                sx={{ fontSize: 25, color: location.pathname === '/home' ? 'white' : 'gray' }}
              />
            </a>
          </IonButton>
          <IonButton
            fill="clear"
            className={location.pathname === '/relatorio' ? 'bg-amber-500 rounded-md h-4 w-10' : ''}
          >
            <a href="/relatorio">
              <FitnessCenterOutlinedIcon
                sx={{ fontSize: 25, color: location.pathname === '/relatorio' ? 'white' : 'gray' }}
              />
            </a>
          </IonButton>
        </div>
        <div className="w-full flex justify-center">
          <IonButton
            fill="clear"
            className={location.pathname === '/lista-alunos' ? 'bg-amber-500 rounded-md h-4 w-10' : ''}
          >
            <a href="/lista-alunos">
              <ListAltOutlinedIcon
                sx={{ fontSize: 25, color: location.pathname === '/lista-alunos' ? 'white' : 'gray' }}
              />
            </a>
          </IonButton>
        </div>
      </div>
    </IonFooter>
  );
};

export default FooterTemplate;