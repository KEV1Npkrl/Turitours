const fs = require('fs');

const tour_imagenes = [
    { id: 1, tour_id: 1, url: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Castell_de_Lamas%2C_San_Mart%C3%ADn09.jpg', es_principal: 1, orden: 0 },
    { id: 2, tour_id: 2, url: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Port_de_Sauce_a_la_Laguna_de_Sauce_a_la_prov%C3%ADncia_de_San_Mart%C3%ADn.jpg', es_principal: 1, orden: 0 },
    { id: 3, tour_id: 3, url: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Cataras_de_Ahuashiyacu.jpg', es_principal: 1, orden: 0 },
    { id: 4, tour_id: 4, url: 'https://taytamaki.com/wp-content/uploads/2022/12/304542641_809456460209758_2804320703011965875_n-DeNoiseAI-standard-standard-scale-6_00x-gigapixel-3-1024x732.jpg', es_principal: 1, orden: 0 },
    { id: 5, tour_id: 5, url: 'https://leitoinntarapoto.com/media/tour/cataratas-de-pucayaquillo-nnguevhocnrn-1.jpg', es_principal: 1, orden: 0 },
    { id: 6, tour_id: 6, url: 'https://adventur.pe/wp-content/uploads/2024/07/bote-rojo.webp', es_principal: 1, orden: 0 },
    { id: 7, tour_id: 7, url: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Tarapoto.jpg', es_principal: 1, orden: 0 },
    { id: 8, tour_id: 8, url: 'https://consultasenlinea.mincetur.gob.pe/fichaInventario/foto.aspx?cod=643551', es_principal: 1, orden: 0 },
    { id: 9, tour_id: 9, url: 'https://tarapoto.tours/wp-content/uploads/2016/10/optimized_2289_07.jpg', es_principal: 1, orden: 0 },
    { id: 10, tour_id: 10, url: 'https://tarapoto.tours/wp-content/uploads/2016/07/tour-pishurayacu-3-1024x683.jpg', es_principal: 1, orden: 0 },
    { id: 11, tour_id: 11, url: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Port_de_Sauce_a_la_Laguna_de_Sauce_a_la_prov%C3%ADncia_de_San_Mart%C3%ADn.jpg', es_principal: 1, orden: 0 },
    { id: 12, tour_id: 12, url: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Tarapoto.jpg', es_principal: 1, orden: 0 },
    { id: 13, tour_id: 13, url: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Cataras_de_Ahuashiyacu.jpg', es_principal: 1, orden: 0 }
];

let rawData = fs.readFileSync('C:/xampp/htdocs/turitours/public/js/data.js', 'utf8');

const imgRegex = /tour_imagenes:\s*\[[\s\S]*?\]\s*,/;
rawData = rawData.replace(imgRegex, 'tour_imagenes: ' + JSON.stringify(tour_imagenes, null, 8) + ',');

rawData = rawData.replace(/MOCK_DB_VERSION = 10;/, 'MOCK_DB_VERSION = 11;');

fs.writeFileSync('C:/xampp/htdocs/turitours/public/js/data.js', rawData, 'utf8');
console.log('Imágenes reemplazadas por las provistas del usuario en data.js');
