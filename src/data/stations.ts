import type { Station } from "@/types/company.types";

export const stations: Station[] = [
    { 
        id: 's1',
        name: 'Les 3 vallées', 
        country: { 
            code: 'FR', 
            name: 'France', 
            id: 'c1' 
        },  
        address: {
            street: '123 Rue des Alpes',
            zipCode: '73000',
            city: 'Chambéry'
        }
    },
  { 
    id: 's2',
    name: 'Chamonix', 
    country: { code: 'FR', name: 'France', id: 'c1' },  
    address: {
        street: '456 Rue de Montagne',
        zipCode: '74400',
        city: 'Chamonix'
    }
  }, 
  { 
    id: 's3',
    name: 'Bassin d\'Arcachon', 
    country: { code: 'FR', name: 'France', id: 'c1' },  
    address: {
        street: '789 Rue du Bassin',
        zipCode: '33120',
        city: 'Arcachon'
    }
  },
    {
        id: 's4',
        name: 'Sophie Leclerc',
        country:{ 
            code: 'FR', 
            name: 'France', 
            id: 'c1' 
        },  
        address: {
            street: '101 Rue de Sophie',
            zipCode: '75000',
            city: 'Paris'
        }
    },
  { 
    id: 's5',
    name: 'Karim Benali', 
    country: { 
        code: 'FR', 
        name: 'France', 
        id: 'c1' 
    },  
    address: {
        street: '102 Rue de Karim',
        zipCode: '75001',
        city: 'Paris'
    }
  }, 
  { 
    id: 's6',
     name: 'Amina Diallo', 
     country: { 
         code: 'FR', 
         name: 'France', 
         id: 'c1' 
     },  
     address: {
         street: '103 Rue d\'Amina',
         zipCode: '75002',
         city: 'Paris'
     }
  }
]