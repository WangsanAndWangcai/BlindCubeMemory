export function generateScramble(length = 25) {
  const faces = ['U', 'D', 'L', 'R', 'F', 'B'];
  const modifiers = ['', "'", '2', '2\''];
  
  const opposite = {
    U: 'D', D: 'U',
    L: 'R', R: 'L',
    F: 'B', B: 'F'
  };

  let scramble = [];
  let lastFace = null;

  for (let i = 0; i < length; i++) {
    let face;
    do {
      face = faces[Math.floor(Math.random() * faces.length)];
      // 避免同一面或同一轴（对面）连续出现
    } while (face === lastFace || face === opposite[lastFace]);

    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    scramble.push(face + modifier);
    lastFace = face;
  }

  return scramble;
}