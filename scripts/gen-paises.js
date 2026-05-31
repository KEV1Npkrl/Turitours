const fs = require('fs');
const paises = [
  ['Afganistán','AF'],['Albania','AL'],['Alemania','DE'],['Andorra','AD'],['Angola','AO'],['Antigua y Barbuda','AG'],
  ['Arabia Saudita','SA'],['Argelia','DZ'],['Argentina','AR'],['Armenia','AM'],['Australia','AU'],['Austria','AT'],
  ['Azerbaiyán','AZ'],['Bahamas','BS'],['Bangladés','BD'],['Barbados','BB'],['Baréin','BH'],['Bélgica','BE'],
  ['Belice','BZ'],['Benín','BJ'],['Bielorrusia','BY'],['Bolivia','BO'],['Bosnia y Herzegovina','BA'],['Botsuana','BW'],
  ['Brasil','BR'],['Brunéi','BN'],['Bulgaria','BG'],['Burkina Faso','BF'],['Burundi','BI'],['Bután','BT'],
  ['Cabo Verde','CV'],['Camboya','KH'],['Camerún','CM'],['Canadá','CA'],['Catar','QA'],['Chad','TD'],
  ['Chile','CL'],['China','CN'],['Chipre','CY'],['Colombia','CO'],['Comoras','KM'],['Corea del Norte','KP'],
  ['Corea del Sur','KR'],['Costa de Marfil','CI'],['Costa Rica','CR'],['Croacia','HR'],['Cuba','CU'],['Dinamarca','DK'],
  ['Dominica','DM'],['Ecuador','EC'],['Egipto','EG'],['El Salvador','SV'],['Emiratos Árabes Unidos','AE'],
  ['Eritrea','ER'],['Eslovaquia','SK'],['Eslovenia','SI'],['España','ES'],['Estados Unidos','US'],['Estonia','EE'],
  ['Esuatini','SZ'],['Etiopía','ET'],['Filipinas','PH'],['Finlandia','FI'],['Fiyi','FJ'],['Francia','FR'],
  ['Gabón','GA'],['Gambia','GM'],['Georgia','GE'],['Ghana','GH'],['Granada','GD'],['Grecia','GR'],
  ['Guatemala','GT'],['Guinea','GN'],['Guinea Ecuatorial','GQ'],['Guinea-Bisáu','GW'],['Guyana','GY'],
  ['Haití','HT'],['Honduras','HN'],['Hungría','HU'],['India','IN'],['Indonesia','ID'],['Irak','IQ'],
  ['Irán','IR'],['Irlanda','IE'],['Islandia','IS'],['Israel','IL'],['Italia','IT'],['Jamaica','JM'],
  ['Japón','JP'],['Jordania','JO'],['Kazajistán','KZ'],['Kenia','KE'],['Kirguistán','KG'],['Kiribati','KI'],
  ['Kuwait','KW'],['Laos','LA'],['Lesoto','LS'],['Letonia','LV'],['Líbano','LB'],['Liberia','LR'],
  ['Libia','LY'],['Liechtenstein','LI'],['Lituania','LT'],['Luxemburgo','LU'],['Madagascar','MG'],
  ['Malasia','MY'],['Malaui','MW'],['Maldivas','MV'],['Malí','ML'],['Malta','MT'],['Marruecos','MA'],
  ['Marshall','MH'],['Mauricio','MU'],['Mauritania','MR'],['México','MX'],['Micronesia','FM'],['Moldavia','MD'],
  ['Mónaco','MC'],['Mongolia','MN'],['Montenegro','ME'],['Mozambique','MZ'],['Myanmar','MM'],['Namibia','NA'],
  ['Nauru','NR'],['Nepal','NP'],['Nicaragua','NI'],['Níger','NE'],['Nigeria','NG'],['Noruega','NO'],
  ['Nueva Zelanda','NZ'],['Omán','OM'],['Países Bajos','NL'],['Pakistán','PK'],['Palaos','PW'],['Panamá','PA'],
  ['Papúa Nueva Guinea','PG'],['Paraguay','PY'],['Polonia','PL'],['Portugal','PT'],['Reino Unido','GB'],
  ['República Centroafricana','CF'],['República Checa','CZ'],['República del Congo','CG'],
  ['República Democrática del Congo','CD'],['República Dominicana','DO'],['Ruanda','RW'],['Rumania','RO'],
  ['Rusia','RU'],['Samoa','WS'],['San Cristóbal y Nieves','KN'],['San Marino','SM'],['San Vicente y las Granadinas','VC'],
  ['Santa Lucía','LC'],['Santo Tomé y Príncipe','ST'],['Senegal','SN'],['Serbia','RS'],['Seychelles','SC'],
  ['Sierra Leona','SL'],['Singapur','SG'],['Siria','SY'],['Somalia','SO'],['Sri Lanka','LK'],['Sudáfrica','ZA'],
  ['Sudán','SD'],['Sudán del Sur','SS'],['Suecia','SE'],['Suiza','CH'],['Surinam','SR'],['Tailandia','TH'],
  ['Tanzania','TZ'],['Tayikistán','TJ'],['Timor Oriental','TL'],['Togo','TG'],['Tonga','TO'],
  ['Trinidad y Tobago','TT'],['Túnez','TN'],['Turkmenistán','TM'],['Turquía','TR'],['Tuvalu','TV'],
  ['Ucrania','UA'],['Uganda','UG'],['Uruguay','UY'],['Uzbekistán','UZ'],['Vanuatu','VU'],['Vaticano','VA'],
  ['Venezuela','VE'],['Vietnam','VN'],['Yemen','YE'],['Zambia','ZM'],['Zimbabue','ZW']
];
const rest = paises.sort((a, b) => a[0].localeCompare(b[0], 'es'));
const ordered = [['Perú', 'PE'], ...rest.filter(p => p[1] !== 'PE')];
const lines = ordered.map((p, i) => {
  const nombre = p[0].replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return `    { id: ${i + 1}, nombre: '${nombre}', codigo_iso: '${p[1]}' }`;
}).join(',\n');
const content = `/**
 * Catalogo de paises — tabla paises (nombre VARCHAR(80), codigo_iso CHAR(2))
 * Alineado con database/bd_turismo_tarapoto.sql (Peru id=1 por defecto)
 */
function isoToFlagClass(iso) {
    if (!iso || iso.length !== 2) return 'fi fi-xx';
    return 'fi fi-' + iso.toLowerCase();
}

function isoToFlag(iso) {
    return isoToFlagClass(iso);
}

const PAISES_CATALOGO = [
${lines}
];

if (typeof window !== 'undefined') {
    window.PAISES_CATALOGO = PAISES_CATALOGO;
    window.isoToFlagClass = isoToFlagClass;
    window.isoToFlag = isoToFlag;
}
`;
fs.writeFileSync(require('path').join(__dirname, '../public/js/paises.js'), content, 'utf8');
console.log('Generados', ordered.length, 'paises');
