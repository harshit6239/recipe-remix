import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro", systemInstruction: "you will be given an image as input and you will identify food items and ingredients in that image and output a json object with keys response having value of tyep boolean indicating that some item has been identified for true and no item identified for false, second key will be item having value an array of Strings which will contain identified food items and ingredients , and third key will be food having value an array of object with keys being food and recipe(should be an array of strings and give the recipe in step by step ordered manner without point number and not by url to another page). you should be 80% confident about the identified food item and ingredient or else discard that item or ingredient. if you identify some food item or ingredients try not to leave food array of output object empty. if you are unable to identify any food item or ingredient in the given photo the output object's response key should have a value of false. output should strictly be in json format without any labeling like ```json json``` ." });


const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function geminiApiCall(base64EncodedImage, fileType) {
  const image = {
    inlineData: {
      data: base64EncodedImage.split(",")[1],
      mimeType: fileType,
    },
  };

  const result = (await model.generateContent([image]));
  return result.response.text();
}

export default geminiApiCall;
// console.log(result.response.text());