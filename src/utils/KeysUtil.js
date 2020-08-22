import {db} from '../firebase/firebase';
import FireStoreDocumentConstants from '../constants/FireStoreDocumentConstants';

export const writePlacesApi = () => {
  db.collection('keys').doc(FireStoreDocumentConstants.GOOGLE_PLACES)
  .get()
  .then(function(doc) {
    if (doc.exists) {
      var u = `https://maps.googleapis.com/maps/api/js?key=${doc.data().places}&libraries=places`;
      var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
      g.type='text/javascript'; g.async=true; g.defer=true; g.src=u; s.parentNode.insertBefore(g,s);
    } else {
      console.warn("No such document!");
    }
  })
  .catch(error => console.warn("Error getting document:", error));
}
