const { getAllPolicies, createNewPolicy, updatePolicy, updatePolicyEntry, deletePolicy, deletePolicyEntry, getSpecificPolicy } = require('../controllers/policyController');

const policyRouter = require('express').Router();

policyRouter.get("/policies", getAllPolicies);

policyRouter.get("/policies/:code", getSpecificPolicy);

policyRouter.post("/policies", createNewPolicy);

policyRouter.put("/policies/:code", updatePolicy);

policyRouter.put("/policies/policyEntries/:code", updatePolicyEntry);

policyRouter.delete("/policies/:code", deletePolicy);

policyRouter.delete("/policies/policyEntries/:code", deletePolicyEntry);

module.exports = {policyRouter};