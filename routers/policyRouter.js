const { getAllPolicies, createNewPolicy, updatePolicy, updatePolicyEntry, deletePolicy, deletePolicyEntry } = require('../controllers/policyController');

const policyRouter = require('express').Router();

policyRouter.get("/policies/all", getAllPolicies);

policyRouter.post("/policies/specigic/:code", );

policyRouter.post("/policies", createNewPolicy);

policyRouter.put("/policies/:code", updatePolicy);

policyRouter.put("/policies/policyEntries/:code", updatePolicyEntry);

policyRouter.delete("/policies/:code", deletePolicy);

policyRouter.delete("/policies/policyEntries/:code", deletePolicyEntry);

module.exports = {policyRouter};