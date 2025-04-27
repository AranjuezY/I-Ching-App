export default function meihuaGenerator() {
  const mapper = ['000', '111', '011', '101', '001', '110', '010', '100'];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const dateString = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();
  const timeString = `${hour.toString().padStart(2, '0')}${minute.toString().padStart(2, '0')}${second.toString().padStart(2, '0')}`;
  const dateRemain = parseInt(dateString, 10) % 8;
  const timeRemain = parseInt(timeString, 10) % 8;
  const flipId = (dateRemain + timeRemain) % 6;
  const upperTri = mapper[dateRemain];
  const lowerTri = mapper[timeRemain];
  const hexagram = [upperTri + lowerTri];
  const mutual = [upperTri.slice(1) + lowerTri[0] + upperTri[2] + lowerTri.slice(0, 2)];
  const flipped = [];

  if (hexagram.length > 0 && flipId >= 0 && flipId < hexagram[0].length) {
    const hexagramArray = hexagram[0].split('');
    hexagramArray[flipId] = hexagramArray[flipId] === '0' ? '1' : '0';
    flipped.push(hexagramArray.join(''));
  }

  return {
    hexagram: hexagram,
    mutual: mutual,
    flipped: flipped,
    flipId: flipId
  };
}
