export const validResponsePrompt = (realAnswer, possAnswer, definition) => {
    return `Answer me only with 1 if yes and 2 if not: 
    Definition: ${definition}
    Word: ${possAnswer}
    If the word doesnt exist just say 2.
    Does the word "${possAnswer}" match this definition "${definition}" entirely or is a synonym for the word ${realAnswer}?`
}

//BOT CONSTANTS
export const prodigyBotName = 'ProdigyBot'
export const mistakeBotName = 'MistakeBot'
export const prodigyBotDir = 'ft:gpt-3.5-turbo-0125:tfg:prodigy-bot:9K0x2IdL'
export const mistakeBotDir = 'ft:gpt-3.5-turbo-0125:tfg:mistake-bot:9K37TYuv'

export const getBotResponsePrompt = (firstPart, secondPart) => {
    return `Answer with only a real english word that ${firstPart}
    and means: ${secondPart}`
}

export const getBadBotResponsePrompt = (firstPart, secondPart) => {
    return `Answer with only one word that is wrong for this description: ${firstPart}${secondPart}`
}

