const express = require('express');
const cors = require('cors')
const app = express();
const port = 3000
app.use(cors())
app.use(express.json());

// In-memory storage (replace with database in production)
let forms = [];
let formResponses = new Map();

app.get('/api/health', (req, res) => {
  res.json({"status": "healthy"});
});

// Create/Update form
app.get('/api/forms', (req, res) => {
  res.json(forms);
});

app.post('/api/forms', (req, res) => {
  const formData = req.body;
  const formId = formData.id || Date.now().toString();
  forms.push({ ...formData, id: formId });
  res.json({ id: formId, ...formData });
});

// Get form
app.get('/api/forms/:id', (req, res) => {
  const form = forms.find(item => item.id === req.params.id);
  if (!form) return res.status(404).json({ error: 'Form not found' });
  res.json(form);
});

app.post('/api/form-responses', (req, res) => {
  const response = req.body;
  const responseId = Date.now().toString();
  
  // Get existing responses for this form
  const formResponseList = formResponses.get(response.formId) || [];
  
  // Add new response
  formResponses.set(response.formId, [...formResponseList, { ...response, id: responseId }]);
  
  res.json({ success: true, responseId });
});

// Get responses for a specific form
app.get('/api/form-responses/:formId', (req, res) => {
  const responses = formResponses.get(req.params.formId) || [];
  res.json(responses);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
