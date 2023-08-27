import audi from '@assets/logos/audi.png';
import bmw from '@assets/logos/bmw.png';
import caoa from '@assets/logos/caoa.png';
import chevrolet from '@assets/logos/chevrolet.png';
import citroen from '@assets/logos/citroen.png';
import fiat from '@assets/logos/fiat.png';
import ford from '@assets/logos/ford.png';
import honda from '@assets/logos/honda.png';
import hyundai from '@assets/logos/hyundai.png';
import iveco from '@assets/logos/iveco.png';
import jeep from '@assets/logos/jeep.png';
import kia from '@assets/logos/kia.png';
import landrover from '@assets/logos/land.png';
import mercedes from '@assets/logos/mercedes.png';
import mitsubish from '@assets/logos/mitsubishi.png';
import nissan from '@assets/logos/nissan.png';
import peugeot from '@assets/logos/peugeot.png';
import porsche from '@assets/logos/porsche.png';
import renault from '@assets/logos/Renault.png';
import scania from '@assets/logos/scania.png';
import subaru from '@assets/logos/subaru.png';
import suzuki from '@assets/logos/suzuki.png';
import toyota from '@assets/logos/Toyota.png';
import volkswagen from '@assets/logos/Volkswagen.png';
import volvo from '@assets/logos/volvo.png';

export default function getLogoImage(brandName: string) {
  switch (brandName) {
    case 'audi.png':
      return audi;
    case 'bww.png':
      return bmw;
    case 'caoa.png':
      return caoa;
    case 'chevrolet.png':
      return chevrolet;
    case 'citroen.png':
      return citroen;
    case 'fiat.png':
      return fiat;
    case 'ford.png':
      return ford;
    case 'honda.png':
      return honda;
    case 'hyundai.png':
      return hyundai;
    case 'iveco.png':
      return iveco;
    case 'jeep.png':
      return jeep;
    case 'kia.png':
      return kia;
    case 'landrover.png':
      return landrover;
    case 'mercedes.png':
      return mercedes;
    case 'mitsubishi.png':
      return mitsubish;
    case 'nissan.png':
      return nissan;
    case 'peugeot.png':
      return peugeot;
    case 'porsche.png':
      return porsche;
    case 'renault.png':
      return renault;
    case 'scania.png':
      return scania;
    case 'subaru.png':
      return subaru;
    case 'suzuki.png':
      return suzuki;
    case 'toyota.png':
      return toyota;
    case 'volkswagen.png':
      return volkswagen;
    case 'volvo.png':
      return volvo;
    default:
      return null;
  }
}
