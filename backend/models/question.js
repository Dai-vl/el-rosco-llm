import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
	letter: String,
    word: String,
    description: String,
    startsWith: String,
    language:String,
    level:String
})

questionSchema.set('toJSON', { 
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

export default mongoose.model('Question', questionSchema)