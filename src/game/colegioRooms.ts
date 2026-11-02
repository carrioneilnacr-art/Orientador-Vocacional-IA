import type {PatioSolid} from './colegioPatio';
export type SchoolRoomId='laboratorio'|'taller'|'tecnologia';
export const schoolCharacters={
 elena:{name:'Profesora Elena',role:'Orientadora del colegio',src:'/game/colegio/elena.png',crop:[0,0,369,724] as const},
 diego:{name:'Diego',role:'Laboratorio de Ciencias',src:'/game/colegio/diego.png',crop:[0,0,389,724] as const},
 lucia:{name:'Lucía',role:'Taller Creativo',src:'/game/colegio/lucia.png',crop:[0,0,374,711] as const},
 andres:{name:'Andrés',role:'Aula Tecnológica',src:'/game/colegio/andres.png',crop:[0,0,434,724] as const},
 sofia:{name:'Sofía',role:'Delegada del segundo piso',src:'/game/colegio/sofia.png',crop:[0,0,415,709] as const},
};
export const schoolDoors:readonly {x:number;room:SchoolRoomId;label:string}[]=[
 {x:1340,room:'laboratorio',label:'Laboratorio de Ciencias'},
 {x:1045,room:'taller',label:'Taller Creativo'},
 {x:590,room:'tecnologia',label:'Aula Tecnológica'},
];
const box=(id:string,x:number,y:number,rx:number,ry:number):PatioSolid=>({id,x,y,rx,ry});
const npcFeet=(id:string,x:number,y:number):PatioSolid=>({id,x,y,rx:22,ry:11,ellipse:true});
export const roomNpcHeight=152;
export const roomTalkRadius=112;
export const schoolRooms={
 laboratorio:{name:'Laboratorio de Ciencias',npc:schoolCharacters.diego,question:'Queremos comparar cómo crecen dos plantas. ¿Qué te gustaría aportar?',choices:['Observar y registrar los cambios.','Preparar los materiales del experimento.','Compartir lo que descubrimos.'] as const,objects:[
 npcFeet('diego',1165,635),
 box('isla-experimentos',646,574,390,105),
 box('taburete-1',466,705,42,28),box('taburete-2',670,705,42,28),box('taburete-3',870,705,42,28),
 box('armario-izquierdo',200,376,126,26),box('mesa-fondo-izquierda',463,382,133,22),
 box('mesa-fondo-central',876,386,277,24),box('vitrina-derecha',1230,385,65,24),
 box('vitrina-ventana',1416,374,64,25),box('taburete-ventana',1400,453,38,25),
 box('mesa-microscopio',1480,478,48,46),box('armarios-laterales',1622,622,48,175),
 box('armarios-izquierda',60,614,60,153),
 box('muro-frente-izq',310,852,310,60),box('muro-frente-der',1383,852,289,60),
 box('maceta-salida-izq',551,906,45,33),box('maceta-salida-der',1121,906,45,33)
]},
 taller:{name:'Taller Creativo',npc:schoolCharacters.lucia,question:'Vamos a crear una obra sobre nuestro colegio. ¿Por dónde comenzarías?',choices:['Elegir colores y formas.','Contar una historia del colegio.','Probar materiales y texturas.'] as const,objects:[
 npcFeet('lucia',1140,684),
 box('estanteria-izquierda',92,497,87,154),box('busto-pedestal',223,470,31,33),
 box('estanteria-fondo',391,404,123,25),box('materiales-fondo',822,403,276,24),
 box('armario-fondo',1218,402,64,25),
 box('caballete-izquierdo',366,595,76,55),box('carrito-pinturas-izq',268,631,48,28),
 box('taburete-izquierdo',388,669,38,25),box('caballete-fondo',970,499,64,37),
 box('carrito-pinturas-fondo',1055,516,35,25),box('caballete-derecho',1325,579,74,47),
 box('taburete-derecho',1310,642,38,25),box('carrito-pinturas-der',1413,624,44,27),
 box('mesa-creativa',816,658,168,61),box('taburete-mesa-izq',618,698,33,24),box('taburete-mesa-der',1019,698,32,24),
 box('banco-materiales-ventana',1566,528,104,96),
 box('maceta-izq',65,812,70,42),box('maceta-der',1598,812,72,42),
 box('muro-frente-izq',310,912,310,29),box('muro-frente-der',1360,912,312,29)
]},
 tecnologia:{name:'Aula Tecnológica',npc:schoolCharacters.andres,question:'Una computadora no enciende. ¿Qué te daría curiosidad hacer?',choices:['Revisar las conexiones con cuidado.','Investigar la causa antes de probar.','Pedir al equipo que compare sus ideas.'] as const,objects:[
 npcFeet('andres',1010,625),
 box('mesa-docente',870,445,164,66),
 box('estanterias-izquierda',457,385,215,22),box('estanterias-derecha',1309,383,144,22),
 box('mesa-izq-fondo',240,408,71,38),box('mesa-izq-centro',155,519,80,35),box('mesa-izq-frente',66,660,63,65),
 box('silla-izq-fondo',278,449,32,24),box('silla-izq-centro',218,546,36,27),box('silla-izq-frente',117,670,44,28),
 box('mesa-der-fondo',1445,410,65,35),box('mesa-der-centro',1519,505,78,50),box('mesa-der-frente',1610,662,61,65),
 box('silla-der-fondo',1402,451,32,24),box('silla-der-centro',1469,549,36,27),box('silla-der-frente',1547,668,44,28),
 box('muro-frente-izq',325,806,325,60),box('muro-frente-der',1357,806,315,60),
 box('maceta-salida-izq',550,861,48,35),box('maceta-salida-der',1121,861,48,35)
]},
} as const;

// Inset floor outline traced at the feet. Only the central doorway continues
// through the front wall. The sloping sides follow the window counters.
export const roomFloors:Record<SchoolRoomId,readonly (readonly [number,number])[]>={
 laboratorio:[[680,922],[990,922],[990,789],[1598,789],[1598,713],[1515,570],[1420,470],[1404,412],[1298,399],[1151,413],[602,413],[320,405],[135,405],[87,550],[124,620],[124,788],[680,788]],
 taller:[[642,922],[1028,922],[1028,857],[1573,857],[1573,663],[1485,575],[1416,469],[1375,427],[507,427],[267,430],[185,505],[184,572],[51,655],[51,857],[642,857]],
 tecnologia:[[681,922],[990,922],[990,736],[1592,736],[1592,629],[1517,504],[1408,407],[1145,405],[1100,391],[655,399],[335,407],[253,486],[167,593],[86,701],[86,736],[681,736]],
};

function onRoomFloor(room:SchoolRoomId,x:number,y:number){
 const vertices=roomFloors[room];
 let inside=false;
 for(let i=0,j=vertices.length-1;i<vertices.length;j=i++){
  const [ax,ay]=vertices[i],[bx,by]=vertices[j];
  if((ay>y)!==(by>y)&&x<(bx-ax)*(y-ay)/(by-ay)+ax)inside=!inside;
 }
 return inside;
}

export function schoolRoomBlocked(room:SchoolRoomId,x:number,y:number,objects:readonly PatioSolid[]):boolean {
 if(!onRoomFloor(room,x,y))return true;
 return objects.some(object=>{
  const dx=Math.abs(x-object.x),dy=Math.abs(y-object.y);
  if(object.ellipse)return (dx/(object.rx+10))**2+(dy/(object.ry+10))**2<=1;
  // Rounded contact at furniture corners lets the feet slide around an edge.
  return Math.hypot(Math.max(0,dx-object.rx),Math.max(0,dy-object.ry))<=10;
 });
}

export const roomForeground:Record<SchoolRoomId,readonly {depth:number;outline:readonly (readonly [number,number])[]}[]>={
 laboratorio:[{depth:680,outline:[[315,444],[1028,444],[1040,550],[1036,677],[260,677],[253,555]]}],
 taller:[
  {depth:652,outline:[[302,400],[405,395],[433,546],[418,558],[445,648],[428,651],[404,562],[335,569],[321,643],[303,643],[319,556]]},
  {depth:541,outline:[[922,308],[1034,309],[1034,442],[1016,454],[1025,538],[1005,540],[990,456],[939,452],[922,532],[903,531],[921,443]]},
  {depth:628,outline:[[1280,349],[1393,367],[1373,527],[1357,535],[1377,627],[1356,627],[1336,538],[1281,535],[1259,622],[1239,621],[1259,525]]},
  {depth:724,outline:[[669,567],[973,567],[986,648],[973,657],[975,722],[955,723],[953,661],[669,660],[668,723],[647,723],[647,638]]},
 ],
 tecnologia:[{depth:513,outline:[[719,349],[1025,349],[1038,408],[1034,511],[1020,511],[1020,491],[718,491],[718,511],[703,511],[703,405]]}],
};
