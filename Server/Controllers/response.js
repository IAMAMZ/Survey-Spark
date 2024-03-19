const Response = require("../Models/Response");
const Survey = require("../Models/Survey");
const Question = require("../Models/Question"); 
const User = require('../Models/User');

// response with quesitons is like a view model

const index = async (req, res, next) => {
    try {
        let surveysWithResponses = [];
        const surveys = await Survey.find(); // get all surveys

        for (let survey of surveys) {
            // For each survey, fetch its related responses
            const responses = await Response.find({ surveyId: survey._id }).populate('userId');// pupulate user id so we don't have to deal with it later

            // Prepare to add question texts to responses
            const responsesWithQuestions = [];
            for (let response of responses) {
                const answersWithQuestions = [];
                for (let answer of response.answers) {
                    // Fetch each question text by ID
                    const question = await Question.findById(answer.questionId);
                    if (question) {
                        answersWithQuestions.push({
                            ...answer.toObject(), // Spread existing answer data
                            questionText: question.text // Add the question text
                        });
                    } else {
                        answersWithQuestions.push(answer); // If no question found, just put the answer
                    }
                }

                // Add modified response with question texts to array
                responsesWithQuestions.push({
                    ...response.toObject(), // Convert Mongoose document to object
                    answers: answersWithQuestions // Replace answers with modified versions
                });
            }

            // Add the survey and its modified responses to the array
            surveysWithResponses.push({ survey, responses: responsesWithQuestions });
        }

        console.log("Surveys with Responses", surveysWithResponses);

        // Render your view with the combined data
        res.render("response/index", { surveysWithResponses, User: req.User });
    } catch (error) {
        console.error("Error fetching surveys and responses:", error);
        next(error); // Pass the error to the next middleware
    }
};

module.exports = {
    index
};
