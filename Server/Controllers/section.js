const Survey = require("../Models/Survey");
const Section = require("../Models/Section");

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
        sections: survey.sections, // Pass the populated sections array to the view
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
        sections: survey.sections,
      });
    } catch (error) {
      res.status(500).send(error.toString());
    }
  },

  // Save a new section to a survey
  saveSurveyQuestion: async (req, res) => {
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
        title,
        description,
        order: nextOrder,
        ...(nextSection && { nextSection }), // Add nextSection if provided
      });
      const savedSection = await newSection.save();

      // Update the Survey to include the new Section
      survey.sections.push(savedSection._id);
      await survey.save();

      // Redirect or respond as necessary
      res.redirect(`/${surveyId}/sections`);
    } catch (error) {
      console.error("Error saving the section:", error);
      res.status(500).send(error.toString());
    }
  },

  // Delete a section from a survey
  deleteSection: async (req, res) => {
    const { surveyId, sectionId } = req.params;
    try {
      await Section.findByIdAndDelete(sectionId);

      // remove the section reference from the survey
      await Survey.findByIdAndUpdate(surveyId, {
        $pull: { sections: sectionId },
      });

      res.redirect(`/surveys/${surveyId}`);
    } catch (error) {
      res.status(500).send(error.toString());
    }
  },

  // Display form to edit an existing section
  displaySectionEditForm: async (req, res) => {
    const { sectionId } = req.params;
    try {
      const section = await Section.findById(sectionId);
      if (!section) {
        return res.status(404).send("Section not found");
      }
      // Render edit form with section data
      res.render("sectionEditForm", { section });
    } catch (error) {
      res.status(500).send(error.toString());
    }
  },

  // Update an existing section in a survey
  updateSurveySection: async (req, res) => {
    const { sectionId } = req.params;
    try {
      const updatedSection = await Section.findByIdAndUpdate(
        sectionId,
        req.body,
        { new: true }
      );
      if (!updatedSection) {
        return res.status(404).send("Section not found");
      }
      // Redirect or respond
      res.redirect(`/surveys/${updatedSection._id}`); // Adjust redirect as needed
    } catch (error) {
      res.status(400).send(error.toString());
    }
  },
};

module.exports = sectionController;
