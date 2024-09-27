function calculateScores() {
  let totalStrokes = 0;
  let totalPutts = 0;

  for (let i = 1; i <= 18; i++) {
    const stroke = parseInt(document.getElementById(`stroke${i}`).value);
    const putt = parseInt(document.getElementById(`putt${i}`).value);

    totalStrokes += stroke;
    totalPutts += putt;
  }

  const averageStrokes = totalStrokes / 18;
  const averagePutts = totalPutts / 18;

  document.getElementById("result").innerHTML = `
        <p>合計ストローク: ${totalStrokes}</p>
        <p>合計パット: ${totalPutts}</p>
        <p>平均ストローク: ${averageStrokes.toFixed(2)}</p>
        <p>平均パット: ${averagePutts.toFixed(2)}</p>
    `;
}
