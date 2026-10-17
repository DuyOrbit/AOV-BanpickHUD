const fs = require('fs');
const path = require('path');

const garenaHeroes = [
  {"name": "Dyadia"}, {"name": "Edras"}, {"name": "Goverra"}, {"name": "Heino"}, {"name": "Billow"},
  {"name": "Bolt Baron"}, {"name": "Biron"}, {"name": "Dolia"}, {"name": "Charlotte"}, {"name": "Tachi"},
  {"name": "Dirak"}, {"name": "Qi"}, {"name": "Erin"}, {"name": "Ming"}, {"name": "Bijan"},
  {"name": "Bonnie"}, {"name": "Teeri"}, {"name": "Yue"}, {"name": "Yan"}, {"name": "Aya"},
  {"name": "Aoi"}, {"name": "Iggy"}, {"name": "Bright"}, {"name": "Lorion"}, {"name": "Dextra"},
  {"name": "Sinestrea"}, {"name": "Thorne"}, {"name": "Allain"}, {"name": "Zata"}, {"name": "Rouie"},
  {"name": "Laville"}, {"name": "Paine"}, {"name": "Ata"}, {"name": "Keera"}, {"name": "Ishar"},
  {"name": "Eland’orr"}, {"name": "Krizzix"}, {"name": "Volkath"}, {"name": "Celica"}, {"name": "Zip"},
  {"name": "Enzo"}, {"name": "Yena"}, {"name": "Errol"}, {"name": "Capheny"}, {"name": "Hayate"},
  {"name": "D’Arcy"}, {"name": "Veres"}, {"name": "Florentino"}, {"name": "Sephera"}, {"name": "Quillen"},
  {"name": "Wiro"}, {"name": "Richter"}, {"name": "Elsu"}, {"name": "Y’bneth"}, {"name": "Amily"},
  {"name": "Annette"}, {"name": "Baldum"}, {"name": "Roxie"}, {"name": "Marja"}, {"name": "Rourke"},
  {"name": "Arum"}, {"name": "Wisp"}, {"name": "The Flash"}, {"name": "Max"}, {"name": "Liliana"},
  {"name": "Tulen"}, {"name": "Omen"}, {"name": "Lindis"}, {"name": "TeeMee"}, {"name": "Moren"},
  {"name": "Kil’Groth"}, {"name": "Xeniel"}, {"name": "Wonder Woman"}, {"name": "Superman"}, {"name": "Tel’Annas"},
  {"name": "Astrid"}, {"name": "Ryoma"}, {"name": "Stuart"}, {"name": "Arduin"}, {"name": "Zill"},
  {"name": "Murad"}, {"name": "Ignis"}, {"name": "Zuka"}, {"name": "Airi"}, {"name": "Kaine"},
  {"name": "Lauriel"}, {"name": "Raz"}, {"name": "Skud"}, {"name": "Preyta"}, {"name": "Ilumia"},
  {"name": "Slimz"}, {"name": "Arthur"}, {"name": "Kriknak"}, {"name": "Ngộ Không"}, {"name": "Maloch"},
  {"name": "Helen"}, {"name": "Jinna"}, {"name": "Cresht"}, {"name": "Natalya"}, {"name": "Lumburr"},
  {"name": "Fennik"}, {"name": "Aleister"}, {"name": "Grakk"}, {"name": "Nakroth"}, {"name": "Taara"},
  {"name": "Toro"}, {"name": "Yorn"}, {"name": "Gildur"}, {"name": "Alice"}, {"name": "Azzen’Ka"},
  {"name": "Ormarr"}, {"name": "Butterfly"}, {"name": "Violet"}, {"name": "Chaugnar"}, {"name": "Điêu Thuyền"},
  {"name": "Zephys"}, {"name": "Kahlii"}, {"name": "Omega"}, {"name": "Triệu Vân"}, {"name": "Mganga"},
  {"name": "Krixi"}, {"name": "Mina"}, {"name": "Lữ Bố"}, {"name": "Veera"}, {"name": "Thane"}, {"name": "Valhein"}
];

const mainDir = 'd:/banpick/images/';
const mainFiles = fs.readdirSync(mainDir).filter(f => !fs.lstatSync(path.join(mainDir, f)).isDirectory());

const mappings = {
  "Triệu Vân": ["yan.jpg", "zanis", "triệu vân"], // Zanis? Wait, Triệu Vân in Garena list is hero #119.
  "The Flash": ["flash"],
  "Eland’orr": ["elandorr"],
  "D’Arcy": ["d'arcy"],
  "Y’bneth": ["ybneth"],
  "Azzen’Ka": ["azzenka"],
  "Kil’Groth": ["kilgroth"],
  "Tel’Annas": ["telannas"],
  "Ngộ Không": ["wukong"],
  "Lữ Bố": ["lu_bu", "lu bu"],
  "Điêu Thuyền": ["diaochan"],
  "TeeMee": ["teemee"],
  "Thane": ["thane"],
  "Zanis" : ["zanis"], // for legacy
};

function normalize(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '').replace(/[^a-z0-9]/g, '');
}

const finalHeroes = garenaHeroes.map(hero => {
  const vnName = hero.name;
  let searchName = normalize(vnName);
  
  // Try to find the BEST file in the root directory
  let bestFile = "";

  // 1. Check direct match (e.g. yan.jpg)
  const directMatch = mainFiles.find(f => normalize(f).startsWith(searchName) && (f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png')));
  if (directMatch) bestFile = directMatch;

  // 2. Check mapping match
  if (!bestFile && mappings[vnName]) {
    for (const m of mappings[vnName]) {
        const mm = mainFiles.find(f => normalize(f).includes(normalize(m)));
        if (mm) { bestFile = mm; break; }
    }
  }

  // 3. Last fallback: Check webp
  if (!bestFile) {
    const webpMatch = mainFiles.find(f => normalize(f).startsWith(searchName) && f.endsWith('.webp'));
    if (webpMatch) bestFile = webpMatch;
  }

  // 4. Ultimate fallback: use the icon from the ban folder (but point to root? No, better use icon)
  if (!bestFile) {
    bestFile = `ban/${vnName}.jpg`;
  }

  return { id: bestFile, name: vnName };
});

fs.writeFileSync('d:/banpick/heroes.json', JSON.stringify(finalHeroes, null, 4), 'utf8');
console.log(`Generated heroes.json with ${finalHeroes.length} heroes.`);
