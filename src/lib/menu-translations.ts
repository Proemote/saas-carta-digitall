/** Traducciones EN/FR/DE de la carta, con clave = texto en español tal como
 *  está en la BD (y en el fallback local, que es su espejo).
 *
 *  Prioridad al renderizar (ver i18n.ts): columna de BD (name_en) si existe →
 *  este diccionario → español. Los nombres propios (vinos, marcas, refrescos)
 *  no se traducen y simplemente no aparecen aquí.
 */

export type Translated = { en?: string; fr?: string; de?: string };

export const CATEGORY_T: Record<string, Translated> = {
  "Para Empezar": { en: "To Start", fr: "Pour commencer", de: "Zum Anfang" },
  "Papelones Chacinas": { en: "Cured Meats", fr: "Charcuterie", de: "Wurst & Schinken" },
  "Caprichos": { en: "Little Treats", fr: "Petits plaisirs", de: "Kleine Köstlichkeiten" },
  "Nuestros Tartar": { en: "Our Tartare", fr: "Nos tartares", de: "Unsere Tatars" },
  "De Almadraba": { en: "Almadraba Tuna", fr: "Thon d'almadraba", de: "Almadraba-Thunfisch" },
  "Nuestras Tostas": { en: "Our Toasts", fr: "Nos tartines", de: "Unsere Röstbrote" },
  "Montaditos": { en: "Small Sandwiches", fr: "Montaditos (petits sandwichs)", de: "Montaditos (kleine Brötchen)" },
  "Guisos": { en: "Stews", fr: "Plats mijotés", de: "Eintöpfe & Schmorgerichte" },
  "Nuestras Carnes": { en: "Our Meats", fr: "Nos viandes", de: "Unsere Fleischgerichte" },
  "Nuestros Pescados": { en: "Our Fish", fr: "Nos poissons", de: "Unsere Fischgerichte" },
  "Postres": { en: "Desserts", fr: "Desserts", de: "Nachspeisen" },
  "Nuestras Bebidas": { en: "Our Drinks", fr: "Nos boissons", de: "Unsere Getränke" },
  "Carta de Vinos": { en: "Wine List", fr: "Carte des vins", de: "Weinkarte" },
  "Cervezas Cruzcampo": { en: "Cruzcampo Beers", fr: "Bières Cruzcampo", de: "Cruzcampo-Biere" },
  "Copas de Vinos": { en: "Wines by the Glass", fr: "Vins au verre", de: "Weine im Glas" },
  "Refrescos": { en: "Soft Drinks", fr: "Boissons fraîches", de: "Erfrischungsgetränke" },
  "Vinos de la Tierra por Copas — Bodega César Florido (Chipiona)": {
    en: "Local Wines by the Glass — Bodega César Florido (Chipiona)",
    fr: "Vins du terroir au verre — Bodega César Florido (Chipiona)",
    de: "Landweine im Glas — Bodega César Florido (Chipiona)",
  },
  "Vinos Tintos por Botellas": { en: "Red Wines by the Bottle", fr: "Vins rouges en bouteille", de: "Rotweine (Flasche)" },
  "Vinos Blancos por Botellas": { en: "White Wines by the Bottle", fr: "Vins blancs en bouteille", de: "Weißweine (Flasche)" },
  "Copas y Licores": { en: "Spirits & Liqueurs", fr: "Spiritueux et liqueurs", de: "Spirituosen & Liköre" },
};

export const PRODUCT_T: Record<string, Translated> = {
  // ── Para Empezar ──
  "Tomate con Lomo Atún": { en: "Tomato with Tuna Loin", fr: "Tomate au filet de thon", de: "Tomate mit Thunfischfilet" },
  "Aceitunas": { en: "Olives", fr: "Olives", de: "Oliven" },
  "Torreznos de Soria": { en: "Soria-Style Crispy Pork Belly", fr: "Torreznos de Soria (lard croustillant)", de: "Torreznos aus Soria (knuspriger Schweinebauch)" },
  "Ensalada de Ahumados": { en: "Smoked Fish Salad", fr: "Salade de poissons fumés", de: "Salat mit Räucherfisch" },
  "Pimientada de Atún": { en: "Tuna with Roasted Peppers", fr: "Poivronnade au thon", de: "Geröstete Paprika mit Thunfisch" },
  "Paté de Ciervo y Pasas": { en: "Venison & Raisin Pâté", fr: "Pâté de cerf aux raisins secs", de: "Hirschpastete mit Rosinen" },
  "Paté de Queso Azul y Cebolla": { en: "Blue Cheese & Onion Pâté", fr: "Pâté de fromage bleu à l'oignon", de: "Blauschimmelkäse-Zwiebel-Pastete" },
  "Papas Arrugadas": { en: "Canarian Wrinkled Potatoes", fr: "Pommes de terre « arrugadas » des Canaries", de: "Kanarische Runzelkartoffeln" },
  "Ensaladilla de la Casa": { en: "House Potato Salad", fr: "Salade russe maison", de: "Hausgemachte Ensaladilla (Kartoffelsalat)" },
  "Patatas Aliñadas con Lomo de Atún": { en: "Dressed Potatoes with Tuna Loin", fr: "Pommes de terre marinées au filet de thon", de: "Marinierte Kartoffeln mit Thunfischfilet" },
  // ── Papelones Chacinas ──
  "Jamón Bellota": { en: "Acorn-Fed Ibérico Ham", fr: "Jambon ibérique « bellota »", de: "Eichel-Ibérico-Schinken" },
  "Caña de Lomo Bellota": { en: "Acorn-Fed Ibérico Cured Loin", fr: "Filet de porc ibérique « bellota » séché", de: "Eichel-Ibérico-Lomo (luftgetrocknet)" },
  "Taquitos de Jamón": { en: "Diced Ham", fr: "Dés de jambon", de: "Schinkenwürfel" },
  "Salchichón": { en: "Salchichón (Cured Sausage)", fr: "Saucisson espagnol", de: "Salchichón (spanische Salami)" },
  "Morcilla de Hígado": { en: "Liver Black Pudding", fr: "Boudin de foie", de: "Leber-Morcilla (Leberwurst)" },
  "Queso Oveja Viejo": { en: "Aged Sheep's Cheese", fr: "Fromage de brebis affiné", de: "Gereifter Schafskäse" },
  // ── Caprichos ──
  "Pata de Pulpo": { en: "Octopus Leg", fr: "Tentacule de poulpe", de: "Oktopus-Arm" },
  "Boquerones en Vinagre": { en: "Anchovies in Vinegar", fr: "Anchois marinés au vinaigre", de: "In Essig eingelegte Sardellen" },
  "Anchoas del Cantábrico": { en: "Cantabrian Anchovies", fr: "Anchois de Cantabrie", de: "Kantabrische Anchovis" },
  "Gildas Anchoas": { en: "Anchovy Gilda Skewers", fr: "Gildas aux anchois (brochettes)", de: "Gilda-Spieße mit Anchovis" },
  "Gildas de Boquerón": { en: "Marinated Anchovy Gilda Skewers", fr: "Gildas aux anchois marinés", de: "Gilda-Spieße mit eingelegten Sardellen" },
  "Gildas de Sushi Cecina Huevo": { en: "Sushi-Style Gilda with Cured Beef & Egg", fr: "Gilda façon sushi, cecina et œuf", de: "Sushi-Gilda mit Cecina und Ei" },
  // ── Nuestros Tartar ──
  "Tartar de Atún Rojo de Almadraba": { en: "Almadraba Bluefin Tuna Tartare", fr: "Tartare de thon rouge d'almadraba", de: "Tatar vom Roten Thun (Almadraba)" },
  "Tartar de Salmón": { en: "Salmon Tartare", fr: "Tartare de saumon", de: "Lachstatar" },
  "Steak Tartar": { en: "Steak Tartare", fr: "Steak tartare", de: "Steak Tatar" },
  // ── De Almadraba ──
  "Tarantelo": { en: "Tarantelo (Prime Tuna Cut)", fr: "Tarantelo (coupe noble du thon)", de: "Tarantelo (edles Thunfischstück)" },
  "Solomillo de Atún Almadraba": { en: "Almadraba Tuna Tenderloin", fr: "Filet de thon d'almadraba", de: "Thunfischfilet (Almadraba)" },
  "Mojama de Almadraba": { en: "Mojama (Salt-Cured Tuna)", fr: "Mojama (thon séché salé)", de: "Mojama (gesalzener Trockenthunfisch)" },
  // ── Nuestras Tostas ──
  "Sardinas Anchoadas y Queso Viejo": { en: "Anchovy-Style Sardines & Aged Cheese", fr: "Sardines anchoitées et fromage affiné", de: "Sardinen nach Anchovis-Art mit gereiftem Käse" },
  "Rulo de Cabra con Miel y Nueces": { en: "Goat Cheese with Honey & Walnuts", fr: "Fromage de chèvre au miel et aux noix", de: "Ziegenkäse mit Honig und Walnüssen" },
  "Boquerón Aguacate": { en: "Marinated Anchovy & Avocado", fr: "Anchois marinés et avocat", de: "Eingelegte Sardellen mit Avocado" },
  "Salmón Aguacate": { en: "Salmon & Avocado", fr: "Saumon et avocat", de: "Lachs mit Avocado" },
  "Gulas con Salmorejo": { en: "Gulas (Eel-Style Surimi) with Salmorejo", fr: "Gulas (surimi d'anguille) au salmorejo", de: "Gulas (Surimi-Aal) mit Salmorejo" },
  "Bacalao con Salmorejo": { en: "Cod with Salmorejo", fr: "Morue au salmorejo", de: "Kabeljau mit Salmorejo" },
  "Sardina Anchoadas Aguacate": { en: "Anchovy-Style Sardines & Avocado", fr: "Sardines anchoitées et avocat", de: "Sardinen nach Anchovis-Art mit Avocado" },
  "Ahumados Aguacate": { en: "Smoked Fish & Avocado", fr: "Poissons fumés et avocat", de: "Räucherfisch mit Avocado" },
  "Rulo de Cabra con Arándanos": { en: "Goat Cheese with Blueberries", fr: "Fromage de chèvre aux myrtilles", de: "Ziegenkäse mit Heidelbeeren" },
  // ── Montaditos ──
  "Mini Hamburguesa": { en: "Mini Burger", fr: "Mini-burger", de: "Mini-Burger" },
  "Solomillo al Whisky": { en: "Pork Tenderloin in Whisky Sauce", fr: "Filet mignon sauce whisky", de: "Schweinefilet in Whisky-Sauce" },
  "Melva con Pimientos Morrones": { en: "Frigate Tuna with Roasted Red Peppers", fr: "Melva (thon) aux poivrons rouges", de: "Melva-Thunfisch mit gerösteter Paprika" },
  "Chorizo Picante": { en: "Spicy Chorizo", fr: "Chorizo piquant", de: "Scharfe Chorizo" },
  "Salmón con Philadelphia": { en: "Salmon with Cream Cheese", fr: "Saumon au fromage frais", de: "Lachs mit Frischkäse" },
  "Pringa": { en: "Pringa (Slow-Cooked Meat Spread)", fr: "Pringa (effiloché de viandes)", de: "Pringa (geschmortes Fleisch)" },
  // ── Guisos ──
  "Atún al Pedro Jiménez": { en: "Tuna in Pedro Ximénez Sauce", fr: "Thon au Pedro Ximénez", de: "Thunfisch in Pedro-Ximénez-Sauce" },
  "Atún Encebollado": { en: "Tuna with Caramelized Onions", fr: "Thon aux oignons", de: "Thunfisch mit Zwiebeln" },
  "Fabada Asturiana": { en: "Asturian Bean Stew", fr: "Fabada asturienne (haricots mijotés)", de: "Asturischer Bohneneintopf" },
  "Carrillada": { en: "Braised Pork Cheeks", fr: "Joue de porc braisée", de: "Geschmorte Schweinebäckchen" },
  "Albóndigas de Chocos": { en: "Cuttlefish Meatballs", fr: "Boulettes de seiche", de: "Tintenfischbällchen" },
  // ── Nuestras Carnes ──
  "Lomo Bajo 300gr aprox.": { en: "Striploin Steak (approx. 300 g)", fr: "Faux-filet (env. 300 g)", de: "Roastbeef-Steak (ca. 300 g)" },
  "Lomo Alto 400gr aprox.": { en: "Ribeye Steak (approx. 400 g)", fr: "Entrecôte (env. 400 g)", de: "Entrecôte (ca. 400 g)" },
  "Solomillo Ternera 200gr aprox.": { en: "Beef Tenderloin (approx. 200 g)", fr: "Filet de bœuf (env. 200 g)", de: "Rinderfilet (ca. 200 g)" },
  "Presa Ibérica": { en: "Presa Ibérica (Ibérico Shoulder Steak)", fr: "Presa ibérique", de: "Presa Ibérica (Ibérico-Steak)" },
  "Solomillo de Cerdo": { en: "Pork Tenderloin", fr: "Filet mignon de porc", de: "Schweinefilet" },
  "Costillas Salsa Barbacoa": { en: "Ribs in Barbecue Sauce", fr: "Travers de porc sauce barbecue", de: "Rippchen in Barbecue-Sauce" },
  "Brocheta de Solomillo": { en: "Tenderloin Skewer", fr: "Brochette de filet", de: "Filetspieß" },
  "Churrasco de Pollo": { en: "Grilled Chicken (Churrasco)", fr: "Churrasco de poulet", de: "Gegrilltes Hähnchen (Churrasco)" },
  // ── Nuestros Pescados ──
  "Bacalao bañado en salsa gourmet": { en: "Cod in Gourmet Sauce", fr: "Morue nappée de sauce gourmet", de: "Kabeljau in Gourmetsauce" },
  "Salmón": { en: "Salmon", fr: "Saumon", de: "Lachs" },
  // ── Postres ──
  "Tarta": { en: "Cake", fr: "Gâteau", de: "Torte" },
  "Pionono": { en: "Pionono (Cream Pastry)", fr: "Pionono (pâtisserie à la crème)", de: "Pionono (Sahnegebäck)" },
  // ── Cervezas ──
  "Copa": { en: "Glass", fr: "Verre", de: "Glas" },
  "Cortada": { en: "Small Glass", fr: "Petit verre", de: "Kleines Glas" },
  "Maceta": { en: "Large Glass (Maceta)", fr: "Grand verre (maceta)", de: "Großes Glas (Maceta)" },
  "Botellín": { en: "Small Bottle (20 cl)", fr: "Petite bouteille (20 cl)", de: "Kleine Flasche (0,2 l)" },
  "Tercio": { en: "Bottle (33 cl)", fr: "Bouteille (33 cl)", de: "Flasche (0,33 l)" },
  "Sin Gluten": { en: "Gluten-Free Beer", fr: "Bière sans gluten", de: "Glutenfreies Bier" },
  // ── Copas de vino ──
  "Semidulce": { en: "Semi-Sweet Wine", fr: "Vin demi-doux", de: "Lieblicher Wein" },
  "Frizante": { en: "Frizzante (Lightly Sparkling)", fr: "Vin pétillant (frizzante)", de: "Perlwein (Frizzante)" },
  "Tintos de Verano": { en: "Tinto de Verano (Red Wine & Lemon Soda)", fr: "Tinto de verano (vin rouge-limonade)", de: "Tinto de Verano (Rotwein mit Limonade)" },
  // ── Refrescos ──
  "Naranja": { en: "Orange Soda", fr: "Soda à l'orange", de: "Orangenlimonade" },
  "Limón": { en: "Lemon Soda", fr: "Soda au citron", de: "Zitronenlimonade" },
  "Zumos": { en: "Juices", fr: "Jus de fruits", de: "Fruchtsäfte" },
  "Agua con/sin gas": { en: "Sparkling / Still Water", fr: "Eau gazeuse ou plate", de: "Wasser mit/ohne Kohlensäure" },
  "Casera Blanca": { en: "Casera (Lemon Soda)", fr: "Casera (limonade)", de: "Casera (Limonade)" },
  // ── Vinos de la tierra ──
  "Vermut": { en: "Vermouth", fr: "Vermouth", de: "Wermut" },
  // ── Vinos por botellas ──
  "Vino de la Casa": { en: "House Wine", fr: "Vin de la maison", de: "Hauswein" },
  // ── Copas y licores ──
  "Combinados": { en: "Mixed Drinks", fr: "Cocktails (alcool + soda)", de: "Longdrinks" },
  "Combinados Prémium": { en: "Premium Mixed Drinks", fr: "Cocktails premium", de: "Premium-Longdrinks" },
  "Licores": { en: "Liqueurs", fr: "Liqueurs", de: "Liköre" },
};

/** Descripciones de producto (las D.O. de vinos se dejan tal cual). */
export const DESCRIPTION_T: Record<string, Translated> = {
  "21 días de maduración": { en: "21-day dry-aged", fr: "Maturation de 21 jours", de: "21 Tage gereift" },
  "Consultar": { en: "Ask our staff", fr: "Demandez à notre équipe", de: "Bitte Personal fragen" },
};
