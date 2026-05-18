export interface School {
  id: string;
  name: string;
  url: string;
  description: string;
  type: string; // e.g. "Grau Oficial"
  location: string;
  credits: string;
  perfil: string;
  instalacions: string;
  networking: "Alta" | "Mitjana" | "Bàsica";
  erasmus: string;
}

export const schools: School[] = [
  {
    id: "elisava",
    name: "Elisava",
    url: "https://www.elisava.net",
    description: "Escola Universitària de Disseny i Enginyeria de Barcelona. Referent en innovació i creativitat.",
    type: "Grau Oficial en Disseny / Enginyeria",
    location: "La Rambla, Barcelona",
    credits: "240 ECTS (4 anys)",
    perfil: "Dissenyadors amb visió estratègica i capacitats tècniques avançades.",
    instalacions: "Laboratoris de fabricació digital, tallers de prototipatge i espais de coworking.",
    networking: "Alta",
    erasmus: "Més de 70 acords internacionals a Europa i Amèrica."
  },
  {
    id: "bau",
    name: "BAU",
    url: "https://www.bau.cat",
    description: "Centre Universitari de Disseny de Barcelona. Especialitzat en disseny gràfic, audiovisual, interior i moda.",
    type: "Grau Oficial en Disseny",
    location: "Poblenou, Barcelona",
    credits: "240 ECTS (4 anys)",
    perfil: "Creatius compromesos amb l'entorn social i cultural.",
    instalacions: "Tallers de serigrafia, platós de fotografia i sales de muntatge audiovisual.",
    networking: "Alta",
    erasmus: "Mobilitat activa amb centres d'excel·lència a Alemanya, Itàlia i Regne Unit."
  },
  {
    id: "eina",
    name: "Eina",
    url: "https://www.eina.cat",
    description: "Centre Universitari de Disseny i Art de Barcelona. Amb una visió humanista del disseny.",
    type: "Grau Oficial en Disseny",
    location: "Sarrià, Barcelona",
    credits: "240 ECTS (4 anys)",
    perfil: "Dissenyadors amb gran base teòrica i esperit crític.",
    instalacions: "Entorn natural privilegiat, tallers experimentals i arxiu històric.",
    networking: "Alta",
    erasmus: "Xarxa de col·laboració amb universitats europees de prestigi."
  },
  {
    id: "ied",
    name: "IED Barcelona",
    url: "https://iedbarcelona.es",
    description: "Istituto Europeo di Design. Enfocament internacional i connexió amb la indústria del luxe i la moda.",
    type: "Grau Oficial / Títols Propis",
    location: "Gràcia, Barcelona",
    credits: "240 ECTS",
    perfil: "Perfils globals orientats al mercat internacional.",
    instalacions: "Showrooms, tallers de moda i espais dinàmics de projectes.",
    networking: "Alta",
    erasmus: "Intercanvi entre les seus del IED i xarxa global."
  },
  {
    id: "lci",
    name: "LCI Barcelona",
    url: "https://www.lcibarcelona.com",
    description: "Escola de Disseny i Arts Visuals. Xarxa educativa internacional amb seu al districte tecnològic.",
    type: "Grau Oficial en Disseny / Arts Plàstiques",
    location: "Poblenou (22@), Barcelona",
    credits: "240 ECTS",
    perfil: "Emprenedors de les indústries creatives i el disseny digital.",
    instalacions: "Nou campus d'avantguarda amb tecnologia d'última generació.",
    networking: "Alta",
    erasmus: "Mobilitat a més de 23 països a través de la xarxa LCI Education."
  },
  {
    id: "esdi",
    name: "ESDi",
    url: "https://esdi.es",
    description: "Escola Superior de Disseny. Pionera en la introducció del disseny universitari a l'estat espanyol.",
    type: "Grau Oficial en Disseny",
    location: "Sabadell, Barcelona",
    credits: "240 ECTS",
    perfil: "Dissenyadors transversals amb domini de les noves tecnologies.",
    instalacions: "Ubicació en una antiga fàbrica tèxtil reformada, tallers especialitzats.",
    networking: "Alta",
    erasmus: "Intercanvis Erasmus+ i programa de pràctiques internacionals."
  }
];
