Para instalar las dependencias:

    sudo apt install python3-pip
    pip install -r requirements.txt

Organización de los archivos:
En la carpeta **fine_tuning** se encuentran los scripts necesarios para el entrenamiento del modelo. En la carpeta **data** se encuentran los archivos JSONL necesarios para entrenar o validar los modelos. En la carpeta **analysis** se encuentran los notebooks creados para medir el rendimiento de los modelos.

**fine_tuning/**:

- **upload_data**: Para cargar el archivo al cliente de OpenAI.

- **fine_tuning**: Para entrenar el modelo.

- **list_fine_tuning**: Para ver el nombre del modelo que luego se usa en questions.js.

- **delete_model**: Se le pasa por argumentos el nombre del modelo que se quiere eliminar.

**data/**:

- **generate_questions/**: Para generar preguntas a partir de un archivo JSONL (hay dos archivos, el de entrenamiento y el de validación).

- **roscobot/**: Archivos JSONL con los datasets para entrenar los modelos del modo vs. IA.

- **validation_prompts/**: Archivos JSONL con los datasets para medir el rendimiento el prompt de validación de respuestas.

**analysis/**:

- **analysis_generate_questions_theme.ipynb** : Notebook para analizar el rendimiento de las preguntas generadas por el modelo vs. la API con tema.

- **analysis_generate_questions.ipynb** : Notebook para analizar el rendimiento de las preguntas generadas por el modelo vs. la API sin tema.

- **analysis_roscobot.ipynb** : Notebook para analizar el rendimiento de los modelos vs. IA.

- **analysis_validation_answer.ipynb** : Notebook para analizar el rendimiento del prompt de validación de respuestas.

> [!NOTE]
> Para obtener información específica sobre el proyecto, consultar la documentación en la memoria del proyecto