const express = require("express");

const app = express();
const PORT = 5000;

app.use(express.json());

const cases = [
  {
    reference: "CASE-1001",
    clientName: "ABC Company",
    status: "Open"
  },
  {
    reference: "CASE-1002",
    clientName: "XYZ Limited",
    status: "Closed"
  },
  {
    reference: "CASE-1003",
    clientName: "Bright Solutions",
    status: "Open"
  }
];

app.get("/", (req, res) => {
  res.json({
    message: "Secure Case Reference API is running"
  });
});

app.get("/api/cases", (req, res) => {
  res.json({
    success: true,
    data: cases
  });
});

app.get("/api/cases/:reference", (req, res) => {
  const caseReference = req.params.reference;

  const foundCase = cases.find(
    (item) => item.reference === caseReference
  );

  if (!foundCase) {
    return res.status(404).json({
      success: false,
      message: "No data found"
    });
  }

  res.json({
    success: true,
    data: foundCase
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});