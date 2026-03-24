// Données tarifaires complètes - Expérience Boudoir Toulouse
// Source : GRILLE TARIFS.csv

const TIERS = [
  { name: "FLIRT", min: 7, max: 14, tagline: "Première découverte" },
  { name: "PIN-UP", min: 15, max: 24, tagline: "L'expérience complète" },
  { name: "SIRÈNE", min: 25, max: 34, tagline: "La collection prestige" },
  { name: "BOMBE", min: 35, max: 52, tagline: "L'expérience ultime" },
];

function getTier(photoCount) {
  return TIERS.find(t => photoCount >= t.min && photoCount <= t.max);
}

// photoSup: coût d'une photo supplémentaire (null = offert ou premier du palier)
// reduction: réduction en € (valeur négative)
const PRICING_NUMERIQUE = {
  7:  { prix: 745,  photoSup: null,  prixParPhoto: null,  reduction: -50,  inclus: "Photos retouchées en HD + Application Boudoir" },
  8:  { prix: 745,  photoSup: null,  prixParPhoto: 93.13, reduction: -140, inclus: "Photos retouchées en HD + Application Boudoir" },
  9:  { prix: 825,  photoSup: 80,    prixParPhoto: 91.67, reduction: -150, inclus: "Photos retouchées en HD + Application Boudoir" },
  10: { prix: 905,  photoSup: 80,    prixParPhoto: 90.50, reduction: -160, inclus: "Photos retouchées en HD + Application Boudoir" },
  11: { prix: 985,  photoSup: 80,    prixParPhoto: 89.55, reduction: -170, inclus: "Photos retouchées en HD + Application Boudoir" },
  12: { prix: 1065, photoSup: 80,    prixParPhoto: 88.75, reduction: -180, inclus: "Photos retouchées en HD + Application Boudoir" },
  13: { prix: 1145, photoSup: 80,    prixParPhoto: 88.08, reduction: -190, inclus: "Photos retouchées en HD + Application Boudoir" },
  14: { prix: 1225, photoSup: 80,    prixParPhoto: 87.50, reduction: -200, inclus: "Photos retouchées en HD + Application Boudoir" },
  15: { prix: 1395, photoSup: null,  prixParPhoto: 82.06, reduction: -100, inclus: "Cadre ART 30x40cm OFFERT + Application Boudoir" },
  16: { prix: 1395, photoSup: null,  prixParPhoto: 82.06, reduction: -100, inclus: "Cadre ART 30x40cm OFFERT + Application Boudoir" },
  17: { prix: 1395, photoSup: null,  prixParPhoto: 82.06, reduction: -170, inclus: "Cadre ART 30x40cm OFFERT + Application Boudoir" },
  18: { prix: 1460, photoSup: 65,    prixParPhoto: 81.11, reduction: -175, inclus: "Cadre ART 30x40cm OFFERT + Application Boudoir" },
  19: { prix: 1525, photoSup: 65,    prixParPhoto: 80.26, reduction: -180, inclus: "Cadre ART 30x40cm OFFERT + Application Boudoir" },
  20: { prix: 1590, photoSup: 65,    prixParPhoto: 79.50, reduction: -185, inclus: "Cadre ART 30x40cm OFFERT + Application Boudoir" },
  21: { prix: 1655, photoSup: 65,    prixParPhoto: 78.81, reduction: -190, inclus: "Cadre ART 30x40cm OFFERT + Application Boudoir" },
  22: { prix: 1720, photoSup: 65,    prixParPhoto: 78.18, reduction: -195, inclus: "Cadre ART 30x40cm OFFERT + Application Boudoir" },
  23: { prix: 1785, photoSup: 65,    prixParPhoto: 77.61, reduction: -200, inclus: "Cadre ART 30x40cm OFFERT + Application Boudoir" },
  24: { prix: 1850, photoSup: 65,    prixParPhoto: 77.08, reduction: -205, inclus: "Cadre ART 30x40cm OFFERT + Application Boudoir" },
  25: { prix: 1915, photoSup: null,  prixParPhoto: 68.39, reduction: -210, inclus: "2 Cadres ART 30x40cm OFFERTS + Application Boudoir" },
  26: { prix: 1915, photoSup: null,  prixParPhoto: 68.39, reduction: -210, inclus: "2 Cadres ART 30x40cm OFFERTS + Application Boudoir" },
  27: { prix: 1915, photoSup: null,  prixParPhoto: 68.39, reduction: -210, inclus: "2 Cadres ART 30x40cm OFFERTS + Application Boudoir" },
  28: { prix: 1915, photoSup: null,  prixParPhoto: 68.39, reduction: -270, inclus: "2 Cadres ART 30x40cm OFFERTS + Application Boudoir" },
  29: { prix: 1965, photoSup: 50,    prixParPhoto: 67.76, reduction: -280, inclus: "2 Cadres ART 30x40cm OFFERTS + Application Boudoir" },
  30: { prix: 2015, photoSup: 50,    prixParPhoto: 67.17, reduction: -290, inclus: "2 Cadres ART 30x40cm OFFERTS + Application Boudoir" },
  31: { prix: 2065, photoSup: 50,    prixParPhoto: 66.61, reduction: -300, inclus: "2 Cadres ART 30x40cm OFFERTS + Application Boudoir" },
  32: { prix: 2115, photoSup: 50,    prixParPhoto: 66.09, reduction: -310, inclus: "2 Cadres ART 30x40cm OFFERTS + Application Boudoir" },
  33: { prix: 2165, photoSup: 50,    prixParPhoto: 65.61, reduction: -320, inclus: "2 Cadres ART 30x40cm OFFERTS + Application Boudoir" },
  34: { prix: 2065, photoSup: 50,    prixParPhoto: 60.74, reduction: -480, inclus: "2 Cadres ART 30x40cm OFFERTS + Application Boudoir" },
  35: { prix: 2200, photoSup: null,  prixParPhoto: 62.86, reduction: -395, inclus: "Toile 60x40cm + 2 Cadres ART 30x40cm OFFERTS + Application Boudoir" },
  36: { prix: 2200, photoSup: null,  prixParPhoto: 61.11, reduction: -395, inclus: "Toile 60x40cm + 2 Cadres ART 30x40cm OFFERTS + Application Boudoir" },
  37: { prix: 2200, photoSup: null,  prixParPhoto: 59.46, reduction: -395, inclus: "Toile 60x40cm + 2 Cadres ART 30x40cm OFFERTS + Application Boudoir" },
  38: { prix: 2200, photoSup: null,  prixParPhoto: 57.89, reduction: -445, inclus: "Toile 60x40cm + 2 Cadres ART 30x40cm OFFERTS + Application Boudoir" },
  39: { prix: 2240, photoSup: 40,    prixParPhoto: 57.44, reduction: -455, inclus: "Toile 60x40cm + 2 Cadres ART 30x40cm OFFERTS + Application Boudoir" },
  40: { prix: 2280, photoSup: 40,    prixParPhoto: 57.00, reduction: -465, inclus: "Toile 60x40cm + 2 Cadres ART 30x40cm OFFERTS + Application Boudoir" },
  41: { prix: 2320, photoSup: 40,    prixParPhoto: 56.59, reduction: -475, inclus: "Toile 60x40cm + 2 Cadres ART 30x40cm OFFERTS + Application Boudoir" },
  42: { prix: 2360, photoSup: 40,    prixParPhoto: 56.19, reduction: -485, inclus: "Toile 60x40cm + 2 Cadres ART 30x40cm OFFERTS + Application Boudoir" },
  43: { prix: 2400, photoSup: 40,    prixParPhoto: 55.81, reduction: null,  inclus: "Toile 60x40cm + 2 Cadres ART 30x40cm OFFERTS + Application Boudoir" },
  44: { prix: 2440, photoSup: 40,    prixParPhoto: 55.45, reduction: -505, inclus: "Toile 60x40cm + 2 Cadres ART 30x40cm OFFERTS + Application Boudoir" },
  45: { prix: 2480, photoSup: 40,    prixParPhoto: 55.11, reduction: null,  inclus: "Toile 60x40cm + 2 Cadres ART 30x40cm OFFERTS + Application Boudoir" },
  46: { prix: 2520, photoSup: 40,    prixParPhoto: 54.78, reduction: null,  inclus: "Toile 60x40cm + 2 Cadres ART 30x40cm OFFERTS + Application Boudoir" },
  47: { prix: 2560, photoSup: 40,    prixParPhoto: 54.47, reduction: null,  inclus: "Toile 60x40cm + 2 Cadres ART 30x40cm OFFERTS + Application Boudoir" },
  48: { prix: 2600, photoSup: 40,    prixParPhoto: 54.17, reduction: null,  inclus: "Toile 60x40cm + 2 Cadres ART 30x40cm OFFERTS + Application Boudoir" },
  49: { prix: 2640, photoSup: 40,    prixParPhoto: 53.88, reduction: null,  inclus: "Toile 60x40cm + 2 Cadres ART 30x40cm OFFERTS + Application Boudoir" },
  50: { prix: 2680, photoSup: 40,    prixParPhoto: 53.60, reduction: null,  inclus: "Toile 60x40cm + 2 Cadres ART 30x40cm OFFERTS + Application Boudoir" },
  51: { prix: 2720, photoSup: 40,    prixParPhoto: 53.33, reduction: null,  inclus: "Toile 60x40cm + 2 Cadres ART 30x40cm OFFERTS + Application Boudoir" },
  52: { prix: 2760, photoSup: 40,    prixParPhoto: 53.08, reduction: null,  inclus: "Toile 60x40cm + 2 Cadres ART 30x40cm OFFERTS + Application Boudoir" },
};

const PRICING_PRODUITS = {
  7:  { prix: 795,  photoSup: null,  prixParPhoto: 113.57, inclus: "Boîte Héritage 13x18cm" },
  8:  { prix: 885,  photoSup: 90,    prixParPhoto: 110.63, inclus: "Boîte Héritage 13x18cm" },
  9:  { prix: 975,  photoSup: 90,    prixParPhoto: 108.33, inclus: "Boîte Héritage 13x18cm" },
  10: { prix: 1065, photoSup: 90,    prixParPhoto: 106.50, inclus: "Boîte Héritage 13x18cm" },
  11: { prix: 1155, photoSup: 90,    prixParPhoto: 105.00, inclus: "Boîte Héritage 13x18cm" },
  12: { prix: 1245, photoSup: 90,    prixParPhoto: 103.75, inclus: "Boîte Héritage 13x18cm" },
  13: { prix: 1335, photoSup: 90,    prixParPhoto: 102.69, inclus: "Boîte Héritage 13x18cm" },
  14: { prix: 1425, photoSup: 90,    prixParPhoto: 101.79, inclus: "Boîte Héritage 13x18cm" },
  15: { prix: 1495, photoSup: null,  prixParPhoto: 93.44, inclus: "Boîte Héritage 15x21cm / Album Luxe + Cadre ART OFFERT + Application Mobile" },
  16: { prix: 1495, photoSup: null,  prixParPhoto: 93.44, inclus: "Boîte Héritage 15x21cm / Album Luxe + Cadre ART OFFERT + Application Mobile" },
  17: { prix: 1565, photoSup: 70,    prixParPhoto: 92.06, inclus: "Boîte Héritage 15x21cm / Album Luxe + Cadre ART OFFERT + Application Mobile" },
  18: { prix: 1635, photoSup: 70,    prixParPhoto: 90.83, inclus: "Boîte Héritage 15x21cm / Album Luxe + Cadre ART OFFERT + Application Mobile" },
  19: { prix: 1705, photoSup: 70,    prixParPhoto: 89.74, inclus: "Album Luxe + Cadre ART OFFERT + Application Mobile" },
  20: { prix: 1775, photoSup: 70,    prixParPhoto: 88.75, inclus: "Album Luxe + Cadre ART OFFERT + Application Mobile" },
  21: { prix: 1845, photoSup: 70,    prixParPhoto: 87.86, inclus: "Album Luxe + Cadre ART OFFERT + Application Mobile" },
  22: { prix: 1915, photoSup: 70,    prixParPhoto: 87.05, inclus: "Album Luxe + Cadre ART OFFERT + Application Mobile" },
  23: { prix: 1985, photoSup: 70,    prixParPhoto: 86.30, inclus: "Album Luxe + Cadre ART OFFERT + Application Mobile" },
  24: { prix: 2055, photoSup: 70,    prixParPhoto: 85.63, inclus: "Album Luxe + Cadre ART OFFERT + Application Mobile" },
  25: { prix: 2125, photoSup: null,  prixParPhoto: 78.70, inclus: "Album Luxe Couverture Acrylique + 2 Cadres ART OFFERTS + Application Mobile" },
  26: { prix: 2125, photoSup: null,  prixParPhoto: 78.70, inclus: "Album Luxe Couverture Acrylique + 2 Cadres ART OFFERTS + Application Mobile" },
  27: { prix: 2125, photoSup: null,  prixParPhoto: 78.70, inclus: "Album Luxe Couverture Acrylique + 2 Cadres ART OFFERTS + Application Mobile" },
  28: { prix: 2185, photoSup: 60,    prixParPhoto: 78.04, inclus: "Album Luxe Couverture Acrylique + 2 Cadres ART OFFERTS + Application Mobile" },
  29: { prix: 2245, photoSup: 60,    prixParPhoto: 77.41, inclus: "Album Luxe Couverture Acrylique + 2 Cadres ART OFFERTS + Application Mobile" },
  30: { prix: 2305, photoSup: 60,    prixParPhoto: 76.83, inclus: "Album Luxe Couverture Acrylique + 2 Cadres ART OFFERTS + Application Mobile" },
  31: { prix: 2365, photoSup: 60,    prixParPhoto: 76.29, inclus: "Album Luxe Couverture Acrylique + 2 Cadres ART OFFERTS + Application Mobile" },
  32: { prix: 2425, photoSup: 60,    prixParPhoto: 75.78, inclus: "Album Luxe Couverture Acrylique + 2 Cadres ART OFFERTS + Application Mobile" },
  33: { prix: 2485, photoSup: 60,    prixParPhoto: 75.30, inclus: "Album Luxe Couverture Acrylique + 2 Cadres ART OFFERTS + Application Mobile" },
  34: { prix: 2545, photoSup: 60,    prixParPhoto: 74.85, inclus: "Album Luxe Couverture Acrylique + 2 Cadres ART OFFERTS + Application Mobile" },
  35: { prix: 2595, photoSup: null,  prixParPhoto: 74.14, inclus: "Album Luxe Couverture Acrylique + Toile 60x40cm + 2 Cadres ART OFFERTS + Application Mobile" },
  36: { prix: 2595, photoSup: null,  prixParPhoto: 72.08, inclus: "Album Luxe Couverture Acrylique + Toile 60x40cm + 2 Cadres ART OFFERTS + Application Mobile" },
  37: { prix: 2595, photoSup: null,  prixParPhoto: 70.14, inclus: "Album Luxe Couverture Acrylique + Toile 60x40cm + 2 Cadres ART OFFERTS + Application Mobile" },
  38: { prix: 2645, photoSup: 50,    prixParPhoto: 69.61, inclus: "Album Luxe Couverture Acrylique + Toile 60x40cm + 2 Cadres ART OFFERTS + Application Mobile" },
  39: { prix: 2695, photoSup: 50,    prixParPhoto: 69.10, inclus: "Album Luxe Couverture Acrylique + Toile 60x40cm + 2 Cadres ART OFFERTS + Application Mobile" },
  40: { prix: 2745, photoSup: 50,    prixParPhoto: 68.63, inclus: "Album Luxe Couverture Acrylique + Toile 60x40cm + 2 Cadres ART OFFERTS + Application Mobile" },
  41: { prix: 2795, photoSup: 50,    prixParPhoto: 68.17, inclus: "Album Luxe Couverture Acrylique + Toile 60x40cm + 2 Cadres ART OFFERTS + Application Mobile" },
  42: { prix: 2845, photoSup: 50,    prixParPhoto: 67.74, inclus: "Album Luxe Couverture Acrylique + Toile 60x40cm + 2 Cadres ART OFFERTS + Application Mobile" },
  43: { prix: 2895, photoSup: 50,    prixParPhoto: 67.33, inclus: "Album Luxe Couverture Acrylique + Toile 60x40cm + 2 Cadres ART OFFERTS + Application Mobile" },
  44: { prix: 2945, photoSup: 50,    prixParPhoto: 66.93, inclus: "Album Luxe Couverture Acrylique + Toile 60x40cm + 2 Cadres ART OFFERTS + Application Mobile" },
};

// Nombre de photos offertes à chaque transition de palier
function getFreePhotos(photoCount, formula) {
  const freeRanges = {
    numerique: { 15: 3, 16: 2, 17: 1, 25: 4, 26: 3, 27: 2, 28: 1, 35: 4, 36: 3, 37: 2, 38: 1 },
    produits:  { 15: 2, 16: 1, 25: 3, 26: 2, 27: 1, 35: 3, 36: 2, 37: 1 },
  };
  return freeRanges[formula]?.[photoCount] || 0;
}
