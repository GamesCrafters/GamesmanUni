function drawHistory(style, roundHistory) {
  const roundCount = roundHistory.rounds.length;
  const canvas = document.getElementById("history");
  const canvasData = {
    context: canvas.getContext("2d"),
    backgroundColor: style.priColor,
    name1Color: style.secColor,
    name2Color: style.secColor,
    tieLabelColor: style.secColor,
    remotenessLabelColor: style.secColor,
    winColor: "green",
    tieColor: "yellow",
    loseColor: "red",
    roundLabelColor: style.secColor,
    remotenessColumnColor: style.secColor,
    remotenessIntervalColumnColor: style.secColor,
    tieLabel: "D",
    padding: 10,
    roundLabelWidth: 15,
    nameHeight: 15,
    remotenessLabelHeight: 15,
    gridWidth: null,
    gridHeight: null,
    gridCenter: null,
    gridTop: null,
    gridLeft: null,
    gridRight: null,
    gridBottom: null,
    remotenessWidth: null,
    roundHeight: 10,
    pointRadius: 5,
    points: { x: [], y: [] },
    linkWidth: 1,
    remotenessColumnWidth: 1,
    remotenessIntervalColumnWidth: 3,
    remotenessInterval: 5
  };

  function setcanvasData() {
    canvasData.gridWidth =
      canvas.width - 2 * (canvasData.padding + canvasData.roundLabelWidth);
    canvasData.gridHeight = (roundCount + 1) * canvasData.roundHeight;
    canvasData.gridCenter =
      canvasData.padding +
      canvasData.roundLabelWidth +
      canvasData.gridWidth / 2;
    canvasData.gridTop =
      canvasData.padding +
      canvasData.nameHeight +
      canvasData.remotenessLabelHeight +
      canvasData.roundHeight / 2;
    canvasData.gridBottom = canvasData.gridTop + canvasData.gridHeight;
    canvasData.gridLeft = canvasData.gridCenter - canvasData.gridWidth / 2;
    canvasData.gridRight = canvasData.gridCenter + canvasData.gridWidth / 2;
    canvasData.remotenessWidth = canvasData.gridWidth / (2 * maxRemoteness);
  }

  function setcanvasHeight() {
    canvas.height =
      (canvasData.padding + canvasData.remotenessLabelHeight) * 2 +
      canvasData.nameHeight +
      canvasData.gridHeight;
  }

  function setcanvasBackground() {
    canvasData.context.fillStyle = canvasData.backgroundColor;
    canvasData.context.fillRect(0, 0, canvas.width, canvas.height);
  }

  function setNames() {
    canvasData.context.textBaseline = "middle";
    canvasData.context.textAlign = "center";
    canvasData.context.font = style.font;

    canvasData.context.fillStyle = canvasData.name1Color;
    canvasData.context.fillText(
      turnNames[0],
      canvas.width / 2 - (canvasData.remotenessWidth * maxRemoteness) / 2,
      canvasData.padding + canvasData.nameHeight / 2
    );

    canvasData.context.fillStyle = canvasData.name2Color;
    canvasData.context.fillText(
      turnNames[1],
      canvas.width / 2 + (canvasData.remotenessWidth * maxRemoteness) / 2,
      canvasData.padding + canvasData.nameHeight / 2
    );
  }

  function setRemotenessLabels() {
    canvasData.context.textBaseline = "middle";
    canvasData.context.textAlign = "center";
    canvasData.context.font = style.font;

    canvasData.context.fillStyle = canvasData.tieLabelColor;

    canvasData.context.fillText(
      canvasData.tieLabel,
      canvasData.gridCenter,
      canvasData.gridTop -
        canvasData.roundHeight / 2 -
        canvasData.remotenessLabelHeight / 2
    );

    canvasData.context.fillText(
      canvasData.tieLabel,
      canvasData.gridCenter,
      canvasData.gridBottom + canvasData.roundHeight / 2
    );

    canvasData.context.fillStyle = canvasData.remotenessLabelColor;

    for (let i = 0; i < maxRemoteness; i += canvasData.remotenessInterval) {
      canvasData.context.fillText(
        i,
        canvasData.gridLeft + i * canvasData.remotenessWidth,
        canvasData.gridTop -
          canvasData.roundHeight / 2 -
          canvasData.remotenessLabelHeight / 2
      );

      canvasData.context.fillText(
        i,
        canvasData.gridLeft + i * canvasData.remotenessWidth,
        canvasData.gridBottom + canvasData.roundHeight / 2
      );

      canvasData.context.fillText(
        i,
        canvasData.gridRight - i * canvasData.remotenessWidth,
        canvasData.gridTop -
          canvasData.roundHeight / 2 -
          canvasData.remotenessLabelHeight / 2
      );

      canvasData.context.fillText(
        i,
        canvasData.gridRight - i * canvasData.remotenessWidth,
        canvasData.gridBottom + canvasData.roundHeight / 2
      );
    }
  }

  function setRoundLabels() {
    canvasData.context.textBaseline = "middle";
    canvasData.context.textAlign = "center";
    canvasData.context.font = style.font;

    canvasData.context.fillStyle = canvasData.roundLabelColor;
    for (let i = 0; i <= roundCount; i++) {
      canvasData.context.fillText(
        i,
        canvasData.padding + canvasData.roundLabelWidth / 2,
        canvasData.gridTop + i * canvasData.roundHeight
      );
      canvasData.context.fillText(
        i,
        canvas.width - (canvasData.roundLabelWidth / 2 + canvasData.padding),
        canvasData.gridTop + i * canvasData.roundHeight
      );
    }
  }

  function setGrid() {
    for (let i = 0; i <= maxRemoteness; i++) {
      if (i % canvasData.remotenessInterval == 0 || i == maxRemoteness) {
        canvasData.context.strokeStyle =
          canvasData.remotenessIntervalColumnColor;
        canvasData.context.lineWidth = canvasData.remotenessIntervalColumnWidth;
      } else {
        canvasData.context.strokeStyle = canvasData.remotenessColumnColor;
        canvasData.context.lineWidth = canvasData.remotenessColumnWidth;
      }

      canvasData.context.beginPath();
      canvasData.context.moveTo(
        canvasData.gridLeft + i * canvasData.remotenessWidth,
        canvasData.gridTop - canvasData.roundHeight / 2
      );
      canvasData.context.lineTo(
        canvasData.gridLeft + i * canvasData.remotenessWidth,
        canvasData.gridBottom - canvasData.roundHeight / 2
      );
      canvasData.context.stroke();

      canvasData.context.beginPath();
      canvasData.context.moveTo(
        canvasData.gridRight - i * canvasData.remotenessWidth,
        canvasData.gridTop - canvasData.roundHeight / 2
      );
      canvasData.context.lineTo(
        canvasData.gridRight - i * canvasData.remotenessWidth,
        canvasData.gridBottom - canvasData.roundHeight / 2
      );
      canvasData.context.stroke();
    }
  }

  function setPoints() {
    let x = canvasData.gridCenter;
    let y = canvasData.gridTop;
    canvasData.points.x.push(x);
    canvasData.points.y.push(y);
    canvasData.context.fillStyle = canvasData.tieColor;
    canvasData.context.beginPath();
    canvasData.context.arc(x, y, canvasData.pointRadius, 0, 2 * Math.PI);
    canvasData.context.closePath();
    canvasData.context.fill();

    for (let i = 1; i <= roundCount; i++) {
      if (roundHistory.turns[i] == 0) {
        x =
          canvasData.gridLeft +
          roundHistory.remotenesses[i] * canvasData.remotenessWidth;
      } else {
        x =
          canvasData.gridRight -
          roundHistory.remotenesses[i] * canvasData.remotenessWidth;
      }
      y = canvasData.gridTop + i * canvasData.roundHeight;
      canvasData.points.x.push(x);
      canvasData.points.y.push(y);
      if (roundHistory.valueCodes[i] == 1) {
        canvasData.context.fillStyle = canvasData.winColor;
      } else if (roundHistory.valueCodes[i] == 3) {
        canvasData.context.fillStyle = canvasData.loseColor;
      } else {
        canvasData.context.fillStyle = canvasData.tieColor;
      }
      canvasData.context.beginPath();
      canvasData.context.arc(x, y, canvasData.pointRadius, 0, 2 * Math.PI);
      canvasData.context.closePath();
      canvasData.context.fill();
    }
  }

  function setLinks() {
    canvasData.context.strokeStyle = canvasData.tieColor;
    canvasData.context.lineWidth = canvasData.linkWidth;
    for (let i = 0; i < roundCount; i++) {
      canvasData.context.beginPath();
      canvasData.context.moveTo(canvasData.points.x[i], canvasData.points.y[i]);
      canvasData.context.lineTo(
        canvasData.points.x[i + 1],
        canvasData.points.y[i + 1]
      );
      canvasData.context.stroke();
    }
  }

  setcanvasData();
  setcanvasHeight();
  setcanvasBackground();
  setNames();
  setRemotenessLabels();
  setRoundLabels();
  setGrid();
  setPoints();
  setLinks();
}
