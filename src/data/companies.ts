export const companies = [
  {
    id: "c1",
    name: "Acme Corp",
    address: {
      street: "12 Rue de Rivoli",
      postaleCode: "75001",
      city: "Paris",
      country: "France",
    },
    description: "Leader en solutions logistiques",
    owner: {
      id: "u20",
      firstName: "Jean",
      lastName: "Dupont",
      email: "email@patron.eu",
    },
    createdAt: "2026-02-20",
    employes: [
      {
            id: "u200",
            name: "Charles Dang",
            job: {
                id: "j22",
            },
      },
      { 
            id: "u201", 
            name: "Claire Martin", 
            job: { 
                id: "j20" 
            } 
        },
      { 
            id: "u202", 
            name: "Pierre Bernard", 
            job: { 
                id: "j22" 
            } 
        },
      { 
            id: "u203", 
            name: "Sophie Leclerc", 
            job: { 
                id: "j21" 
            } 
        },
      { 
            id: "u204", 
            name: "Karim Benali", 
            job: { 
                id: "j22" 
            } 
        },
      { 
            id: "u205", 
            name: "Amina Diallo", 
            job: { 
                id: "j22" 
            } 
        },
    ],
    annoucments: [
      {
        id: "a20",
        title: "Logistics Manager",
        type: "Full-time",
        createdAt: "2026-02-15",
        applicationCount: 12,
        postedAt: "2026-02-20",
        jobId: "j20",
      },
      {
        id: "a21",
        title: "Supply Chain Analyst",
        type: "Part-time",
        createdAt: "2026-02-10",
        applicationCount: 12,
        postedAt: "2026-02-18",
        jobId: "j21",
      },
      {
        id: "a22",
        title: "Warehouse Supervisor",
        type: "Full-time",
        createdAt: "2026-02-05",
        applicationCount: 12,
        postedAt: "2026-02-18",
        jobId: "j22",
      },
    ],
    jobs: [
      {
        id: "j20",
        title: "Logistics Manager",
        location: "Paris",
        type: "Full-time",
        createdAt: "2026-02-15",
      },
      {
        id: "j21",
        title: "Supply Chain Analyst",
        location: "Remote",
        type: "Part-time",
        createdAt: "2026-02-10",
      },
      {
        id: "j22",
        title: "Warehouse Supervisor",
        location: "Lyon",
        type: "Full-time",
        createdAt: "2026-02-05",
      },
    ],
  },
  {
    id: "c2",
    name: "Beta Corp",
    address: {
      street: "34 Avenue des Champs-Élysées",
      postaleCode: "75008",
      city: "Paris",
      country: "France",
    },
    description: "Saas B2B pour la gestion RH",
    owner: {
      id: "u30",
      firstName: "Maxime",
      lastName: "Biaggi",
      email: "email@patron.eu",
    },
    createdAt: "2026-02-20",
    employes: [
      {
            id: "u300",
            name: "Charles Dang",
            job: {
                id: "j30",
            },
      },
      { 
            id: "u301", 
            name: "Claire Martin", 
            job: { 
                id: "j31" 
            } 
        },
      { 
            id: "u302", 
            name: "Pierre Bernard", 
            job: { 
                id: "j32" 
            } 
        },
      { 
            id: "u303", 
            name: "Sophie Leclerc", 
            job: { 
                id: "j33" 
            } 
        },
      { 
            id: "u304", 
            name: "Karim Benali", 
            job: { 
                id: "j34" 
            } 
        },
      { 
            id: "u305", 
            name: "Amina Diallo", 
            job: { 
                id: "j35" 
            } 
        },
    ],
    annoucments: [
      {
        id: "a30",
        title: "Logistics Manager",
        type: "Full-time",
        createdAt: "2026-02-15",
        applicationCount: 12,
        postedAt: "2026-02-20",
        jobId: "j33",
      },
      {
        id: "a31",
        title: "Supply Chain Analyst",
        type: "Part-time",
        createdAt: "2026-02-10",
        applicationCount: 12,
        postedAt: "2026-02-18",
        jobId: "j34",
      },
      {
        id: "a32",
        title: "Warehouse Supervisor",
        type: "Full-time",
        createdAt: "2026-02-05",
        applicationCount: 12,
        postedAt: "2026-02-18",
        jobId: "j35",
      },
    ],
    jobs: [
      {
        id: "j30",
        title: "Logistics Manager",
        location: "Paris",
        type: "Full-time",
        createdAt: "2026-02-15",
      },
      {
        id: "j31",
        title: "Supply Chain Analyst",
        location: "Remote",
        type: "Part-time",
        createdAt: "2026-02-10",
      },
      {
        id: "j32",
        title: "Warehouse Supervisor",
        location: "Lyon",
        type: "Full-time",
        createdAt: "2026-02-05",
      },
    ],
  },
];
