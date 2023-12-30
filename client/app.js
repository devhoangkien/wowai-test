document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('drawCanvas');
  const context = canvas.getContext('2d');
  let isDrawing = false;
  let startCoords = {};
  let endCoords = {};

  canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    startCoords = { x: e.clientX, y: e.clientY };
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    drawRectangle(e.clientX, e.clientY);
  });

  canvas.addEventListener('mouseup', (e) => {
    if (isDrawing) {
      isDrawing = false;
      endCoords = { x: e.clientX, y: e.clientY };
      drawRectangle(endCoords.x, endCoords.y);
      callApiWithCoordinates(startCoords, endCoords);
    }
  });

  function drawRectangle(x, y) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeRect(startCoords.x, startCoords.y, x - startCoords.x, y - startCoords.y);
  }

  function callApiWithCoordinates(startCoords, endCoords) {
    console.log(startCoords, endCoords);
    const apiUrl = 'http://localhost:3000/api/command';
    const requestBody = {
      command: 'predict',
      coordinates: { start: startCoords, end: endCoords },
    };

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => console.log('API Response:', data))
      .catch(error => console.error('API Error:', error));
  }
});
