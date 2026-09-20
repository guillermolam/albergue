/**
 * Vía de la Plata (Sevilla -> Granja de Moreruela), the Camino de Santiago
 * route that passes directly through El Carrascalejo (stage 11).
 *
 * Stats and stage boundaries sourced from semtayr.es's official stage guide
 * (https://www.semtayr.es/en/via-de-la-plata-camino-mozarabe-santiago).
 * Descriptions here are original short summaries, not reproductions of that
 * site's text -- only the 7 stages this hostel could independently confirm
 * (source-read, not fabricated) have a summary; the rest show stats only
 * with a link out to the full semtayr.es stage guide.
 *
 * Coordinates are real geocoded values (OpenStreetMap Nominatim, same
 * approach as domain_model/seed/geocode.mjs), not estimated.
 */

export interface ViaPlataStage {
  stage: string;
  from: string;
  to: string;
  toCoords: [number, number];
  km: number;
  villages: number;
  hosting: number;
  /** Slug on semtayr.es/en/<slug> for the full official stage guide. */
  slug: string;
  /** Short original summary -- only present for source-verified stages. */
  summary?: string;
  /** This stage passes through El Carrascalejo itself. */
  passesCarrascalejo?: boolean;
  isVariant?: boolean;
}

export const VIA_PLATA_ROUTE_STATS = {
  stages: 24,
  distanceKm: 610.99,
  villages: 52,
  from: 'Sevilla',
  to: 'Granja de Moreruela',
};

export const VIA_PLATA_STAGES: ViaPlataStage[] = [
  {
    stage: '01',
    from: 'Sevilla',
    to: 'Guillena',
    toCoords: [37.5464709, -6.057052],
    km: 22.49,
    villages: 4,
    hosting: 10,
    slug: 'sevilla-guillena',
    summary:
      'Sale de la Catedral de Sevilla, cruza el Guadalquivir y pasa por el yacimiento romano de Itálica antes de llegar a Guillena entre trigales y olivares.',
  },
  {
    stage: '02',
    from: 'Guillena',
    to: 'Castilblanco de los Arroyos',
    toCoords: [37.6750431, -5.9889206],
    km: 18.71,
    villages: 2,
    hosting: 16,
    slug: 'guillena-castiblanco-de-los-arroyos',
  },
  {
    stage: '03',
    from: 'Castilblanco de los Arroyos',
    to: 'Almadén de la Plata',
    toCoords: [37.8736407, -6.0804954],
    km: 28.54,
    villages: 2,
    hosting: 10,
    slug: 'castiblanco-de-los-arroyos-almaden-de-la-plata',
  },
  {
    stage: '04',
    from: 'Almadén de la Plata',
    to: 'El Real de la Jara',
    toCoords: [37.9494108, -6.1511261],
    km: 14.35,
    villages: 2,
    hosting: 11,
    slug: 'almaden-de-la-plata-el-real-de-la-jara',
  },
  {
    stage: '05',
    from: 'El Real de la Jara',
    to: 'Monesterio',
    toCoords: [38.0876314, -6.2732538],
    km: 19.69,
    villages: 2,
    hosting: 15,
    slug: 'el-real-de-la-jara-monesterio',
  },
  {
    stage: '06',
    from: 'Monesterio',
    to: 'Fuente de Cantos',
    toCoords: [38.2461377, -6.3074274],
    km: 20.52,
    villages: 2,
    hosting: 13,
    slug: 'monesterio-fuente-de-cantos',
  },
  {
    stage: '07',
    from: 'Fuente de Cantos',
    to: 'Zafra',
    toCoords: [38.4253489, -6.4193627],
    km: 24.51,
    villages: 4,
    hosting: 27,
    slug: 'fuente-de-cantos-zafra',
  },
  {
    stage: '08',
    from: 'Zafra',
    to: 'Villafranca de los Barros',
    toCoords: [38.5613352, -6.3392388],
    km: 19.47,
    villages: 3,
    hosting: 17,
    slug: 'zafra-villafranca-de-los-barros',
  },
  {
    stage: '09',
    from: 'Villafranca de los Barros',
    to: 'Torremejía',
    toCoords: [38.7896931, -6.3763014],
    km: 26.87,
    villages: 2,
    hosting: 0,
    slug: 'villafranca-de-los-barros-torremejia',
    summary:
      'Discurre entre olivares y viñedos junto a la antigua vía romana, con un desvío opcional a las bodegas de Almendralejo, hasta Torremejía.',
  },
  {
    stage: '10',
    from: 'Torremejía',
    to: 'Mérida',
    toCoords: [38.9543062, -6.3504832],
    km: 14.84,
    villages: 2,
    hosting: 0,
    slug: 'torremejia-merida',
    summary:
      'Cruza el Puente Romano sobre el Guadiana, el más largo del Imperio, para entrar en Mérida: Teatro y Anfiteatro Romano, Templo de Diana, Arco de Trajano y el Acueducto de los Milagros.',
  },
  {
    stage: '11',
    from: 'Mérida',
    to: 'Alcuéscar',
    toCoords: [39.1801212, -6.2284451],
    km: 36.61,
    villages: 4,
    hosting: 15,
    slug: 'merida-alcuescar',
    passesCarrascalejo: true,
    summary:
      'La etapa que pasa por El Carrascalejo: tras el embalse romano de Proserpina, el camino atraviesa encinas y alcornoques hasta nuestro pueblo, sigue a Aljucén y cruza la Reserva Natural de Cornalvo hasta Alcuéscar.',
  },
  {
    stage: '12',
    from: 'Alcuéscar',
    to: 'Valdesalor',
    toCoords: [39.378893, -6.3494706],
    km: 25.78,
    villages: 4,
    hosting: 12,
    slug: 'alcuescar-valdesalor',
    summary:
      'Pasa por Casas de Don Antonio y su puente romano sobre el Ayuela, Aldea del Cano y el puente romano del río Salor, hasta Valdesalor.',
  },
  {
    stage: '13',
    from: 'Valdesalor',
    to: 'Casar de Cáceres',
    toCoords: [39.5614765, -6.4171236],
    km: 22.97,
    villages: 3,
    hosting: 4,
    slug: 'valdesalor-casar-de-caceres',
    summary:
      'Entra en Cáceres, Patrimonio de la Humanidad y cuna de la Orden de Santiago, antes de continuar hacia Casar de Cáceres, famoso por su torta de queso.',
  },
  {
    stage: '14',
    from: 'Casar de Cáceres',
    to: 'Cañaveral',
    toCoords: [39.7897226, -6.3933113],
    km: 33.54,
    villages: 2,
    hosting: 4,
    slug: 'casar-de-caceres-canaveral',
  },
  {
    stage: '15',
    from: 'Cañaveral',
    to: 'Galisteo',
    toCoords: [39.9759838, -6.2677508],
    km: 26.78,
    villages: 2,
    hosting: 7,
    slug: 'canaveral-galisteo',
  },
  {
    stage: '16',
    from: 'Galisteo',
    to: 'Oliva de Plasencia',
    toCoords: [40.1119485, -6.0860042],
    km: 29.46,
    villages: 4,
    hosting: 16,
    slug: 'galisteo-oliva-de-plasencia',
  },
  {
    stage: '17',
    from: 'Oliva de Plasencia',
    to: 'Aldeanueva del Camino',
    toCoords: [40.2590411, -5.9297208],
    km: 25.87,
    villages: 2,
    hosting: 12,
    slug: 'oliva-de-plasencia-aldeanueva-del-camino',
  },
  {
    stage: '18',
    from: 'Aldeanueva del Camino',
    to: 'La Calzada de Béjar',
    toCoords: [40.4115886, -5.8182628],
    km: 22.28,
    villages: 3,
    hosting: 87,
    slug: 'aldeanueva-del-camino-la-calzada-de-bejar',
  },
  {
    stage: '19',
    from: 'La Calzada de Béjar',
    to: 'Fuenterroble de Salvatierra',
    toCoords: [40.5640872, -5.7338898],
    km: 19.73,
    villages: 4,
    hosting: 14,
    slug: 'la-calzada-de-bejar-fuenterroble-de-salvatierra',
  },
  {
    stage: '20',
    from: 'Fuenterroble de Salvatierra',
    to: 'San Pedro de Rozados',
    toCoords: [40.790471, -5.7381386],
    km: 27.86,
    villages: 2,
    hosting: 5,
    slug: 'fuenterroble-de-salvatierra-san-pedro-de-rozados',
  },
  {
    stage: '21',
    from: 'San Pedro de Rozados',
    to: 'Salamanca',
    toCoords: [40.9651572, -5.6640182],
    km: 23.44,
    villages: 4,
    hosting: 7,
    slug: 'san-pedro-de-rozados-salamanca',
  },
  {
    stage: '22',
    from: 'Salamanca',
    to: 'El Cubo de Tierra del Vino',
    toCoords: [41.2230409, -5.7429307],
    km: 34.7,
    villages: 5,
    hosting: 7,
    slug: 'salamanca-el-cubo-del-tierra-del-vino',
  },
  {
    stage: '23',
    from: 'El Cubo de Tierra del Vino',
    to: 'Zamora',
    toCoords: [41.6857693, -5.942315],
    km: 31.4,
    villages: 4,
    hosting: 7,
    slug: 'el-cubo-del-tierra-del-vino-zamora',
  },
  {
    stage: '24',
    from: 'Zamora',
    to: 'Granja de Moreruela',
    toCoords: [41.8127551, -5.7450243],
    km: 40.6,
    villages: 6,
    hosting: 17,
    slug: 'zamora-granja-de-moreruela',
    summary:
      'Pasa por Montamarta y la iglesia visigoda de San Pedro de la Nave, las ruinas del castillo de Castrotorafe y Riego del Camino, hasta Granja de Moreruela, donde nace el Camino Sanabrés.',
  },
];

/** El Carrascalejo's own marker on the route map -- a village within stage 11, not a stage endpoint. */
export const EL_CARRASCALEJO_COORDS: [number, number] = [39.0223673, -6.3371905];

export interface ExternalResource {
  title: string;
  description: string;
  url: string;
  domain: string;
}

export const EXTERNAL_RESOURCES: ExternalResource[] = [
  {
    title: 'Turismo Mérida',
    description:
      'Guía oficial de turismo de Mérida, Patrimonio de la Humanidad y capital de Extremadura.',
    url: 'https://turismomerida.org/',
    domain: 'turismomerida.org',
  },
  {
    title: 'Turismo Extremadura · Mérida',
    description: 'Ficha oficial de la Junta de Extremadura sobre Mérida y sus monumentos romanos.',
    url: 'https://www.turismoextremadura.com/viajar/turismo/es/explora/Merida/',
    domain: 'turismoextremadura.com',
  },
  {
    title: 'Ruta de la Plata',
    description:
      'Portal oficial de la Ruta Vía de la Plata: etapas, patrimonio y recursos para el peregrino.',
    url: 'https://rutadelaplata.com/',
    domain: 'rutadelaplata.com',
  },
];

export const APP_LINKS = {
  android: 'https://play.google.com/store/apps/details?id=com.beoneapps.rutadelaplata&pli=1',
  ios: 'https://apps.apple.com/es/app/ruta-v%C3%ADa-de-la-plata/id1612787897',
};
