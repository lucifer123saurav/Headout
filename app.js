const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 8080;

app.get('/data', async (req, res) => {
  const { n, m } = req.query;

  if (!n) {
    return res.status(400).send('Query parameter "n" is required.');
  }

  try {
    const filePath = path.join('/tmp/data', `${n}.txt`);
    const fileContent = await fs.readFile(filePath, 'utf-8');

    if (m) {
      const lines = fileContent.split('\n');
      const lineNumber = parseInt(m, 10);

      if (lineNumber < 1 || lineNumber > lines.length) {
        return res.status(400).send('Invalid line number.');
      }

      return res.send(lines[lineNumber - 1]);
    } else {
      return res.send(fileContent);
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).send('File not found.');
    }

    console.error(error);
    return res.status(500).send('Internal Server Error.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

