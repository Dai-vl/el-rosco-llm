import mongoose from 'mongoose';
import OpenAI from 'openai';
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
const llamadaAPI = async (promptUser, promptAssistant, promptSystem, tokens, temperatura, modelo) => {
    const llam = await openai.chat.completions.create({
        model: modelo,
        temperature: temperatura,
        messages: [
            {
                role: 'system',
                content: promptSystem,
            },
            {
                role: 'user',
                content: promptUser,
            },
            {
                role: 'assistant',
                content: promptAssistant,
            },
        ],
        max_tokens: tokens,
    });
    return {
        contenido: llam.choices[0].message.content
    }
}

//Función para buscar palabras que sean válidas
const getResponse = async (promptPedirPalabra, ejemploSalidaPalabra, promptSystem) => {

    //Variables
    let palValida = 'N';
    let empiezaCon = '';
    let palabra = '';
    let descripcion = "";
    let dificultad = '';

    //Pedir la palabra
    const pal = await llamadaAPI(promptPedirPalabra, ejemploSalidaPalabra, promptSystem, 45, 1.2, "gpt-3.5-turbo");
    
    //Llamada a la API de llama3 para arreglar el formato de GPT
    console.log('Primera llamada a llama3')
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

    console.log(palabra);
    console.log(descripcion);
    console.log(dificultad);
    
    //A mejorar en futuras versiones con un modelo que corrija el formato
    if(!palabra || !descripcion|| !dificultad ){
        console.log("Palabra mal generada");
				incorrectas++;
				fs.writeFileSync('./services/generacionPreguntas/valoresGPT.txt', correctas + ' ' + repetidas + ' ' + incorrectas);
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

    if(dificultad != "Easy" && dificultad != "Medium" && dificultad != "Hard"){
        console.log("Palabra mal generada");
				incorrectas++;
				fs.writeFileSync('./services/generacionPreguntas/valoresGPT.txt', correctas + ' ' + repetidas + ' ' + incorrectas);
        return {
            word: palabra,
            empieza: empiezaCon,
            desc: descripcion,
            dificulty:dificultad,
            valida: palValida
        }
    }
    

    //********************************************//
  
    palabra = palabra.trim()
    let apiUrl = 'https://en.wikipedia.org/w/rest.php/v1/search/page?q=' + palabra.toLowerCase()
    let respuesta  = await axios.get(apiUrl)

    if(!respuesta.data.pages.length){
        console.log('NO aparece en wikipedia')
				incorrectas++;
				fs.writeFileSync('./services/generacionPreguntas/valoresGPT.txt', correctas + ' ' + repetidas + ' ' + incorrectas);
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


    //Si no contiene la letra, error y salir
    if(!palabra.toLowerCase().includes(letra)){
        console.log('Error: Palabra que no contiene la letra '+ letra);
        incorrectas++;
				fs.writeFileSync('./services/generacionPreguntas/valoresGPT.txt', correctas + ' ' + repetidas + ' ' + incorrectas);
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
        console.log('Elemento repetido');
				repetidas++;
				fs.writeFileSync('./services/generacionPreguntas/valoresGPT.txt', correctas + ' ' + repetidas + ' ' + incorrectas);
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
        console.log('Empieza por ' + letra);
    }
    else{
        empiezaCon = 'N';
        console.log('No empieza por ' + letra);
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

		data = fs.readFileSync('./services/generacionPreguntas/valoresGPT.txt', 'utf8');

		const valores = data.split(' ');
		correctas = valores[0];
		repetidas = valores[1];
		incorrectas = valores[2];

    //Añadir elementos a la base de datos

    for (let i = 0; i < 100; i++) {
        for (let j = 0; j < 24; j++) {
      

            letra = letras[j];
            const promptPedirPregunta = "Give me a word, definition and difficulty (Easy, Medium or Hard) for '"+letra+"' related to art";
            const promptAsist = "David | A masterpiece of Renaissance sculpture created by Michelangelo, depicting the biblical hero in the moment before his battle with Goliath | Hard";
            const promptSys = "This is a game where you receive a letter and return a word that starts with it (or contains it), its definition and also a difficulty (Easy, Medium or Hard) that refers to how common is that word. You can also return a name of something famous  that starts with that letter, a description for it and the difficulty. Remember not to say the exact word or name in the definition/description. Don't specify if you choose something famous or not.";



            const promptPal = await getResponse(promptPedirPregunta, promptAsist, promptSys);
            if (promptPal.valida == 'N') continue;
            

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
                console.log('Elemento añadido a la base de datos');
            })
            .catch((err) => {
                console.error('Error al añadir elemento:', err);
            });
						correctas++;
						fs.writeFileSync('./services/generacionPreguntas/valoresGPT.txt', correctas + ' ' + repetidas + ' ' + incorrectas);
        }
                  
    }
    
    
}


Main();

