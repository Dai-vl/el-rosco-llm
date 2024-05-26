import mongoose from 'mongoose';
import OpenAI from 'openai/index.mjs';
import Question from '../../models/question.js';
import axios from 'axios';
import config from '../../utils/config.js';
import fs from 'fs';
import path from 'path';


const dbURI =  config.MONGODB_URI2;
const openai = new OpenAI({
    apiKey: config.API_KEY 
});


let letras = ['a','b','c','d','e','f','g','h','i','j','l','m','n','o','p','q','r','s','t','u','v','x','y','z'];
let letra = '';

let correctas = 0;
let repetidas = 0;
let incorrectas = 0;

//Función para llamar a la API
const llamadaAPI = async (promptUser, tokens, temperatura, modelo) => {
    const llam = await openai.chat.completions.create({
        model: modelo,
        temperature: temperatura,
        messages: [
          {
            role: 'user',
            content: promptUser,
          }
        ],
        max_tokens: tokens,
    });
    return {
        contenido: llam.choices[0].message.content
    }
}

const comprobarDef = async (word, definition) => {

    let promptComprobarDef = 'Answer yes or no:\nWord: ' + word + '\nDescription: ' + definition + '\nDoes the description accurately represent the provided word?'

    const comp = await llamadaAPI(promptComprobarDef, 2, 0.2, "gpt-3.5-turbo");

    let arraySoluciones = ['Sí', 'Si.', 'Yes.', 'Yes'];

    if(arraySoluciones.indexOf(comp.contenido) !== -1){ 
        return true
    }
    else{
        return false
    }

}



//Función para buscar palabras que sean válidas
const getResponse = async (promptPedirPalabra) => {

    //Variables
    let palValida = 'N';
    let empiezaCon = '';
    let palabra = '';
    let descripcion = "";
    let dificultad = '';

    //Pedir la palabra
    console.log("Generando pregunta...");
    const pal = await llamadaAPI(promptPedirPalabra, 45, 1.1, "ft:gpt-3.5-turbo-0125:tfg:pruebapreguntas6:9GthMKlS:ckpt-step-284");
    

		//Llamada a la API de llama3 para arreglar el formato de GPT
		console.log('Llamando a llama3 para comprobar formato...')
		const respon = await fetch('http://localhost:11434/api/generate', {
			method: 'POST',
			headers: {
					'Content-Type': 'application/json'
			},
			body: JSON.stringify({
					model: 'llama3',
					prompt: `Next, I am going to give you a small text. The text should follow the following format: A single word, a blank space, followed by a single vertical bar (|), 
									a blank space, followed by the definition of the word, a blank space, followed by a single vertical bar (|), a blank space, and finally the difficulty of the word, 
									which can only be ONE WORD and must be one of Easy, Medium or Hard. For example, if the dificulty is something like Very Hard modify it to be Hard. Return only the text following the format 
									I just told you.
									Please, limit yourself to returning the formatted text and no more words. Stick very strictly to the format I have described to you. 
									Do not modify the word, the definition or the dificulty. 
									Now I am going to show you an example of the text you must return.
									INPUT: Cheese||||//|||A food made from the pressed and matured curds of milk||||//||||Very Easy
									OUTPUT: Cheese | A food made from the pressed and matured curds of milk | Easy
									
									The text is as follows: ${pal.contenido}`,
					stream: false
			})
		})	
		
		let salida = await respon.json();

    [palabra,descripcion,dificultad] = salida.response.split("|"); 

    [palabra,descripcion,dificultad] = pal.contenido.split("|"); 


    console.log("Palabra generada: " + palabra.trim());
    console.log("Definicion generada: " + descripcion.trim());
    console.log("Dificultad generada: " + dificultad.trim());
    
    console.log('Comprobando que la palabra esté bien generada...');
    //A mejorar en futuras versiones con un modelo que corrija el formato
    if(!palabra || !descripcion|| !dificultad ){
        console.log("Palabra mal generada");
				incorrectas++;
				fs.writeFileSync('./services/generacionPreguntas/valores.txt', correctas + ' ' + repetidas + ' ' + incorrectas);
        return {
            word: palabra,
            empieza: empiezaCon,
            desc: descripcion,
            dificulty:dificultad,
            valida: palValida
        }
    }
    palabra = palabra.trim();
    descripcion = descripcion.trim();
    dificultad = dificultad.trim();

    if((dificultad != "Easy" && dificultad != "Medium" && dificultad != "Hard" ) || palabra.includes(" ") || palabra.includes("'")){
        console.log("Palabra mal generada");
				incorrectas++;
				fs.writeFileSync('./services/generacionPreguntas/valores.txt', correctas + ' ' + repetidas + ' ' + incorrectas);
        return {
            word: palabra,
            empieza: empiezaCon,
            desc: descripcion,
            dificulty:dificultad,
            valida: palValida
        }
    }
    

    //********************************************//
    console.log('Comprobando si la palabra existe (comprobando con Wikipedia)...')
    palabra = palabra.trim()
    let apiUrl = 'https://en.wikipedia.org/w/rest.php/v1/search/page?q=' + palabra.toLowerCase()
    let respuesta  = await axios.get(apiUrl)

    if(!respuesta.data.pages.length){
        console.log('NO aparece en wikipedia')
				incorrectas++;
				fs.writeFileSync('./services/generacionPreguntas/valores.txt', correctas + ' ' + repetidas + ' ' + incorrectas);
        return {
            word: palabra,
            empieza: empiezaCon,
            desc: descripcion,
            dificulty:dificultad,
            valida: palValida
        }
    }
    else{
        console.log('SI aparece en wikipedia')
    }
    //********************************************//

    console.log('Comprobando posibles errores...');
    //Si no contiene la letra, error y salir
    if(!palabra.toLowerCase().includes(letra)){
        console.log('Error: Palabra que no contiene la letra '+ letra);
        incorrectas++;
				fs.writeFileSync('./services/generacionPreguntas/valores.txt', correctas + ' ' + repetidas + ' ' + incorrectas);
        return {
            word: palabra,
            empieza: empiezaCon,
            desc: descripcion,
            dificulty:dificultad,
            valida: palValida
        }
    }
    
    //Si ya existe en la base de datos, error y salir
    const repeatedQuestion = await Question.findOne({word: palabra});
    if(repeatedQuestion != null){
        console.log('Elemento ya estaba en la base de datos');
				repetidas++;
				fs.writeFileSync('./services/generacionPreguntas/valores.txt', correctas + ' ' + repetidas + ' ' + incorrectas);
        return {
            word: palabra,
            empieza: empiezaCon,
            desc: descripcion,
            dificulty:dificultad,
            valida: palValida
        }
    }

    console.log('Comprobando la definición...');
    //Comprobar que la definición no esté mal
    let estabien = await comprobarDef(palabra,descripcion);
    if(!estabien){
        console.log('Definicion mala');
				incorrectas++;
				fs.writeFileSync('./services/generacionPreguntas/valores.txt', correctas + ' ' + repetidas + ' ' + incorrectas);
        return {
            word: palabra,
            empieza: empiezaCon,
            desc: descripcion,
            dificulty:dificultad,
            valida: palValida
        }
    }

    //Comprobar que la palabra no esté en la definición   
    if(descripcion.toLowerCase().includes(palabra.toLowerCase())){
        console.log('La definicion contiene la palabra');
				incorrectas++;
				fs.writeFileSync('./services/generacionPreguntas/valores.txt', correctas + ' ' + repetidas + ' ' + incorrectas);
        return {
            word: palabra,
            empieza: empiezaCon,
            desc: descripcion,
            dificulty:dificultad,
            valida: palValida
        }
    }

    palValida = 'Y';

    //Si empieza por la letra, empiezaCon = 'Y', si no, empiezaCon = 'N'
    if(palabra.toLowerCase().startsWith(letra)){
        empiezaCon = 'Y';
    }
    else{
        empiezaCon = 'N';
    }

    return {
        word: palabra,
        empieza: empiezaCon,
        desc: descripcion,
        dificulty:dificultad,
        valida: palValida
    }
};


async function Main() {

    //Conexión a la base de datos
    await mongoose.connect(dbURI)
    console.log('Connected to the database');
		
		let data;

		data = fs.readFileSync('./services/generacionPreguntas/valores.txt', 'utf8');

		const valores = data.split(' ');
		correctas = valores[0];
		repetidas = valores[1];
		incorrectas = valores[2];

    //Añadir elementos a la base de datos

    for (let i = 0; i < 100; i++) {
        for (let j = 0; j < 24; j++) {
      

            letra = letras[j];
            const promptPedirPregunta = "Give me a word, definition and difficulty (Easy, Medium or Hard) for '"+letra+"' related to anything";
            let promptPal;

            try {
                promptPal = await getResponse(promptPedirPregunta);
                if (promptPal.valida == 'N') continue;
            } catch (error) {
                console.error(`Se ha producido un error: ${error}`);
                continue
            }
            

            // Crea una instancia del modelo y guarda en la base de datos
            const newQuestion = new Question({
                letter: letra,
                word: promptPal.word,
                description: promptPal.desc,
                startsWith: promptPal.empieza,
                language:'Eng',
                level: promptPal.dificulty
            });
            


            newQuestion.save()
            .then(() => {
                console.log('Palabra "' + promptPal.word + '" guardada');
            })
            .catch((err) => {
                console.error('Error al añadir elemento: ', err);
            });
						correctas++;
						fs.writeFileSync('./services/generacionPreguntas/valores.txt', correctas + ' ' + repetidas + ' ' + incorrectas);
        }
                  
    }
    
    
}


Main();

