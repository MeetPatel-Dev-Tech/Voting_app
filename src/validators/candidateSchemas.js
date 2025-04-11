const yup = require("yup");

// Create candidate - POST "/"
const createCandidateSchema = yup.object({
  name: yup.string().required("Name is required"),
  party: yup.string().required("Party is required"),
  age: yup.number().required("Age is required").min(25, "Minimum age is 25"),
});

// Update candidate - PUT "/:candidateId"
const updateCandidateSchema = yup.object({
  name: yup.string(),
  party: yup.string(),
  age: yup.number().min(25, "Minimum age is 25"),
});

// Validate :candidateId param
const candidateIdParamSchema = yup.object({
  candidateId: yup.string().length(24, "Invalid candidateId").required(),
});

// Validate vote path params - POST "/:vote/:candidateId"
const voteParamsSchema = yup.object({
  vote: yup.string().oneOf(["vote"], "Invalid vote path").required(),
  candidateId: yup.string().length(24, "Invalid candidateId").required(),
});

module.exports = {
  createCandidateSchema,
  updateCandidateSchema,
  candidateIdParamSchema,
  voteParamsSchema,
};
