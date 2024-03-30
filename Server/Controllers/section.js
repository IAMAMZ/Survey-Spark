const Survey = require("../Models/Survey");
const Section = require("../Models/Section");
const Question = require("../Models/Question");
const User = require('../Models/User');
const mongoose = require("mongoose");

const sectionController = {
  displaySectionsInSurvey: async (req, res) => {
    const { surveyId } = req.params;
    try {
      const survey = await Survey.findById(surveyId).populate("sections");
      if (!survey) {
        return res.status(404).send("Survey not found");
      }

      res.render("section/index", {
        survey: survey,
        User: req.User,
        sections: survey.sections, // Pass the populated sections array to the view
      });
    } catch (error) {
      res.status(500).send(error.toString());
    }
  },
  displayQuestionPortal: async (req, res) => {
    const { sectionId } = req.params;
    try {
      const section = await Section.findById(sectionId)
        .populate("questions")
        .exec();

      if (!section) {
        return res.status(404).send("Section not found");
      }

      res.render("section/questionPortal", {
        surveyId: req.params.surveyId,
        User: req.User,
        section: section,
        questions: section.questions,
      });
    } catch (error) {
      res.status(500).send(error.toString());
    }
  },

  displaySectionCreateForm: async (req, res) => {
    const { surveyId } = req.params;
    try {
      const survey = await Survey.findById(surveyId).populate("sections");

      if (!survey) {
        return res.status(404).send("Survey not found");
      }

      res.render("section/create", {
        surveyId: req.params.surveyId,
        User: req.User,
        sections: survey.sections,
      });
    } catch (error) {
      res.status(500).send(error.toString());
    }
  },

  // Save a new section to a survey
  saveSurveySection: async (req, res) => {
    const { surveyId } = req.params;
    const { title, description, nextSection } = req.body;

    try {
      // First, find the survey and populate its sections to determine the next order value
      const survey = await Survey.findById(surveyId).populate("sections");
      if (!survey) {
        return res.status(404).send("Survey not found");
      }

      // Calculate the next order number by finding the maximum order in the existing sections
      // and adding 1. If there are no sections, start with 1.
      let nextOrder = 1;
      if (survey.sections && survey.sections.length > 0) {
        const maxOrder = survey.sections.reduce(
          (max, section) => (section.order > max ? section.order : max),
          0
        );
        nextOrder = maxOrder + 1;
      }

      // Create the new Section with the calculated order
      const newSection = new Section({
        surveyId: surveyId,
        title,
        description,
        order: nextOrder,
        ...(nextSection && { nextSection }), // Add nextSection if provided
      });
      const savedSection = await newSection.save();

      // Update the Survey to include the new Section
      survey.sections.push(savedSection._id);
      await survey.save();

      // Redirect
      res.redirect(`/survey/${surveyId}/sections`);
    } catch (error) {
      console.error("Error saving the section:", error);
      res.status(500).send(error.toString());
    }
  },

  // Delete a section from a survey
  deleteSection: async (req, res) => {
    const { surveyId, sectionId } = req.params;
    try {
      // Find the section to get its order before deletion
      const sectionToDelete = await Section.findById(sectionId);
      if (!sectionToDelete) {
        return res.status(404).send("Section not found");
      }
      const deletedSectionOrder = sectionToDelete.order;
  
      // Delete the section
      await Section.findByIdAndDelete(sectionId);
  
      // Remove the section reference from the survey
      await Survey.findByIdAndUpdate(surveyId, {
        $pull: { sections: sectionId },
      });
  
      // Decrement the order of subsequent sections
      await Section.updateMany(
        { surveyId: surveyId, order: { $gt: deletedSectionOrder } },
        { $inc: { order: -1 } } // Decrement the order by 1
      );
  
      res.redirect(`/survey/${surveyId}/sections`);
    } catch (error) {
      res.status(500).send(error.toString());
    }
  },

  // Display form to edit an existing section
  displaySectionEditForm: async (req, res) => {
    const { surveyId,sectionId } = req.params;
    try {
      const survey = await Survey.findById(surveyId).populate("sections");
     
      const allSections = survey.sections;
      // find the selected section
      const selectedSection = allSections.find(section=>section._id == sectionId);
      if (!allSections) {
        return res.status(404).send("Section not found");
      }
      // Render edit form with section data
      res.render("section/edit", { section:selectedSection,allSections, User: req.User });
    } catch (error) {
      res.status(500).send(error.toString());
    }
  },

  // Update an existing section in a survey
  updateSurveySection: async (req, res) => {
    const { surveyId, sectionId } = req.params;
    const { title, description, nextSection } = req.body;
    
    // Prepare the update object, excluding nextSection initially
    let update = {
      title,
      description,
    };

    console.log("we created update")
    
    // Conditionally add nextSection if it's not empty and is a valid ObjectId
    if (nextSection && mongoose.Types.ObjectId.isValid(nextSection)) {
      update.nextSection = nextSection;
    } else {
      // If nextSection is empty or invalid, ensure it is unset from the document--> we could refactor later to make next seciton empty by default
      update.$unset = { nextSection: "" };
    }
      console.log("HERE IS THE LEVEL WHERE I REACHED NO ERROR ")
      console.log(req.body._id);
      const updatedSection = await Section.findByIdAndUpdate(sectionId, update, { new: true });
      if (!updatedSection) {
        return res.status(404).send("Section not found");
      }
      // Redirect or respond
      res.redirect(`/survey/${surveyId}/sections`); 
   
  },
};

module.exports = sectionController;
